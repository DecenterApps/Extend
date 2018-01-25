#!/usr/bin/env python
import pika
import json
import commenter
import logger
import pymongo
import time
from web3 import Web3, HTTPProvider

config = json.load(open('../config.json', 'r'))

web3 = Web3(HTTPProvider(config['httpProvider']))
abi = config['func']['abi']
contract = web3.eth.contract(abi, config['func']['contractAddress'])

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='tip')


def callback(ch, method, properties, body):
    decoded_body = json.loads(body.decode("utf-8"))

    to_username = decoded_body['username']
    from_address = decoded_body['fromAddress']
    id = decoded_body['id']
    block_number = decoded_body['blockNumber']

    mongo_client = pymongo.MongoClient("localhost", 27017)
    db = mongo_client.extend.tip

    tip = db.find_one({"fromAddress": from_address, "username": to_username, "id": id, "blockNumber": block_number})

    if not tip['sent']:
        from_username = contract.call().getUsernameForAddress(from_address).rstrip('\x00')

        logger.log("Commenting: " + id)

        if 'amount' in decoded_body:
            commenter.comment(to_username=to_username,
                              from_username=from_username,
                              id=id,
                              amount=decoded_body['amount'])

        if 'months' in decoded_body:
            commenter.comment(to_username=to_username,
                              from_username=from_username,
                              id=id,
                              months=decoded_body['months'])

        tip['sent'] = True
        db.save(tip)

        time.sleep(600)
    else:
        logger.log("Already commented: " + id, slack=True)


channel.basic_consume(callback,
                      queue='tip',
                      no_ack=True)

channel.start_consuming()
