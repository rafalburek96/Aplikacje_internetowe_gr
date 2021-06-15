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

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, username, passsword, done) {
    email = safeRead(req.body.email);
    password = safeRead(req.body.password);
    if (email === undefined || password === undefined) {
      return done(null, false, {
        status: FAILED,
        reason: "Przesłano niepoprawne dane",
        details: "email: '" + req.body.email + "', password: '" + req.body.password + "'"
      });
    }
    dbconn.query("select * from User where email = '" + email + "'", function (err, rows) {
      if (err){
	console.log(err);	
	return done(err, false, SERWER_ERROR_JSON);
	}
      if (!rows.length) {
        return done(null, false, {
          status: FAILED,
          reason: "Przepraszamy, użytkownik z takim adresem e-mail nie istnieje"
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
          status: rows[0].status
        }, {status: SUCCESS});
      } else {
        return done(null, false, {
          status: FAILED,
          reason: "Niepoprawne hasło"
        });
      }
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

function authenticatedOnly(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.json({status: FAILED, reason: "Aby dostać się do tego panelu należy się zalogować"});
  }
  next();
}

function notAuthenticatedOnly(req, res, next) {
  if (req.isAuthenticated()) {
    return res.json({status: FAILED, reason: "Aby dostać się do tego panelu należy się wylogować"});
  }
  next();
}

function authenticatedUserOnly(req, res, next) {
  if(req.isAuthenticated() && !req.user.is_admin)
    return next();
  return res.json({status: FAILED, reason: "Nie jesteś zalogowany jako użytkownik :("});
}


router.post('/register', notAuthenticatedOnly, function (req, res) {
  email = safeRead(req.body.email);
  password = safeRead(req.body.password);
  if (email === undefined || password === undefined) {
    return res.json({
      status: FAILED,
      reason: "Przesłano niepoprawne dane",
      details: "email: '" + req.body.email + "', password: '" + req.body.password + "'"
    });
  }
  dbconn.query("insert into User(email, password) values ('" + email + "','" + password + "')", function (err, rows) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.json({
        status: FAILED,
        reason: "Przepraszamy, ten e-mail jest już zajęty"
      });
    } else if (err) {
      console.log("POST /register " + err);
      return res.json(SERWER_ERROR_JSON);
    }
    res.json({
      status: SUCCESS
    });
  });
});

router.post('/login', notAuthenticatedOnly, function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if(err) {
      console.log("POST /login " + err);
      return res.status(500).json(info);
    }
    if(user)
        {
            req.login(user, function(error) {
                if (error) return res.status(500).json(SERWER_ERROR_JSON);
                return res.json(info);
              });
        } else {
            res.json(info);
        }
  })(req, res, next);
});

router.post('/logout', authenticatedOnly, function(req, res, next)
{
  req.logout();
  res.json({status: SUCCESS});
});

router.get('/status', function(req, res) {
  if(req.isAuthenticated() && !req.user.is_admin)
    return res.json({status: SUCCESS, logged_in: 1,email: req.user.email});
  else if(req.isAuthenticated() && req.user.is_admin)
    return res.json({status: SUCCESS, logged_in: -1, email: null});
  return res.json({status: SUCCESS, logged_in: 0, email: null});
});

router.get('/my_account', authenticatedUserOnly, function(req, res)
{
  return res.json({
    status: SUCCESS,
    data: {
      email: req.user.email,
      name: req.user.name,
      surname: req.user.surname,
      birthdate: req.user.birthdate,
      pesel: req.user.pesel,
      city: req.user.city,
      street: req.user.street,
      number: req.user.number,
      phone: req.user.phone,
      status: req.user.status
    }
  });
});

router.post('/update', authenticatedUserOnly, function(req, res)
{
  builtArray = [];
  buildSQLUpdateSetClause(req, TYPE_STRING, "email", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "password", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "name", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "surname", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "birthdate", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "pesel", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "city", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "street", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "number", builtArray);
  buildSQLUpdateSetClause(req, TYPE_STRING, "phone", builtArray);

  if(builtArray.length === 0) {
    return res.json({
      status: SUCCESS,
      details: "Brak danych do zaaktualizowania"
    });
  }
  
  dbconn.query("update User set " + builtArray.join(",") + " where email='" + req.user.email + "'", function (err, rows) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.json({
        status: FAILED,
        reason: "Przepraszamy, ten e-mail jest już zajęty"
      });
    } else if (err) {
      console.log("POST /users/update " + err);
      return res.json(SERWER_ERROR_JSON);
    }
    res.json({
      status: SUCCESS
    });
  });
});


router.post('/order/:bookID', authenticatedUserOnly, function(req, res, next) {
    var bookID = req.params.bookID;
    var user = req.user.email;
    
    dbconn.query("select id from BookOrder where book_id = " + bookID + " and status is NULL",
    function (err, rows) {
        if (err) {
            console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        if(rows.length) {
            res.json({
                status: FAILED,
                reason: "Przepraszamy, ta książka jest już zarazerwowana."
            });
        } else {
            dbconn.query("insert into BookOrder (user_email, book_id, start) values ('" + user + "', '" + bookID +
            "', CURDATE())",
            function (err, rows) {
                if (err) {
                    console.log(err);
                    return res.json(SERWER_ERROR_JSON);
                }
                res.json({
                    status: SUCCESS
                });
            });
        }
    });
});


router.post('/prelong/:bookID', authenticatedUserOnly, function(req, res, next) {
    var bookID = req.params.bookID;
    var user = req.user.email;
    
    console.log("prelong");
    
    dbconn.query("update BookOrder set end = DATE_ADD(NOW(),INTERVAL 1 MONTH) where user_email = '" + user + "' and book_id = " + bookID + " and status = 1",
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



let TYPE_NUMBER = "NUMBER";
let TYPE_STRING = "STRING";
function buildSQLUpdateSetClause(req, type, SQLNAME, arrayToPutTo)
{
  var readValue = safeBuildSQLRead(req.body[SQLNAME]);
  if(SQLNAME === 'password' && !readValue) return undefined;
  if(readValue === req.user[SQLNAME]) return undefined;

  if(readValue !== undefined && type === TYPE_STRING) arrayToPutTo.push(SQLNAME + "='" + readValue + "'");
  if(readValue && type === TYPE_NUMBER) arrayToPutTo.push(SQLNAME + "=" + readValue);
  req.user[SQLNAME] = req.body[SQLNAME];
}

function safeBuildSQLRead(variable)
{
    if(variable !== undefined && variable !== null)
    {
        return variable.split("'").join("''");
    }
    return undefined;
}


module.exports = router;
