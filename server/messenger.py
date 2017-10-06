import sys
import time
import praw
import string
import traceback
import logging
import requests
import OAuth2Util
from messages_template import *

PUBLIC_SUB = 'TinySubredditoftheDay'
PRIVATE_SUB = 'TSROTD_Dev'
EXCLUDE = set(string.punctuation)
# Remove the / and _ from the punctuation set because
# they are valid subreddit characters
EXCLUDE.remove('/')
EXCLUDE.remove('_')

# Configure logging
logging.basicConfig(filename='TSOTD.log',
                    level=logging.DEBUG,
                    format='%(asctime)s %(message)s')

def send(username):
    print("Logging in...")
    print("Sending mail to", username);
    r = praw.Reddit('bot')
    o = OAuth2Util.OAuth2Util(r, print_log=True)

    try:
        # refresh the token if neccessary
        o.refresh()
        r.send_message(username,
                       'Hey',
                       ('```message```'),
                       captcha=None)
    # Catches if reddit goes down
    except requests.exceptions.ConnectionError as e:
        print("ERROR: Reddit is down...")
        logging.debug("ERROR: Reddit went down")
        time.sleep(200)  # sleep because reddit is down
        # Then send the traceback so I know if I need
        # to take any action if reddit went down
        # while it was trying to post something
        # Get the traceback to send
        etype, value, tb = sys.exc_info()
        tb_s = '\n'.join(traceback.format_tb(tb, None))
        r.send_message('neburo',
                       'Hey, I went down',
                       ('Here\'s why ```{}```\n\n'.format(e) +
                        "And here's the traceback:\n\n" +
                        "```\n\n{}\n```".format(tb_s)),
                       captcha=None)
    # And a catch all, messages me and continues functioning
    except Exception as e:
        print("ERROR: {}".format(e))
        logging.debug("ERROR: Exception {}".format(e) +
                      " in main exited")
        # Get the traceback to send
        etype, value, tb = sys.exc_info()
        tb_s = '\n'.join(traceback.format_tb(tb, None))
        print(tb_s)
        r.send_message('neburo',
                       'Hey, I went down',
                       ('Here\'s why ```{}```\n\n'.format(e) +
                        "And here's the traceback:\n\n" +
                        "```\n\n{}\n```".format(tb_s)),
                       captcha=None)

        # Exit to make fix
        exit(1)

    print("Sleeping...")
    time.sleep(0.5)

if __name__ == '__main__':
    main()