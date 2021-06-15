var express = require('express');
var router = express.Router();
var passport = require('passport');
const LocalStrategy = require('passport-local');

var sqlConverter = require('../modules/sqlConverter');
var safeRead = sqlConverter.safeRead;

const SUCCESS = 'success';
const FAILED = 'failed';
const SERWER_ERROR_JSON = {
    status: FAILED,
    reason: "Przepraszamy, wystąpił błąd po stronie serwera"
};

passport.use('admin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, passsword, done) {
        email = safeRead(req.body.email);
        password = safeRead(req.body.password);
        if (email === undefined) {
            return done(null, false, {
                status: FAILED,
                reason: "Przesłano niepoprawne dane",
                details: "email: '" + req.body.email + "', password: '" + req.body.password + "'"
            });
        }
        dbconn.query("select * from Admin where email = '" + email + "'", function (err, rows) {
            if (err) {
                console.log(err);
                return done(err, false, SERWER_ERROR_JSON);
            }
            if (!rows.length) {
                return done(null, false, {
                    status: FAILED,
                    reason: "Przepraszamy, admin z takim adresem e-mail nie istnieje"
                });
            }

            if (rows[0].password === password) {
                return done(null, {
                    email: rows[0].email,
                    name: rows[0].name,
                    surname: rows[0].surname,
                    birthdate: rows[0].birthdate,
                    pesel: rows[0].pesel,
                    city: rows[0].city,
                    street: rows[0].street,
                    number: rows[0].number,
                    phone: rows[0].phone,
                    status: rows[0].status,
                    is_admin: true
                }, {
                    status: SUCCESS
                });
            } else {
                return done(null, false, {
                    status: FAILED,
                    reason: "Niepoprawne hasło"
                });
            }
        });
    }
));

function authenticatedAdminOnly(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.json({
            status: FAILED,
            reason: "Aby dostać się do tego panelu należy się zalogować"
        });
    }
    if (req.isAuthenticated() && (!req.user.is_admin || req.user.is_admin !== true)) {
        return res.json({
            status: FAILED,
            reason: "Tylko admin ma dostęp do tego panelu"
        });
    }
    next();
}

function notAuthenticatedOnly(req, res, next) {
    if (req.isAuthenticated()) {
        return res.json({
            status: FAILED,
            reason: "Aby dostać się do tego panelu należy się wylogować"
        });
    }
    next();
}

function safeAuthenticateAdmin(req, res, next)
{
    if(req.isAuthenticated() && (!req.user.is_admin || req.user.is_admin !== true))
    {
        req.logout();
    }
    next();
}

router.get('/status', function (req, res) {
    if (!req.isAuthenticated() || (req.isAuthenticated() && (!req.user.is_admin || req.user.is_admin !== true))) {
        return res.json({
            status: SUCCESS,
            admin: false
        });
    }
    res.json({
        status: SUCCESS,
        admin: req.user.is_admin
    });
});

router.post('/login', safeAuthenticateAdmin, function (req, res, next) {
    passport.authenticate('admin', function (err, user, info) {
        if (err) {
            console.log("POST /login " + err);
            return res.status(500).json(info);
        }
        if (user) {
            req.login(user, function (error) {
                if (error) return res.status(500).json(SERWER_ERROR_JSON);
                return res.json(info);
            });
        } else {
            res.json(info);
        }
    })(req, res, next);
});

router.post('/logout', authenticatedAdminOnly, function (req, res, next) {
    req.logout();
    res.json({
        status: SUCCESS
    });
});

router.post('/add/author', authenticatedAdminOnly, function (req, res, next) {
    var name = safeRead(req.body.name);
    var surname = safeRead(req.body.surname);
    var nationality = safeRead(req.body.nationality);
    var birth_date = safeRead(req.body.birth_date);
    dbconn.query("insert into Author(name, surname, nationality, birth_date) values ('" +
        name + "', '" + surname + "', '" + nationality + "', '" + birth_date + "')",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.get('/get/author/:id', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("select id, name, surname, nationality, DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date from Author where id=" + req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS,
            data: rows
        });
    });
});

router.get('/delete/author/:id', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("delete from Author where id=" + req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS
        });
    });
});

router.post('/update/author/:id', authenticatedAdminOnly, function(req, res, next) {
    var name = safeRead(req.body.name);
    var surname = safeRead(req.body.surname);
    var nationality = safeRead(req.body.nationality);
    var birth_date = safeRead(req.body.birth_date);
    dbconn.query("update Author set name = '"  + name + "', surname = '" + surname + "', nationality = '" + 
        nationality + "', birth_date = '" + birth_date + "' where id = " + req.params.id,
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});


router.post('/add/category', authenticatedAdminOnly, function (req, res, next) {
    var name = safeRead(req.body.name);
    dbconn.query("insert into Category(name) values ('" + name + "')",
        function (err, rows) {
            if(err && err.code === 'ER_DUP_ENTRY')
            {
                return res.json({status: FAILED, reason: "Ta kategoria już istnieje"});
            }
            else if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.get('/get/category/:name', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("select name from Category where name='" + req.params.name + "'", function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS,
            data: rows
        });
    });
});

router.get('/delete/category/:name', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("delete from Category where name='" + req.params.name + "'", function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS
        });
    });
});

