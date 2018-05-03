const serial = require('./lib/serial');
setTimeout(() => {
    serial.unlock();
}, 5000);