#!/usr/bin/env python
import pymongo
import json
import time
from goldConsumer import gold
from web3 import Web3, HTTPProvider, __version__

config = json.load(open('config.json'))

web3 = Web3(HTTPProvider('http://kovan.decenter.com'))
abi = config['events']['abi']
contract = web3.eth.contract(abi, config['events']['contractAddress'])

signature_filter = contract.pastEvents('GoldBought', {'fromBlock': web3.eth.blockNumber - 100, 'toBlock': web3.eth.blockNumber - 10})
signature_events = signature_filter.get(False)

client = pymongo.MongoClient("localhost", 27017)
db = client.extendx

for signature_event in signature_events:
    signatureDB = db.gold.find_one({'signature': signature_event['args']['signature']})
    if not signatureDB:
        db.gold.insert_one({"signature": signature_event['args']['signature'], "time": time.time()})
        gold.give(signature_event['args']['to'], signature_event['args']['months'])


