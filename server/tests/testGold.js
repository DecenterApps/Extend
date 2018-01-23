let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    return conn.createChannel((err, ch) => {
        return ch.assertQueue('gold', {durable: false}, (ok) => {
            ch.sendToQueue('gold', new Buffer(JSON.stringify({
                'toUsername': 'neburo',
                'fromAddress': '0x9af19e97f886181dc8f3992ff7396fab893b95b6',
                'months': '1',
                'signature': Math.random().toString(36).substring(7),
                'id': 't3_7e9srm',
                'test': true
            })));
            return ch.close();
        });
    })
});

setTimeout(() => {
    process.exit(0);
}, 3000);