router.post('/update/category/:name', authenticatedAdminOnly, function(req, res, next) {
    var name = safeRead(req.body.name);
    dbconn.query("update Category set name = '"  + name + "' where name='" + req.params.name + "'",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.post('/add/publisher', authenticatedAdminOnly, function (req, res, next) {
    var name = safeRead(req.body.name);
    dbconn.query("insert into Publisher(name) values ('" + name + "')",
        function (err, rows) {
            if(err && err.code === 'ER_DUP_ENTRY')
            {
                return res.json({status: FAILED, reason: "Ten wydawca już istnieje"});
            }
            else if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.get('/get/publisher/:name', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("select name from Publisher where name='" + req.params.name + "'", function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS,
            data: rows
        });
    });
});

router.get('/delete/publisher/:name', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("delete from Publisher where name='" + req.params.name + "'", function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS
        });
    });
});

router.post('/update/publisher/:name', authenticatedAdminOnly, function(req, res, next) {
    var name = safeRead(req.body.name);
    dbconn.query("update Publisher set name='"  + name + "' where name='" + req.params.name + "'",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});


router.post('/add/language', authenticatedAdminOnly, function (req, res, next) {
    var language = safeRead(req.body.language);
    dbconn.query("insert into Language(language) values ('" + language + "')",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.get('/get/language/:language', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("select language from Language where language='" + req.params.language + "'", function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS,
            data: rows
        });
    });
});

router.get('/delete/language/:language', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("delete from Language where language='" + req.params.language + "'", function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS
        });
    });
});

router.post('/update/language/:language', authenticatedAdminOnly, function(req, res, next) {
    var language = safeRead(req.body.language);
    dbconn.query("update Language set language = '"  + language + "' where language='" + req.params.language + "'",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.post('/add/book', authenticatedAdminOnly, function (req, res, next) {
    var isbn = safeRead(req.body.isbn);
    var title = safeRead(req.body.title);
    var author_id = safeRead(req.body.author_id);
    var year = safeRead(req.body.year);
    var language = safeRead(req.body.language);
    var pages_number = safeRead(req.body.pages_number);
    var category = safeRead(req.body.category);
    var publisher = safeRead(req.body.publisher);
    var description = safeRead(req.body.description);
    dbconn.query("insert into Book(isbn, title, author_id, year,language,pages_number,category,publisher,description ) values ('" +
    isbn + "', '" + title + "', '" + author_id + "', '" + year + "', '" + language+
    "', '" + pages_number + "', '" + category +  "', '" + publisher + "', '" + description+"')",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.get('/get/book/:isbn', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("select isbn, title, author_id, year,language,pages_number,category,publisher,description from Book where isbn=" + req.params.isbn, function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS,
            data: rows
        });
    });
});

router.get("/orders", authenticatedAdminOnly, function(req, res)
{
    dbconn.query("select * from BookOrder left join User on BookOrder.user_email=User.email left join Book on Book.id=BookOrder.book_id",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS,
                data: rows
            });
        });
});

router.get('/delete/book/:isbn', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("delete from Book where isbn=" + req.params.isbn, function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS
        });
    });
});

router.post('/update/book/:isbn', authenticatedAdminOnly, function(req, res, next) {
    var title = safeRead(req.body.title);
    var author_id = req.body.author_id;
    var year = req.body.year;
    var language = safeRead(req.body.language);
    var pages_number = req.body.pages_number;
    var category = safeRead(req.body.category);
    var publisher = safeRead(req.body.publisher);
    var description = safeRead(req.body.description);
    dbconn.query("update Book set title = '"  + title + "', author_id = '" + author_id + "', year = '" + 
        year + "', language = '" + language + "', pages_number = '" + pages_number +
        "', category = '" + category + "', publisher = '" + publisher + 
        "', description = '" + description +"' where isbn = '" + req.params.isbn+ "'",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
});

router.post('/order/:bookID', authenticatedAdminOnly, function(req, res, next) {
    var bookID = req.params.bookID;
    var user = safeRead(req.body.user);
    
    dbconn.query("delete from BookOrder where status is NULL",
    function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        
        dbconn.query("insert into BookOrder (user_email, book_id, start, end, status) values ('" + user + "', '" + bookID +
        "', CURDATE(), DATE_ADD(NOW(),INTERVAL 1 MONTH), 1)",
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.json(SERWER_ERROR_JSON);
            }
            res.json({
                status: SUCCESS
            });
        });
    });
});

router.post('/return/:bookID', authenticatedAdminOnly, function(req, res, next) {
    dbconn.query("update BookOrder set status = 2 where book_id = " + req.params.bookID, function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS
        });
    });
});

module.exports = router;
