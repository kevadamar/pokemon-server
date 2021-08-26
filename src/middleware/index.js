const AuthMiddleware = require('./authMiddleware');

const auth = new AuthMiddleware();

module.exports.middleware = { auth };
