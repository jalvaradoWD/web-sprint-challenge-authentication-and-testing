const db = require('../../data/dbConfig');

const checkFields = async (req, res, next) => {
  const { path } = req;

  switch (path) {
    case '/register': {
      checkMissingFields(req, res)(handleErrors);
      checkIfUsernameTaken(req, res)(handleErrors);
      break;
    }
    case '/login': {
      checkMissingFields(req, res)(handleErrors);
      checkIfUsernameExist(req, res)(handleErrors);
      break;
    }
    default:
      break;
  }

  next();
};

const checkMissingFields = (req, res) => async (handleErrors) => {
  handleErrors(async () => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw res.status(400).json({
        message: 'The username or password are missing.',
      });
    }
  });
};

const checkIfUsernameTaken = (req, res) => (handleErrors) => {
  handleErrors(async () => {
    const { username } = req.body;

    const foundUser = db('users').where({ username }).first();

    if (!foundUser) {
      throw res
        .status(400)
        .json({ message: 'Username has already been taken.' });
    }
  });
};

const checkIfUsernameExist = (req, res) => (handleErrors) => {
  handleErrors(async () => {
    const { username } = req.body;

    const foundUser = await db('auth').where({ username });

    if (foundUser) {
      throw res.status(400).json({ messge: 'Username does not exist.' });
    }
  });
};

const handleErrors = async (func) => {
  try {
    func();
  } catch (error) {
    return error;
  }
};

module.exports = checkFields;
