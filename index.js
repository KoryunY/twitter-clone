const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/twitter');

const userSchema = new Schema({
    name: String,
    age: Number
})

const twitSchema = new Schema({
    title: String,
    desc: String,
    userId: mongoose.Types.ObjectId
})

const User = mongoose.model('user', userSchema);
const Twit = mongoose.model('twit', twitSchema);

//user controller
app.post('/users', (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age
    });
    user.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.send("data saved");
    })
})

app.get('/users', (req, res) => {
    User.find({}, function (err, docs) {
        if (err) {
            res.send(err);
        }
        res.send(docs);
    })
})

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id, function (err, doc) {
        if (err) {
            res.send(err);
        }
        res.send(doc);
    })
})

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const userData = {
        name: req.body.name,
        age: req.body.age
    }
    User.findByIdAndUpdate(id, userData, function (err) {
        if (err) {
            res.send(err)
        }
        res.send("Updated user by id:" + id);
    })
})

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, function (err) {
        if (err) {
            res.send(err);
        }
        res.send("deleted user by Id:" + id);
    })
})

// twits controller
app.post('/twits/:id', (req, res) => {
    const id = req.params.id;
    const twit = new Twit({
        title: req.body.title,
        desc: req.body.desc,
        userId: id
    })
    twit.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.send("twitted");
    })
})
app.get('/twits/:id', (req, res) => {
    const id = req.params.id;
    Twit.find({ userId: id }, function (err, docs) {
        res.send(docs);
    })
})

app.put('/twits/:id/:tId', (req, res) => {
    const userId = req.params.id;
    const twitId = req.params.tId;
    const twit = {
        title: req.body.title,
        desc: req.body.desc
    }
    Twit.findById(twitId, function (err, doc) {
        if (err) {
            res.send(err)
        }
        if (doc.userId == userId) {
            Twit.findByIdAndUpdate(twitId, twit, function (err) {
                if (err) {
                    res.send(err)
                }
                res.send("updated twit,id:" + twitId + "By user,id:" + userId)
            })
        }
        else {
            res.send("Wrong user id")
        }
    })
})

app.delete('/twits/:id/:tId', (req, res) => {
    const userId = req.params.id;
    const twitId = req.params.tId;

    Twit.findById(twitId, function (err, doc) {
        if (err) {
            res.send(err)
        }
        if (doc.userId == userId) {
            Twit.findByIdAndDelete(twitId, function (err) {
                if (err) {
                    res.send(err)
                }
                res.send("Removed twit,id:" + twitId + "By user,id:" + userId)
            })
        }
        else {
            res.send("Wrong user id")
        }
    })

})

app.listen(3000);