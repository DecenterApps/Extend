#!/usr/bin/env node

const Web3 = require('web3');
const fs = require('fs');
const exec = require('child_process').exec;
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

    contract.GoldBought({}, { fromBlock: latestBlock, toBlock: 'latest' })
        .watch(async (err, event) => {
            const to = web3.toUtf8(event.args.to);
            const months = event.args.months;
            const id = web3.toUtf8(event.args.commentId);
            const nonce = event.args.nonce;
            const fromAddress = event.args.from;
            const signature = event.args.signature.toString();
            const reply = event.args.reply;

            const data = web3.fromWei(event.args.price.toString()) + '-' + to + '-' + fromAddress + '-' + id + '-' + months + '-' + event.args.priceUsd + '-' + nonce;

            fs.mkdirSync("verification" + nonce);
            fs.writeFileSync("verification" + nonce + "/data.txt", data);
            fs.writeFileSync("verification"  + nonce + "/sig.sha256", Buffer.from(signature, 'base64'));
            await exec("openssl dgst -sha256 -verify ../public.key -signature verification" + nonce + "/sig.sha256 verification" + nonce + "/data.txt", {"shell": "/bin/bash"}, (error, stdout, stderr) => {
                if (stdout === "Verified OK\n") {
                    try {
                        const message = "Username: " + to + ", fromAddress: " + fromAddress + ", id: " + id + ", reply: " + reply + " queued to goldQueue";

                        console.log(new Date().toLocaleString() + ", message: " + message);
                        request.post({url: config.slackWebhook, json: {"text":message}, headers: {"Content-type": "application/json"}});

                        amqp.connect('amqp://localhost', (err, conn) => {
                            conn.createChannel((err, ch) => {
                                const gild = {'toUsername': to, 'fromAddress': fromAddress, 'months': months, 'signature': signature, 'id': id, 'reply': reply, 'blockNumber': event.blockNumber};

                                MongoClient.connect(url, function(err, db) {
                                    let extendDb = db.db("extend");

                                    gild.sent = false;
                                    extendDb.collection("gild").insertOne(gild, () => {
                                        ch.assertQueue('gold', {durable: false});
                                        ch.sendToQueue('gold', new Buffer(JSON.stringify(gild)));
                                        db.close();
                                    });

                                    if (reply) {
                                        const tip = {'username': to, 'fromAddress': fromAddress, 'months': months, 'id': id, 'sent': false, 'blockNumber': event.blockNumber};
                                        extendDb.collection("tip").insertOne(tip, () => {
                                            db.close();
                                        });
                                    }
                                });
                            });
                        });
                    } catch (e) {
                        console.log('unable to queue message');
                    }
                }

                fs.unlinkSync("verification" + nonce + "/data.txt");
                fs.unlinkSync("verification"  + nonce + "/sig.sha256");
                fs.rmdirSync("verification" + nonce);
            });
        });
};

getWeb3();
