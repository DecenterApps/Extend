#!/usr/bin/env python
import time
import praw
import logging
import requests
import pika
import json
import logger
import thing

config = json.load(open('../config.json'))

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='tip')

logging.basicConfig(filename='gold.log',
                    level=logging.DEBUG,
                    format='%(asctime)s %(message)s')


def give(to_username, from_address, months, id, reply):
    logger.log("Logging in...")
    r = praw.Reddit(client_id=config['redditGold']['client_id'],
                    client_secret=config['redditGold']['client_secret'],
                    username=config['redditGold']['username'],
                    password=config['redditGold']['password'],
                    user_agent='bot')

    try:
        gildable_thing = thing.find_thing(id, r)

        # gildable_thing.gild()

        if months != '1':
            r.redditor(to_username).gild(months=int(months) - 1)

        logger.log("Gilded: " + id + " " + from_address + " gilded " + months + " month(s) " + to_username, slack=True)

        if reply:
            time.sleep(3)
            channel.basic_publish(exchange='',
                                  routing_key='tip',
                                  body=json.dumps({'username': to_username,
                                                   'fromAddress': from_address,
                                                   'months': months,
                                                   'id': id}))
            logger.log("Queued for commenting: " + id)

    except requests.exceptions.ConnectionError as e:
        logger.exception(e.response)
        return False
    except Exception as e:
        logger.exception(e)
        return False

    time.sleep(1)
