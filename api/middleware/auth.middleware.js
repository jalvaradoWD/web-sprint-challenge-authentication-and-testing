const db = require('../../data/dbConfig');

const checkFields = async (req, res, next) => {
  try {
    const { method } = req;

    switch (method) {
      case 'POST': {
        const { username, password } = req.body;
        const foundUser = await db('auth').where({ username }).first();

        if (!username || !password) {
          throw res.status(400).json({
            message: 'The username or password are missing.',
          });
        }

        if (!foundUser) {
          throw res
            .status(400)
            .json({ message: 'Username has already been taken.' });
        }

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

module.exports = { checkFields };
