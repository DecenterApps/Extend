#!/usr/bin/env python
import pika
import json
import gold
import pymongo
import time
import logger
from subprocess import check_output

config = json.load(open('../config.json'))

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='gold')


def callback(ch, method, properties, body):
    decoded_body = json.loads(body.decode("utf-8"))

    signature = decoded_body['signature']
    months = decoded_body['months']
    to_username = decoded_body['toUsername']
    from_address = decoded_body['fromAddress']
    id = decoded_body['id']
    reply = decoded_body['reply']
    block_number = decoded_body['blockNumber']

    mongo_client = pymongo.MongoClient("localhost", 27017)
    db = mongo_client.extend.gild

    gild = db.find_one({"signature": signature})

    if not gild['sent']:
        logger.log("Giving gold to: " + to_username)

        gold.give(to_username=to_username,
                  from_address=from_address,
                  months=months,
                  id=id,
                  reply=reply,
                  block_number=block_number)

        gild['sent'] = True
        db.save(gild)

        logger.log("Checking gold credits")

        response = check_output([config['goldCurl']], shell=True).decode("utf-8").rstrip()[1:]

        logger.log(response, slack=True, channel=int(response.split(' ')[0]) < 6)

    mongo_client.close()


channel.basic_consume(callback,
                      queue='gold',
                      no_ack=True)

channel.start_consuming()
