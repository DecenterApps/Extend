#!/usr/bin/env node

const Web3 = require('web3');
const fs = require('fs');
const exec = require('child_process').exec;
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

    contract.UserTipped({}, { fromBlock: latestBlock - 50, toBlock: 'latest' }).get((err, events) => {
        events.forEach(event => {
            const username = web3.toUtf8(event.args.username);
            const val = web3.fromWei(event.args.val.toString());
            const fromAddress = event.args.from;
            const reply = event.args.reply;
            const id = web3.toUtf8(event.args.commentId);

            if (reply) {
                MongoClient.connect(url, function(err, db) {
                    let extendDb = db.db("extend");
                    extendDb.collection("tip").findOne({'username': username, 'fromAddress': fromAddress, 'id': id, 'amount': val, 'blockNumber': event.blockNumber}, (err, doc) => {
                        if (!doc) {
                            request.post({url: config.slackWebhook, json: {"text": "Tip not found!"}, headers: {"Content-type": "application/json"}});
                        } else {
                            if (!doc.sent) {
                               request.post({url: config.slackWebhook, json: {"text": "Comment still in queue"}, headers: {"Content-type": "application/json"}});
                            }
                        }

                        db.close();
                    });
                });
            }
        })
    });

    contract.GoldBought({}, { fromBlock: latestBlock - 50, toBlock: 'latest' }).get((err, events) => {
        events.forEach(async event => {
            const to = web3.toUtf8(event.args.to);
            const months = event.args.months;
            const id = web3.toUtf8(event.args.commentId);
            const nonce = event.args.nonce;
            const fromAddress = event.args.from;
            const signature = event.args.signature.toString();
            const reply = event.args.reply;

            const data = web3.fromWei(event.args.price.toString()) + '-' + to + '-' + fromAddress + '-' + id + '-' + months + '-' + event.args.priceUsd + '-' + nonce;

            fs.mkdirSync("check-verification" + nonce);
            fs.writeFileSync("check-verification" + nonce + "/data.txt", data);
            fs.writeFileSync("check-verification"  + nonce + "/sig.sha256", Buffer.from(signature, 'base64'));
            await exec("openssl dgst -sha256 -verify ../public.key -signature check-verification" + nonce + "/sig.sha256 check-verification" + nonce + "/data.txt", {"shell": "/bin/bash"}, (error, stdout, stderr) => {
                if (stdout === "Verified OK\n") {
                    MongoClient.connect(url, function(err, db) {
                        let extendDb = db.db("extend");

                        extendDb.collection("gild").findOne({"signature": signature}, (err, doc) => {
                            if (!doc) {
                                request.post({url: config.slackWebhook, json: {"text": "Gild not found!"}, headers: {"Content-type": "application/json"}});
                            } else {
                                if (!doc.sent) {
                                    request.post({url: config.slackWebhook, json: {"text": "Gild still in queue"}, headers: {"Content-type": "application/json"}});
                                }

                                if (doc.reply) {
                                    extendDb.collection("tip").findOne({'username': to, 'fromAddress': fromAddress, 'id': id, 'months': months, 'blockNumber': event.blockNumber}, (err, doc) => {
                                        if (!doc) {
                                            request.post({url: config.slackWebhook, json: {"text": "Tip not found!"}, headers: {"Content-type": "application/json"}});
                                        } else {
                                            if (!doc.sent) {
                                               request.post({url: config.slackWebhook, json: {"text": "Comment still in queue"}, headers: {"Content-type": "application/json"}});
                                            }
                                        }
                                    });
                                }
                            }

                            db.close();
                        });
                    });

                }

                fs.unlinkSync("check-verification" + nonce + "/data.txt");
                fs.unlinkSync("check-verification"  + nonce + "/sig.sha256");
                fs.rmdirSync("check-verification" + nonce);
            });
        });
    });
};

getWeb3();
