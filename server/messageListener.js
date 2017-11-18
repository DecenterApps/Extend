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
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const getBlockNumber = (web3) =>
  new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, latestBlock) => {
      if (error) reject(error);

      resolve(latestBlock);
    });
  });

const getWeb3 = async () => {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://kovan.decenter.com'));

    const contract = web3.eth.contract(config.events.abi).at(config.events.contractAddress);

    const latestBlock = await getBlockNumber(web3);

    contract.UserTipped({}, { fromBlock: latestBlock, toBlock: 'latest' })
        .watch((err, event) => {
            const username = web3.toUtf8(event.args.username);
            const val = web3.fromWei(event.args.val.toString());
            const fromAddress = event.args.from;

            try {
                amqp.connect('amqp://localhost', (err, conn) => {
                    conn.createChannel((err, ch) => {
                        ch.assertQueue('message', {durable: false});
                        ch.sendToQueue('message', new Buffer(JSON.stringify({'username': username, 'fromAddress': fromAddress, 'val': val})));
                        console.log('Username: ' + username + " queued to messageQueue");
                    });
                });
            } catch (e) {
                console.log('unable to queue message');
            }
        });
};

getWeb3();
