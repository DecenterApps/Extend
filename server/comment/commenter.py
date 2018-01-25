#!/usr/bin/env python
import time
import praw
import logging
import requests
import pika
import json
import redis
import comment_template
import logger
import thing

config = json.load(open('../config.json'))

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='tip')

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

logging.basicConfig(filename='tip.log',
                    level=logging.DEBUG,
                    format='%(asctime)s %(message)s')


def comment(to_username, from_username, id, amount=None, months=None):
    logger.log("Logging in...")
    r = praw.Reddit(client_id=config['reddit']['client_id'],
                    client_secret=config['reddit']['client_secret'],
                    username=config['reddit']['username'],
                    password=config['reddit']['password'],
                    user_agent='bot')

    try:
        commentable_thing = thing.find_thing(id, r)

        expire = redis_client.ttl('comment')

        if expire > 0:
            logger.log('Current expire on comment: ' + str(expire))
            time.sleep(expire)

        redis_client.set('comment', 1)
        redis_client.expire('comment', 600)

        from_username = '[/u/' + from_username + '](https://reddit.com/user/' + from_username + ')' if from_username else 'anonymous user'

        if amount:
            commentable_thing.reply(comment_template.USER_TIPPED.format(
                to_username='[/u/' + to_username + '](https://reddit.com/user/' + to_username + ')',
                from_username=from_username,
                ethAmount=amount,
                github='https://github.com/DecenterApps/Extend',
                webstore='https://chrome.google.com/webstore/detail/extend/babconedajpngaajmlnnhpahcladpcna'))

            logger.log("Commented: " + id + ", " + from_username + " tipped " + amount + " " + to_username, slack=True)
        if months:
            commentable_thing.reply(comment_template.BOUGHT_GOLD.format(
                to_username='[/u/' + to_username + '](https://reddit.com/user/' + to_username + ')',
                from_username=from_username,
                months=months + ' month' if months == '1' else months + ' months',
                github='https://github.com/DecenterApps/Extend',
                webstore='https://chrome.google.com/webstore/detail/extend/babconedajpngaajmlnnhpahcladpcna'))

            logger.log("Commented: " + id + ", " + from_username + " gilded " + months + " month(s) " + to_username,
                       slack=True)

        return True

    except requests.exceptions.ConnectionError as e:
        logger.exception(e.response)
        return False
    except Exception as e:
        logger.exception(e)
        return False
