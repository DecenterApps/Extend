#!/usr/bin/env node

const Web3 = require('web3');
const fs = require('fs');
const amqp = require('amqplib/callback_api');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

const getBlockNumber = (web3) =>
  new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, latestBlock) => {
      if (error) reject(error);

      resolve(latestBlock);
    });
  });

const getWeb3 = async () => {
    let web3 = new Web3(new Web3.providers.HttpProvider(config.httpProvider));

    const contract = web3.eth.contract(config.events.abi).at(config.events.contractAddress);

    const latestBlock = await getBlockNumber(web3);

    contract.UserTipped({}, { fromBlock: latestBlock, toBlock: 'latest' })
        .watch((err, event) => {
            const username = web3.toUtf8(event.args.username);
            const val = web3.fromWei(event.args.val.toString());
            const fromAddress = event.args.from;
            const reply = event.args.reply;
            const id = web3.toUtf8(event.args.commentId);

            const message = "Username: " + username + ", fromAddress: " + fromAddress + ", id: " + id + ", reply: " + reply + " queued to tipdQueue";

            console.log(new Date().toLocaleString() + ", message: " + message);
            request.post({url: config.slackWebhook, json: {"text":message}, headers: {"Content-type": "application/json"}});

            if (reply) {
                try {
                    amqp.connect('amqp://localhost', (err, conn) => {
                        conn.createChannel((err, ch) => {
                            const tip = {'username': username, 'fromAddress': fromAddress, 'amount': val, 'id': id, 'blockNumber': event.blockNumber};

                            MongoClient.connect(url, function(err, db) {
                                let extendDb = db.db("extend");

                                tip.sent = false;
                                extendDb.collection("tip").insertOne(tip, () => {
                                    ch.assertQueue('tip', {durable: false});
                                    ch.sendToQueue('tip', new Buffer(JSON.stringify(tip)));
                                    db.close();
                                });
                            });
                        });
                    });
                } catch (e) {
                    console.log('Unable to queue message');
                }
            }
        });
};

getWeb3();
