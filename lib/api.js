let database = require('./database');

database = new database();

const init = () => {
    database.on('ready', () => {
        database.set('users', database.get('users') || {});
    })
}

const listUsers = () => {
    return Object.values(database.get('users'));
}

const addUser = (user) => {
    const users = database.get('users');
    users[user.id] = user;
    database.set('users', users);
}

const removeUser = (id) => {
    const users = database.get('users');
    delete users[id];
    database.set('users', users);
}

const getUser = (id) => {
    const users = database.get('users');
    return users[id];
}

init();

module.exports = {
    addUser: addUser,
    getUser: getUser,
    removeUser: removeUser,
    listUsers: listUsers
}