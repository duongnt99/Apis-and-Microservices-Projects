const express = require(/*! express */ "express");
const bodyParser = require(/*! body-parser */ "body-parser");
const mongoose = require(/*! mongoose */ "mongoose");
const dns = require(/*! dns */ "dns");

const app = express();
const port = process.env.PORT || 3000;
process.env.MONGO_URI = "mongodb://medmor";
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const schema = new mongoose.Schema({
    original_url: String,
    short_url: {
        type: Number,
        unique: true
    },
});
const ShortUrl = mongoose.model("ShortUrl", schema);
let existingId;
ShortUrl.find({}, (err, urls) => {
    if (err) {
        console.log(err);
        return;
    }
    existingId = urls.map((item) => item.short_url);
    console.log(existingId);
});
app.use("/", express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/api/shorturl/:shortUrl", (req, res) => {
    ShortUrl.findOne({ short_url: Number(req.params.shortUrl) }, (err, data) => {
        console.log(data, Number(req.params.shortUrl));
        if (data === null) {
            res.send({ message: "This short url dose not exist" });
        }
        else {
            res.redirect(data.original_url);
        }
    });
});
app.get("/api/shorturl/new/:url(*)", (req, res) => {
    let validURL = new RegExp(/(http)(s?):\/\/w{3}.(\w+[-_]?\w+).com((\/\w+)?)+$/);
    if (validURL.test(req.params.url)) {
        dns.lookup(urlEdit(req.params.url), (err, adr) => {
            if (err) {
                res.send({
                    error: "invalid URL"
                });
            }
            const id = generateId();
            ShortUrl.create({
                original_url: req.params.url,
                short_url: id
            });
            res.send({
                shortUrl: req.params.url,
                short_url: id
            });
        });
    }
    else {
        res.send({
            error: "invalid URL"
        });
    }
});
app.post("/api/shorturl/new", (req, res) => {
    let validURL = new RegExp(/(http)(s?):\/\/w{3}.(\w+[-_]?\w+).com((\/\w+)?)+$/);
    if (validURL.test(req.body.url)) {
        dns.lookup(urlEdit(req.body.url), (err, adr) => {
            if (err) {
                return res.send({
                    error: "invalid URL5"
                });
            }
            const id = generateId();
            ShortUrl.create({
                original_url: req.body.url,
                short_url: id
            });
            res.send({
                shortUrl: req.body.url,
                short_url: id
            });
        });
    }
    else {
        res.send({
            error: "invalid URL"
        });
    }
});
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});

function generateId() {
    let id = 0;
    while (1) {
        let exist = false;
        for (let i = 0; i < existingId.length; i++) {
            if (existingId[i] === id) {
                id++;
                exist = true;
                continue;
            }
        }
        if (!exist) {
            return id;
        }
    }
}
function urlEdit(url) {
    return url.replace(/http(s?):\/\//, "");
}