#!/usr/bin/env python
import pika
import pymongo
import json
import time
import messenger
from web3 import Web3, HTTPProvider, __version__

config = json.load(open('../config.json', 'r'))

web3 = Web3(HTTPProvider('http://mainnet.decenter.com'))
abi = config['func']['abi']
contract = web3.eth.contract(abi, config['func']['contractAddress'])

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='message')

def callback(ch, method, properties, body):
    decoded_body = json.loads(body.decode('utf-8'))
    to_username = decoded_body['username']
    from_address = decoded_body['fromAddress']
    from_username = contract.call().getUsernameForAddress(from_address).rstrip('\x00')

    if 'months' in decoded_body:
        messenger.send(to_username=to_username,
                       from_username=from_username,
                       months=decoded_body['months'])
    else:
        response = contract.call().checkUsernameVerified(to_username.encode('utf-8'))
        val = decoded_body['val']

        if not response:
            client = pymongo.MongoClient('localhost', 27017)
            db = client.extend
            db.message.insert_one({'username': to_username, 'lastSentTipMessage': time.time()})

            print('sending message to: ' + to_username)
            messenger.send(to_username=to_username,
                           from_username=from_username,
                           eth_amount=val)

            client.close()

channel.basic_consume(callback,
                      queue='message',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
