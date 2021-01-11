const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const fs = require('fs');
const app = express();

var PORT = 4001;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true
}));

app.post('/', function (req, res) {
    const db = JSON.parse(fs.readFileSync('db.json'));
    var id = req.body.id;
    var pw = req.body.pw;

    var idx = db.id.findIndex((e) => e == id);

    if (idx !== -1 && sha256(pw) === db.pw[idx]) {
        req.session.displayName = `logged-in:${id}`;
        res.redirect('/');
    }
    else {
        delete req.session.displayName;
        res.render("login_err");
    }
});

app.get('/', function (req, res) {
    if (req.session.displayName) {
        //const study_db = JSON.parse(fs.readFileSync('study_db.json'));
        res.render("index");
    }
    else {
        res.render("login");
    }
});
//임시
// app.get('/index', function (req, res) {
//     res.render("index");
// });

app.get('/register', function (req, res) {
    res.render("register", { errmsg: "" });
});

app.post('/register', function (req, res) {
    const db = JSON.parse(fs.readFileSync('db.json'));
    var new_id = req.body.id;
    var new_pw = req.body.pw;

    var idx = db.id.findIndex((e) => e == new_id);
    if (idx !== -1) {
        res.render('register', { errmsg: "이미 존재하는 아이디 입니다." });
    }
    else {
        const db = JSON.parse(fs.readFileSync('db.json'));
        db.id.push(new_id);
        db.pw.push(sha256(new_pw));
        fs.writeFile("db.json", JSON.stringify(db), err => {
            if (err)
                throw err;
            else {
                console.log(`${new_id} added!`);
                res.redirect("/");
            }
        });
    }
});

app.listen(PORT, function () {
    console.log('Connected port!!!');
});
