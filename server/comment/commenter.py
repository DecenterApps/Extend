import time
import praw
import logging
import requests
import pika
import json
import redis
import comment_template

config = json.load(open('../config.json'))

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='tip')

logging.basicConfig(filename='tip.log',
                    level=logging.DEBUG,
                    format='%(asctime)s %(message)s')

def comment(to_username, from_username, id, amount=None, months=None, test=False):
    print("Logging in...", flush=True)
    r = praw.Reddit(client_id=config['reddit']['client_id'],
                    client_secret=config['reddit']['client_secret'],
                    username=config['reddit']['username'],
                    password=config['reddit']['password'],
                    user_agent='bot')

    try:
        if id[1] == '1':
            print('Finding comment', flush=True)
            commentableThing = r.comment(id=id[3:])
        elif id[1] == '3':
            print('Finding submission', flush=True)
            commentableThing = r.submission(id=id[3:])
        else:
            raise Exception

        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        expire = r.ttl('comment')

        print('Current expire on comment: ' + str(expire), flush=True)

        if test:
            requests.post(comment_template.TIP_TEST_ENDPOINT, json=comment_template.TIP_TEST_DATA)
            return

        if expire > 0:
            print("Pre sleeping :" + str(expire))
            time.sleep(expire)
            expire = 0

        r.set('comment', 1)
        r.expire('comment', 602 + expire)

        if from_username:
            from_username = '[/u/' + from_username + '](https://reddit.com/user/' + from_username + ')'
        else:
            from_username = 'anonymous user'

        if amount:
            commentableThing.reply(comment_template.USER_TIPPED.format(to_username='[/u/' + to_username + '](https://reddit.com/user/' + to_username + ')',
                                                                       from_username=from_username,
                                                                       ethAmount=amount,
                                                                       github='https://github.com/DecenterApps/Extend',
                                                                       webstore='https://chrome.google.com/webstore/detail/extend/babconedajpngaajmlnnhpahcladpcna'))
            print("commented " + id + ", " + from_username + " tipped " + amount + " " + to_username, flush=True)
        if months:
            commentableThing.reply(comment_template.BOUGHT_GOLD.format(to_username='[/u/' + to_username + '](https://reddit.com/user/' + to_username + ')',
                                                                       from_username=from_username,
                                                                       months=months + ' month' if months == '1' else months + ' months',
                                                                       github='https://github.com/DecenterApps/Extend',
                                                                       webstore='https://chrome.google.com/webstore/detail/extend/babconedajpngaajmlnnhpahcladpcna'))
            print("commented " + id + ", " + from_username + " gilded " + months + " " + to_username, flush=True)

        print("Sleeping :" + str(602 + expire))

        time.sleep(600 + expire)


    except requests.exceptions.ConnectionError as e:
        print(e.response, flush=True)
        print("Sleeping...", flush=True)
        time.sleep(600)
        return False
    except Exception as e:
        print(e, flush=True)
        print("Sleeping...", flush=True)
        time.sleep(600)
        return False

if __name__ == '__main__':
    main()
