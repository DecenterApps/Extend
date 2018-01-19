#!/usr/bin/env python
import pika
import json
import commenter
from web3 import Web3, HTTPProvider, __version__

config = json.load(open('../config.json', 'r'))

web3 = Web3(HTTPProvider(config['httpProvider']))
abi = config['func']['abi']
contract = web3.eth.contract(abi, config['func']['contractAddress'])

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='tip')

def callback(ch, method, properties, body):
    decoded_body = json.loads(body.decode("utf-8"))

    print(decoded_body, flush=True)
    to_username = decoded_body['username']
    from_address = decoded_body['fromAddress']
    id = decoded_body['id']
    test = decoded_body['test']

    print("from_address  " + from_address, flush=True)

    from_username = contract.call().getUsernameForAddress(from_address).rstrip('\x00')

    print("commenting " + id, flush=True)

    if 'amount' in decoded_body:
        commenter.comment(to_username=to_username,
                          from_username=from_username,
                          id=id,
                          amount=decoded_body['amount'],
                          test=test)

    if 'months' in decoded_body:
        commenter.comment(to_username=to_username,
                          from_username=from_username,
                          id=id,
                          months=decoded_body['months'],
                          test=test)


    print(" [x] Received %r" % body, flush=True)

channel.basic_consume(callback,
                      queue='tip',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C', flush=True)
channel.start_consuming()
