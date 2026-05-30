const express = require('express');
const router = express.Router();
const { getAll, getByGroup, create, addReaction } = require('../controllers/chatMessageController');

router.get('/', getAll);
router.get('/:groupId', getByGroup);
router.post('/', create);
router.put('/:id/react', addReaction);

module.exports = router;
