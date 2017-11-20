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
        if from_username:
            from_username = '[/u/' + from_username + '](https://reddit.com/user/' + from_username + ')'
        else:
            from_username = 'anonymous user'

        print(from_username)
        if months:
            r.redditor(to_username).message('Hey',
                                           messages_template.BOUGHT_GOLD.format(to_username='[/u/' + to_username + '](https://reddit.com/user/' + to_username + ')',
                                                                                from_username=from_username,
                                                                                months=months + ' month' if months == '1' else months + ' months',
                                                                                github='https://github.com/DecenterApps/Extend',
                                                                                webstore='https://chrome.google.com/webstore/detail/extend/babconedajpngaajmlnnhpahcladpcna'))
        else:
            r.redditor(to_username).message('Hey',
                                           messages_template.USER_TIPPED.format(to_username=to_username,
                                                                                from_username=from_username,
                                                                                ethAmount=eth_amount,
                                                                                github='https://github.com/DecenterApps/Extend',
                                                                                webstore='https://chrome.google.com/webstore/detail/extend/babconedajpngaajmlnnhpahcladpcna'))

        print("Sent")
    except requests.exceptions.ConnectionError as e:
        return False
    except Exception as e:
        return False

    print("Sleeping...")
    time.sleep(1)

if __name__ == '__main__':
    main()
