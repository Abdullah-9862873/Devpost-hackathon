const MenuItem = require('../models/MenuItem');

let menuCache = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; 

exports.getMenuItems = async (req, res) => {
    try {
        // Use cache if available
        if (!menuCache || Date.now() - cacheTime > CACHE_TTL) {
            menuCache = await MenuItem.find();
            cacheTime = Date.now();
        }
        res.status(200).json(menuCache);
    } catch (error) {
        console.error("Error fetching all menu items:", error.message || error);
        res.status(500).json({ message: error.message });
    }
};

exports.getItemsByCategory = async (req, res) => {
    try {
        // case insensitive saerch
        const category = req.params.category;
        const items = await MenuItem.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items by category:", error.message || error);
        res.status(500).json({ message: error.message });
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        if (!name || !description || !category) {
            return res.status(400).json({ message: "Name, description, and category are required" });
        }

        const newItem = new MenuItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error creating menu item:", error.message || error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await MenuItem.findByIdAndDelete(req.params.id);
        console.log(`Deleted menu item: ${req.params.id}`);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error("Error deleting menu item:", error.message || error);
        res.status(500).json({ message: error.message });
    }
};
