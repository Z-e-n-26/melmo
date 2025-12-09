const db = require('../models');
const Product = db.Product;

const create = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            category_id: req.body.category_id,
            unit_type: req.body.unit_type,
            opening_stock: req.body.opening_stock,
            current_stock: req.body.opening_stock,
            closing_stock: req.body.opening_stock,
            total_added: req.body.opening_stock,
            total_used: 0
        });
        res.send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const findAll = async (req, res) => {
    const category_id = req.query.category_id;
    const condition = category_id ? { category_id: category_id } : null;

    try {
        const products = await Product.findAll({ where: condition });
        res.send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateClosingStock = async (req, res) => {
    // This function is being repurposed to "Report Usage" (OUT movement)
    // But frontend might call a new endpoint or this one. 
    // If the frontend sends "qty_used", we create an OUT movement.
    // If frontend sends "closing_stock" (legacy), we calculate usage.
    // Let's assume we refactor frontend to call /stock endpoint (addStockMovement) with type OUT.
    // So this function might become obsolete or a wrapper.
    // Let's keep it for "Set Closing Stock" if user still wants "I have 5 left" -> implies "Used = Old - 5".

    // Actually, "Set Closing Stock" logic ALREADY implemented usage:
    // const diff = closing_stock - oldStock;
    // if diff < 0 (Used), type OUT.
    // We just need to ensure we update total_used/total_added here too.

    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { closing_stock } = req.body;
        const userId = req.user.id;

        const product = await Product.findByPk(id, { transaction: t });
        if (!product) {
            await t.rollback();
            return res.status(404).json({ error: 'Product not found' });
        }

        const oldStock = product.current_stock;
        const diff = closing_stock - oldStock;

        if (diff !== 0) {
            const type = diff > 0 ? 'IN' : 'OUT';
            const qty = Math.abs(diff);

            await db.StockMovement.create({
                product_id: id,
                type: type,
                quantity: qty,
                unit_type: product.unit_type,
                created_by: userId
            }, { transaction: t });

            if (type === 'IN') {
                product.total_added = (product.total_added || 0) + qty;
            } else {
                product.total_used = (product.total_used || 0) + qty;
            }
        }

        product.closing_stock = closing_stock;
        product.current_stock = closing_stock;

        await product.save({ transaction: t });
        await t.commit();
        res.json(product);
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to update closing stock' });
    }
};

const updateProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await Product.update(req.body, { where: { id: id } });
        res.send({ message: "Product updated successfully." });
    } catch (error) {
        res.status(500).send({ message: "Error updating Product=" + id });
    }
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await Product.destroy({ where: { id: id } });
        res.send({ message: "Product was deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Could not delete Product with id=" + id });
    }
};

module.exports = {
    create,
    findAll,
    updateClosingStock,
    updateProduct,
    deleteProduct
};
