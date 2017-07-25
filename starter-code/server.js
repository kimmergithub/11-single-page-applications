'use strict';

// TERMINAL === NODE === INSTALLING express, body-parser, pg
// With NODE & NPM installed, TERMINAL COMMAND: npm init -y ===> initalizes our Package.json
// START command === inside package.json === scripts ===> "start": "nodemon server.js" NOW our cammand is ===> npm start
// DOWNLOADING PG, EXPRESS, body-parser
// TERMINAL INSTALL: npm install -S express body-parser pg
// pg === installs postgres into NODE & recognized in package.json
// require pg ALLOWS us to use POSTGRES in our CODE-Based APPLICATION
// pg === allows us to talk to our kilavolt database on our COMPUTER
const pg = require('pg');
const fs = require('fs');
// EXPRESS === installs express into NODE & recognized in package.json
// require express ALLOWS us to use EXPRESS in our CODE-Based APPLICATION
// EXPRESS: how we communicate with our server...
const express = require('express');

// BODY-PARSER === installs body-parser into NODE & recognized in package.json
// require BODY-PARSER ALLOWS us to use BODY-PARSER in our CODE-Based APPLICATION
// BODY-PARSER: when the server places elements into the body --- it protects the data (masking);
const bodyParser = require('body-parser');

// This is where our SERVER lives === called in the browsers localhost:3000
// PROCESS: in starter-code! npm startq
const PORT = process.env.PORT || 3000;

// CALLING EXPRESS
const app = express();
// const conString = 'postgres://USERNAME:PASSWORD@HOST:PORT';

// POSTGRESS "Connection String"
// This ATTACHES postgress to SQL Databases on our machine
// POSTGRESS will now talk to Kilavolt in our PSQL
// conString tells postgres the path to kilavolt which has our database -- the information our server is going QUERY
const conString = 'postgres://localhost:5432/kilavolt'; // TODONE-WORKING: Don't forget to set your

//own conString
const client = new pg.Client(conString);
client.connect();
client.on('error', err => console.error(err));

// APP === we're talking EXPRESS here (our server)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// EXPRESS used here
app.use(express.static('./public'));

app.get('/new', (request, response) => response.sendFile('new.html', {root: './public'}));
app.get('/admin', (request, response) => response.sendFile('admin.html', {root: './public'}));
app.get('/articles', (request, response) => {
  client.query(`
    SELECT * FROM articles
    INNER JOIN authors
      ON articles.author_id=authors.author_id;`
  )
  .then(result => response.send(result.rows))
  .catch(console.error);
});

app.post('/articles', function(request, response) {
  client.query(
    'INSERT INTO authors(author, "authorUrl") VALUES($1, $2) ON CONFLICT DO NOTHING',
    [request.body.author, request.body.authorUrl],
    function(err) {
      if (err) console.error(err)
      queryTwo()
    }
  )

  function queryTwo() {
    client.query(
      `SELECT author_id FROM authors WHERE author=$1`,
      [request.body.author],
      function(err, result) {
        if (err) console.error(err)
        queryThree(result.rows[0].author_id)
      }
    )
  }

  function queryThree(author_id) {
    client.query(
      `INSERT INTO
      articles(author_id, title, category, "publishedOn", body)
      VALUES ($1, $2, $3, $4, $5);`,
      [
        author_id,
        request.body.title,
        request.body.category,
        request.body.publishedOn,
        request.body.body
      ],
      function(err) {
        if (err) console.error(err);
        response.send('insert complete');
      }
    );
  }
});

app.put('/articles/:id', (request, response) => {
  client.query(`
    UPDATE authors
    SET author=$1, "authorUrl"=$2
    WHERE author_id=$3
    `,
    [request.body.author, request.body.authorUrl, request.body.author_id]
  )
  .then(() => {
    client.query(`
      UPDATE articles
      SET author_id=$1, title=$2, category=$3, "publishedOn"=$4, body=$5
      WHERE article_id=$6
      `,
      [
        request.body.author_id,
        request.body.title,
        request.body.category,
        request.body.publishedOn,
        request.body.body,
        request.params.id
      ]
    )
  })
  .then(() => response.send('Update complete'))
  .catch(console.error);
});

app.delete('/articles/:id', (request, response) => {
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
  .then(() => response.send('Delete complete'))
  .catch(console.error);
});

app.delete('/articles', (request, response) => {
  client.query('DELETE FROM articles')
  .then(() => response.send('Delete complete'))
  .catch(console.error);
});

loadDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));


//////// ** DATABASE LOADERS ** ////////
////////////////////////////////////////
function loadAuthors() {
  fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
    JSON.parse(fd.toString()).forEach(ele => {
      client.query(
        'INSERT INTO authors(author, "authorUrl") VALUES($1, $2) ON CONFLICT DO NOTHING',
        [ele.author, ele.authorUrl]
      )
      .catch(console.error);
    })
  })
}

function loadArticles() {
  client.query('SELECT COUNT(*) FROM articles')
  .then(result => {
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            articles(author_id, title, category, "publishedOn", body)
            SELECT author_id, $1, $2, $3, $4
            FROM authors
            WHERE author=$5;
          `,
            [ele.title, ele.category, ele.publishedOn, ele.body, ele.author]
          )
          .catch(console.error);
        })
      })
    }
  })
}

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    authors (
      author_id SERIAL PRIMARY KEY,
      author VARCHAR(255) UNIQUE NOT NULL,
      "authorUrl" VARCHAR (255)
    );`
  )
  .then(loadAuthors)
  .catch(console.error);

  client.query(`
    CREATE TABLE IF NOT EXISTS
    articles (
      article_id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES authors(author_id),
      title VARCHAR(255) NOT NULL,
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL
    );`
  )
  .then(loadArticles)
  .catch(console.error);
}
