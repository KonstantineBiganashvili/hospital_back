const express = require('express');

const router = express.Router();
const controller = require('../controller/user.controller');
const { verifyToken } = require('../middleware/auth');

const app = express();

router.post('/api/register', controller.registerUsers);
router.post('/api/login', controller.loginUsers);

// For testing, will remove later
router.route('/api/users').get(controller.getUsers);
router.post('/welcome', verifyToken, (req, res) =>
    res.status(200).send({ Welcome: req.id })
);

app.use(router);

module.exports = router;
