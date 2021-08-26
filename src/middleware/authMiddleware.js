const jwt = require('jsonwebtoken');

class AuthMiddleware {
  #SECRET_KEY;

  constructor() {
    this.#SECRET_KEY = process.env.SECRET;
  }

  authentication = (req, res, next) => {
    try {
      let header = req.header('Authorization');

      if (!header) {
        return res.status(401).send({
          status: 401,
          message: 'Unauthenticated!',
        });
      }

      let token = header.replace('Bearer ', '');

      const verified = jwt.verify(token, this.#SECRET_KEY, (error, decoded) => {
        if (error) {
          return 0;
        } else {
          return decoded;
        }
      });

      if (verified === 0) {
        return res.status(401).send({
          status: 401,
          message: 'Invalid Credentials!',
        });
      }

      req.user = verified;

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  };
}

module.exports = AuthMiddleware;
