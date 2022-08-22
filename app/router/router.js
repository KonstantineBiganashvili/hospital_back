const express = require('express');

const router = express.Router();
const userController = require('../controller/user.controller');
const receptionController = require('../controller/reception.controller');
const { verifyToken } = require('../middleware/auth');

const app = express();

router.post('/api/register', userController.registerUsers);
router.post('/api/login', userController.loginUsers);
router
    .route('/api/receptions')
    .post(verifyToken, receptionController.postReception)
    .get(verifyToken, receptionController.getReceptions);

router
    .route('/api/receptions/:id')
    .delete(verifyToken, receptionController.deleteReceptionById)
    .patch(verifyToken, receptionController.editReceptionById);

app.use(router);

module.exports = router;
