const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const URL = require('./models/url_model');

require('dotenv').config();

const app = express();

app.use(express.static('public'))

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }))



//MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log("MongoDB database has been connected");
});
connection.on('disconnected', () => {
    console.log("MongoDB database has been disconnected");
});
connection.on('error', () => {
    console.log("MongoDB database ERROR");
});

app.get('/', (req, res) => {
    res.render('main', {
        title: 'URL Shortener',
        response: {
            msg: null,
            success: true
        }
    });
})

app.get('/:nanoId', async (req, res) => {
    try {
        const url = await URL.findOne({ nanoId: req.params.nanoId });
        res.redirect(url.url)
    } catch (error) {
        res.render('main', {
            title: 'URL Shortener',
            response: {
                msg: 'An error has ocurred',
                success: false
            }
        });
    }
})

app.post('/', async (req, res) => {
    try {
        let url = req.body.url;
        if (url.match(/^www/) !== null) {
            console.log(url)
            url = url.replace(/^www\./, 'http://');
        }
        const newUrl = new URL({
            url: url,
            nanoId: nanoid()
        })
        await newUrl.save();
        res.render('main', {
            title: 'URL Shortener',
            response: {
                msg: `${req.headers.host}/${newUrl.nanoId}`,
                success: true
            }
        });
    } catch (error) {
        res.render('main', {
            title: 'URL Shortener',
            response: {
                msg: error._message ? error._message : 'An error has ocurred',
                success: false
            }
        });
    }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));