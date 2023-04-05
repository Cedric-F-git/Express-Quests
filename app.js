const express = require('express');
require('dotenv').config();
const { hashPassword, verifyPassword, verifyToken } = require('./auth.js');

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send('Welcome to my favourite movie list');
};

const isItDwight = (req, res) => {
  if (
    req.body.email === 'dwight@theoffice.com' &&
    req.body.password === '123456'
  ) {
    res.send('Credentials are valid');
  } else {
    res.sendStatus(401);
  }
};

app.get('/', welcome);

const movieHandlers = require('./movieHandlers');
const userHandlers = require('./userHandlers');

app.get('/api/movies', movieHandlers.getMovies);
app.get('/api/movies/:id', movieHandlers.getMovieById);
app.get('/api/users', userHandlers.getUser);
app.get('/api/users/:id', userHandlers.getUserById);

app.post('/api/users', hashPassword, userHandlers.postUser);

app.post(
  '/api/login',
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);

app.post('/api/movies', verifyToken, movieHandlers.postMovie);

app.put('/api/movies/:id', movieHandlers.updateMovie);
app.put('/api/users/:id', hashPassword, userHandlers.updateUser);

app.delete('/api/movies/:id', movieHandlers.deleteMovie);
app.delete('/api/users/:id', userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error('Something bad happened');
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
