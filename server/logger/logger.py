#!/usr/bin/env python
import json
import requests
import datetime

config = json.load(open('../config.json'))


def log(message, slack=False):
    print("time: " + datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y") + ", message: " + message, flush=True)

    if slack:
        requests.post(config['slackWebhook'], json=json.loads('{"text":"' + message + '"}'))


def exception(message):
    requests.post(config['slackWebhook'], json=json.loads('{"text":"' + message + '"}'))
    print("time: " + datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y") + ", message: " + message, flush=True)
