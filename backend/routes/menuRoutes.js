const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    getItemsByCategory,
    createMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');

router.get('/', getMenuItems);
router.get('/category/:category', getItemsByCategory);
router.post('/', createMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;
