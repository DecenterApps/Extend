#!/usr/bin/env python
import pika
import messenger

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='message')

def callback(ch, method, properties, body):
    messenger.send(body.decode("utf-8"))
    print(" [x] Received %r" % body)

channel.basic_consume(callback,
                      queue='message',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()