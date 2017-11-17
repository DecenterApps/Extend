import time
import praw
import logging
import requests
import pika
import json

config = json.load(open('../config.json'))

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='message')

logging.basicConfig(filename='gold.log',
                    level=logging.DEBUG,
                    format='%(asctime)s %(message)s')

def give(to_username, from_address, months, id=None):
    print("Logging in...")
    r = praw.Reddit(client_id=config['reddit']['client_id'],
                    client_secret=config['reddit']['client_secret'],
                    username=config['reddit']['username'],
                    password=config['reddit']['password'],
                    user_agent='bot')

    try:
        print("Buying gold for", to_username)
        if months == 1:
            a = 1
            # r.submission(id=id).gild()
        else:
            a = 2
            # r.redditor(to_username).gild(months=int(months))
        print(a)

        channel.basic_publish(exchange='',
                              routing_key='message',
                              body=json.dumps({'username': to_username,
                                               'fromAddress': from_address,
                                               'months': months}))

        print("Bought")
    except requests.exceptions.ConnectionError as e:
        return False
    except Exception as e:
        return False

    print("Sleeping...")
    time.sleep(1)

if __name__ == '__main__':
    main()