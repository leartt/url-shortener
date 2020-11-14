const { url } = require('inspector');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UrlSchema = new Schema({
    url: {
        type: String,
        required: [true, 'Please enter a url'],
        validate: {
            validator: function (v) {
                return /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig.test(v)
            },
            message: props => `${props.value} is not a valid URL`

        },
    },
    nanoId: {
        type: String,
        required: true,
    }
})

const URL = mongoose.model('Url', UrlSchema);

module.exports = URL;