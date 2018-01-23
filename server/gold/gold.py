import time
import praw
import logging
import requests
import pika
import json

config = json.load(open('../config.json'))

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='tip')

logging.basicConfig(filename='gold.log',
                    level=logging.DEBUG,
                    format='%(asctime)s %(message)s')

def give(to_username, from_address, months, id, test=False):
    print("Logging in...", flush=True)
    r = praw.Reddit(client_id=config['redditGold']['client_id'],
                    client_secret=config['redditGold']['client_secret'],
                    username=config['redditGold']['username'],
                    password=config['redditGold']['password'],
                    user_agent='bot')

    try:
        if id[1] == '1':
            gildableThing = r.comment(id=id[3:])
        elif id[1] == '3':
            gildableThing = r.submission(id=id[3:])
        else:
            print("Wrong id passed")
            raise Exception

        if not test:
            gildableThing.gild()
        print("gilded " + id, flush=True)

        if months != '1':
            r.redditor(to_username).gild(months=int(months) - 1)

        print("Bought", flush=True)

        channel.basic_publish(exchange='',
                              routing_key='tip',
                              body=json.dumps({'username': to_username,
                                               'fromAddress': from_address,
                                               'months': months,
                                               'id': id,
                                               'test': test}))
        print("Queued comment", flush=True)
        connection.close()
    except requests.exceptions.ConnectionError as e:
        print(e.response)
        return False
    except Exception as e:
        print(e)
        return False

    print("Sleeping...", flush=True)
    time.sleep(1)

if __name__ == '__main__':
    main()
