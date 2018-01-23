let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    return conn.createChannel((err, ch) => {
        return ch.assertQueue('tip', {durable: false}, (ok) => {
            ch.sendToQueue('tip', new Buffer(JSON.stringify({
                'username': 'neburo',
                'fromAddress': '0x9af19e97f886181dc8f3992ff7396fab893b95b6',
                'amount': '1',
                'id': 't1_drv69b2',
                'test': 1
            })));
            return ch.close();
        });
    })
});

setTimeout(() => {
    process.exit(0);
}, 3000);

