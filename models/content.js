const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
    documents: {type: Array}
});

module.exports = mongoose.model('Content', contentSchema);