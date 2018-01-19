#!/usr/bin/env python
import pika
import json
import gold
import pymongo
import time

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
    timestamp = time.time()

    client = pymongo.MongoClient("localhost", 27017)
    db = client.extend

    gold_db = db.gold.find_one({"signature": signature})
    if not gold_db:
        db.gold.insert_one({"signature": signature, "time": timestamp})

        print("giving gold to: " + to_username, flush=True)
        gold.give(to_username=to_username,
                  from_address=from_address,
                  months=months,
                  id=id)
    client.close()

    print(" [x] Received %r" % body, flush=True)

channel.basic_consume(callback,
                      queue='gold',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C', flush=True)
channel.start_consuming()
