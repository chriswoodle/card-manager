const log = require('debug')('app:serial');
const SerialPort = require('serialport');

const settings = require('../settings.json');

const port = new SerialPort(settings.serialPort, {
    baudRate: 115200
});

port.on('open', function () {
    port.on('data', function (data) {
        log('Data:', data);
    });
});

// Open errors will be emitted as an error event
port.on('error', function (error) {
    log('Error: ', error);
});

const unlock = () => {
    port.write('U')
};

module.exports = {
    unlock: unlock
};