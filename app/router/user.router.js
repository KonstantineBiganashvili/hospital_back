const express = require('express');

const router = express.Router();
const controller = require('../controller/user.controller');

const app = express();

router.route('/api/users').get(controller.getUsers);
router.route('/api/register').post(controller.registerUsers);

app.use(router);

module.exports = router;
