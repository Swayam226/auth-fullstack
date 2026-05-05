const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());

const users = [];

function authMiddleware(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedData.username) {
        req.username = decodedData.username;
        next();
    } else {
        res.status(403).json({ msg: "denied entry" })
    }
}

app.post('/signup', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const userStatus = users.find((user) => user.username === username)
    if (userStatus) {
        res.json({ msg: "you are already signed in" })
        return;
    }
    const user = {
        username,
        password
    };
    users.push(user);
    res.json({ msg: "you are signed up succesfully" })
})

app.post('/signin', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const userStatus = users.find((user) => user.username === username && user.password === password);
    if (userStatus) {
        const token = jwt.sign({
            username: username
        }, process.env.JWT_SECRET);
        res.json({ msg: "you are signed in", token: token })
    } else {
        res.status(403).json({ msg: "declined entry" })
    }
})

app.get('/me', authMiddleware, function (req, res) {
    res.json({
        username: req.username,
        message: `welcome ${req.username}`,
    })
})


app.listen(3000);