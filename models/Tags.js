const mongoose = require('mongoose');

const TagsSchema = mongoose.Schema({
    tagName: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Tag', TagsSchema);