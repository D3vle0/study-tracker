var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var sha256 = require('sha256');
var app = express();

var PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true
}));

app.post('/', function (req, res) {
    var pwDB = "c9a4f74de4b37231fa2ba2cfb6760418551e7d382d160a71a9b540ec1c971f89";
    var pwd = req.body.password;

    if (sha256(`${pwd}thsy$S&mw3%ANW#^N&5us`) === pwDB) {
        req.session.displayName = 'Ang';
        res.redirect('/');
    }
    else {
        delete req.session.displayName;
        res.render("pw_error");
    }
});

app.get('/', function (req, res) {
    if (req.session.displayName) {
        res.render("index");
    } else {
        res.render("login");
    }
});
//임시
app.get('/index', function (req, res) {
    res.render("index");
});

app.listen(PORT, function () {
    console.log('Connected port!!!');
});