require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verfiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!token) {
      throw res.status(400).json({ message: 'token required' });
    }

    if (!verfiedToken) {
      throw res.status(400).json({ messge: 'token invalid' });
    }
  } catch (error) {
    return error;
  }

  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
