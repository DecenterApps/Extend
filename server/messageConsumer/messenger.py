import time
import praw
import logging
import requests
import json
import messages_template

config = json.load(open('../config.json', 'r'))

logging.basicConfig(filename='message.log',
                    level=logging.DEBUG,
                    format='%(asctime)s %(message)s')

def send(to_username, from_username, eth_amount=None, months=None):
    print("Logging in...")
    r = praw.Reddit(client_id=config['reddit']['client_id'],
                    client_secret=config['reddit']['client_secret'],
                    username=config['reddit']['username'],
                    password=config['reddit']['password'],
                    user_agent='bot')

    try:
        print("Sending message to", to_username)

        if months:
            r.redditor(to_username).message('Hey',
                                           messages_template.BOUGHT_GOLD.format(toUsername=to_username,
                                                                                fromUsername=from_username,
                                                                                months=str(months) + ' month' if months == 1 else str(months) + ' months',
                                                                                blogpost='https://blog.decenter.com/2017/11/14/extend/',
                                                                                github='https://github.com/DecenterApps/Extend',
                                                                                website='https://decenter.com',
                                                                                webstore='https://webstore.com'))
        else:
            r.redditor(to_username).message('Hey',
                                           messages_template.USER_TIPPED.format(toUsername=to_username,
                                                                                fromUsername=from_username,
                                                                                ethAmount=eth_amount,
                                                                                blogpost='https://blog.decenter.com/2017/11/14/extend/',
                                                                                github='https://github.com/DecenterApps/Extend',
                                                                                website='https://decenter.com',
                                                                                webstore='https://webstore.com'))

        print("Sent")
    except requests.exceptions.ConnectionError as e:
        return False
    except Exception as e:
        return False

    print("Sleeping...")
    time.sleep(1)

if __name__ == '__main__':
    main()
