const mongoose = require('mongoose');

const NonLexicalWordSchema = mongoose.Schema({
    word: { type: mongoose.Schema.Types.String, index: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('NonLexicalWord', NonLexicalWordSchema);