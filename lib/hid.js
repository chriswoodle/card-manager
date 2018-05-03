const log = require('debug')('app:hid');
const HIDStream = require('node-hid-stream').KeyboardLines;
const fs = require('fs');

const settings = require('../settings.json');

const api = require('./api');

let device;
try {
    device = new HIDStream({ vendorId: 2049, productId: 1 }); // magtek reader
} catch (error) {
    log(error)
    return;
}
device.on('data', (data) => {
    if (data.includes('E?')) {
        return log('card swipe error');
    }
    const cardNumber = data.substring(1, 17); // 16 digit card number
    const id = data.substring(7, 16); // 9 digit student id
    const cardIndex = data.substring(16, 17); // This number is incremented each time a physical card is reprinted/magnitized.
    // log(cardNumber, id, cardIndex);
    if (api.getUser(id)) {
        log('card permitted');
        logToFile(id, 'pass')
    } else {
        log('card not permitted');
        logToFile(id, 'fail')

    }
});

const logToFile = (id, message) => {
    if (settings.enableLogs === true) {
        fs.writeFile(`logs/${id}_${new Date().toISOString()}_${message}.txt`, message, function (err) {
            if (err) throw err;
            log('Logged card attempt!');
        });
    }
} 