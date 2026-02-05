const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
exports.getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get items by category
// @route   GET /api/menu/category/:category
exports.getItemsByCategory = async (req, res) => {
    try {
        const items = await MenuItem.find({ category: req.params.category.toLowerCase() });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new menu item
// @route   POST /api/menu
exports.createMenuItem = async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await MenuItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
