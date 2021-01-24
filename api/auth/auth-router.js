require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../../data/dbConfig');

const db = require('../../data/dbConfig');
const checkFields = require('../middleware/auth.middleware');

router.post('/register', checkFields, async (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  try {
    // When the registration fails, the code to handle the errors is in the auth.middleware.js file.
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    console.table({ username, hashedPassword });
    const result = await db('users').insert({
      username,
      password: hashedPassword,
    });

    return res.json({
      id: result[0],
      username,
      password: hashedPassword,
    });
  } catch (error) {
    return error;
  }
});

router.post('/login', checkFields, async (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  try {
    const { username, password } = req.body;
    const foundUser = await knex('users')
      .select('*')
      .where({ username })
      .first();

    const matchedPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchedPassword) {
      throw res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(foundUser, process.env.JWT_SECRET);

    return res.json({
      message: `Welcome, ${username}`,
      token,
    });
  } catch (error) {
    return error;
  }
});

module.exports = router;
