var express = require('express');
var router = express.Router();

var sqlConverter = require('../modules/sqlConverter');
var safeRead = sqlConverter.safeRead;

const SUCCESS = 'success';
const FAILED = 'failed';
const SERWER_ERROR_JSON = {
    status: FAILED,
    reason: "Przepraszamy, wystąpił błąd po stronie serwera"
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/search', function (req, res, next) {
    //console.log(req.body)
    search = req.body.query
    authorS = req.body.authorS
    authorN = req.body.authorN
    gern = req.body.gern
    publ = req.body.publ
    lang = req.body.lang

      query = "SELECT Book.id, Book.title, Book.language, Book.category, Book.publisher, Author.name, Author.surname as away "+
      "FROM Book, Author "+
      "WHERE "+
      "Book.title LIKE '%"+search+"%' AND Book.publisher LIKE '%"+publ+"%' AND "+
      "Book.category LIKE '%"+gern+"%' AND Book.language LIKE '%"+lang+"%' AND "+
      "Author.name LIKE '%"+authorN+"%' AND Author.surname LIKE '%"+authorS+"%'"+
      " AND Book.author_id = Author.id";
      //console.log(query)
      dbconn.query(query, function (err, rows) {
          if (err) return res.status(500).json(info);
          else
          {
            //console.log(rows);
            return res.json(rows);
          }
      });
});

router.get('/book/:bookID', function (req, res, next) {
    query = "SELECT Book.title, Book.language, Book.category, Book.publisher, Author.name, Author.surname "+
    "FROM Book, Author WHERE Book.id = " + req.param("bookID", -1) + " AND Book.author_id = Author.id";
    //console.log(query)
    dbconn.query(query, function (err, rows) {
        if (err) return res.status(500).json(info);
        else
        {
            console.log(rows)
            return res.json(rows);
        }
    });
});

router.get('/book/status/:bookID', function (req, res, next) {
    query = "SELECT status, end, user_email from BookOrder where book_id = " + req.param("bookID", -1) + " ORDER BY status";
    console.log(query)
    dbconn.query(query, function (err, rows) {
        if (err) return res.status(500).json(info);
        else
        {
            console.log(rows)
            return res.json(rows);
        }
    });
});

router.get('/categories', function (req, res, next) {
  dbconn.query("select name from Category", function (err, rows) {
      if (err) {
          //console.log(err);
          return res.json(SERWER_ERROR_JSON);
      }
      res.json({
          status: SUCCESS,
          data: rows
      });
  });
});

router.get('/authors', function (req, res, next) {
  dbconn.query("select id, name, surname, nationality, DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date from Author", function (err, rows) {
      if (err) {
          //console.log(err);
          return res.json(SERWER_ERROR_JSON);
      }
      res.json({
          status: SUCCESS,
          data: rows
      });
  });
});

router.get('/publishers', function (req, res, next) {
  dbconn.query("select name from Publisher", function (err, rows) {
      if (err) {
          //console.log(err);
          return res.json(SERWER_ERROR_JSON);
      }
      res.json({
          status: SUCCESS,
          data: rows
      });
  });
});

router.get('/languages', function (req, res, next) {
    dbconn.query("select language from Language", function (err, rows) {
        if (err) {
            //console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS,
            data: rows
        });
    });
  });
  
router.get('/books', function (req, res, next) {
    dbconn.query("select isbn, title, author_id, year,language,pages_number,category,publisher,description from Book ", function (err, rows) {
        if (err) {
            //console.log(err);
            return res.json(SERWER_ERROR_JSON);
        }
        res.json({
            status: SUCCESS,
            data: rows
        });
    });
  });
module.exports = router;
