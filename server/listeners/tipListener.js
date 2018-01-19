#!/usr/bin/env node

/*
Libraries
 */
const Web3 = require('web3');
const fs = require('fs');

/*
Producer
 */
const amqp = require('amqplib/callback_api');

/*
Config
 */
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
            const commentId = web3.toUtf8(event.args.commentId);

            if (reply) {
                try {
                    amqp.connect('amqp://localhost', (err, conn) => {
                        conn.createChannel((err, ch) => {
                            ch.assertQueue('tip', {durable: false});
                            ch.sendToQueue('tip', new Buffer(JSON.stringify({'username': username, 'fromAddress': fromAddress, 'amount': val, 'id': commentId})));
                            console.log('Username ' + username + " queued to tipQueue");
                        });
                    });
                } catch (e) {
                    console.log('Unable to queue message');
                }
            }
        });
};

getWeb3();
