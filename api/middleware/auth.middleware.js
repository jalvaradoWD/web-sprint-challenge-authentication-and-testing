const db = require('../../data/dbConfig');

const checkFields = async (req, res, next) => {
  try {
    const { path } = req;
    switch (path) {
      case '/register': {
        checkMissingFields(req, res);
        await checkIfUsernameTaken(req, res);
        break;
      }
      case '/login': {
        checkMissingFields(req, res);
        await checkIfUsernameExist(req, res);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    return error;
  }

  next();
};

const checkMissingFields = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw res.status(400).json({
      message: 'The username or password are missing.',
    });
  }
};

const checkIfUsernameTaken = async (req, res) => {
  const { username } = req.body;

  const foundUser = await db('users').where({ username }).first();

  if (foundUser) {
    throw res.status(400).json({ message: 'Username has already been taken.' });
  }
};

const checkIfUsernameExist = async (req, res) => {
  const { username } = req.body;

  const foundUser = await db('users').where({ username }).first();

  if (!foundUser) {
    throw res.status(400).json({ messge: 'Username does not exist.' });
  }

  req.user = foundUser;
};

module.exports = checkFields;
