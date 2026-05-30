const express = require('express');
const router = express.Router();
const { register, login, getAll, updateUser } = require('../controllers/userController');

router.post('/add-user', register);
router.post('/login', login);
router.get('/users', getAll);
router.put('/:id', updateUser);

module.exports = router;
