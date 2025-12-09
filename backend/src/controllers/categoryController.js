const db = require('../models');
const Category = db.Category;

exports.create = async (req, res) => {
    try {
        const category = await Category.create({
            name: req.body.name,
            description: req.body.description
        });
        res.send(category);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.send(categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        await Category.update(req.body, { where: { id: id } });
        res.send({ message: "Category was updated successfully." });
    } catch (error) {
        res.status(500).send({ message: "Error updating Category with id=" + id });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        // Check if category has products
        const products = await db.Product.findAll({ where: { category_id: id } });
        if (products.length > 0) {
            return res.status(400).send({ message: "Cannot delete category because it contains products. Please delete or move the products first." });
        }

        await Category.destroy({ where: { id: id } });
        res.send({ message: "Category was deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Could not delete Category with id=" + id });
    }
};
