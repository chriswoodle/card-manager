const flatfile = require('flatfile');
const EventEmitter = require('events');

class Database extends EventEmitter {
    constructor() {
        super(); //must call super for "this" to be defined.
        this.database = null;
        this.init();
    }
    init() {
        const _this = this;
        flatfile.db('data.json', function (err, data) {
            if (err) throw err;
            _this.database = data;
            _this.save();
            _this.emit('ready');
        });
    }

    save() {
        this.database.save(function (err) {
            if (err) throw err;
        });
    }

    set(key, value) {
        this.database[key] = value;
        this.save();
    }


    get(key) {
        return this.database[key];
    }

    remove(key) {
        delete this.database[key];
        this.save();
    }
}




module.exports = Database;