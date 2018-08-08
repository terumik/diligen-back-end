const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
<<<<<<< HEAD
    email: {type: String, required: true},
=======
>>>>>>> origin/master
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);