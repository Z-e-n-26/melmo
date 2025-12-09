const db = require('../models');
const StockMovement = db.StockMovement;
const Product = db.Product;
const sequelize = db.sequelize;

exports.addStockMovement = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { product_id, quantity, type, unit_type } = req.body;
        const userId = req.user.id; // from auth middleware
        const userRole = req.user.role;

        // Validation based on requirements
        if (userRole === 'staff' && type === 'OUT') {
            return res.status(403).send({ message: "Staff can only add incoming stock." });
        }

        const movement = await StockMovement.create({
            product_id,
            type,
            quantity,
            unit_type,
            created_by: userId
        }, { transaction: t });

        // Update Product Stock
        const product = await Product.findByPk(product_id, { transaction: t });
        if (!product) throw new Error("Product not found");

        if (type === 'IN') {
            product.current_stock += quantity;
            product.total_added = (product.total_added || 0) + quantity;
        } else {
            product.current_stock -= quantity;
            product.total_used = (product.total_used || 0) + quantity;
        }

        await product.save({ transaction: t });

        await t.commit();
        res.send(movement);

    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: error.message });
    }
};

exports.getStockMovements = async (req, res) => {
    try {
        const movements = await StockMovement.findAll({
            include: ['product', 'user'],
            order: [['createdAt', 'DESC']]
        });
        res.send(movements);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getWeeklyHistory = async (req, res) => {
    try {
        // Fetch all products with Category included
        const products = await Product.findAll({ include: 'category' });
        // Fetch all movements
        const movements = await StockMovement.findAll({ order: [['createdAt', 'ASC']] });

        // Create a timeline of events
        let events = [];

        // 1. Loading Product Opening Stocks
        products.forEach(p => {
            events.push({
                date: new Date(p.createdAt),
                type: 'OPENING',
                quantity: p.opening_stock,
                productId: p.id,
                productName: p.name,
                categoryName: p.category ? p.category.name : 'Uncategorized',
                unit: p.unit_type
            });
        });

        // 2. Loading Stock Movements
        movements.forEach(m => {
            const p = products.find(prod => prod.id === m.product_id);
            if (p) {
                events.push({
                    date: new Date(m.createdAt),
                    type: m.type,
                    quantity: m.quantity,
                    productId: p.id,
                    productName: p.name,
                    categoryName: p.category ? p.category.name : 'Uncategorized',
                    unit: p.unit_type
                });
            }
        });

        // Sort by date ASC
        events.sort((a, b) => a.date - b.date);

        // Helper: Get Month Label and Week Number
        const getDateInfo = (date) => {
            const d = new Date(date);
            const month = d.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g. "December 2024"
            const dateNum = d.getDate();
            const weekNum = Math.ceil(dateNum / 7);
            return { month, weekNum: `Week ${weekNum}`, sortKey: d.getTime() };
        };

        // Tree Structure: Month -> Week -> Category -> Products
        let historyTree = {};

        // Track running balances per product to ensure continuity
        let runningBalances = {};

        // Process events chronologically
        events.forEach(e => {
            const { month, weekNum } = getDateInfo(e.date);

            if (!historyTree[month]) historyTree[month] = { weeks: {} };
            if (!historyTree[month].weeks[weekNum]) {
                historyTree[month].weeks[weekNum] = { categories: {} };
            }

            const pId = e.productId;
            const catName = e.categoryName;

            if (!historyTree[month].weeks[weekNum].categories[catName]) {
                historyTree[month].weeks[weekNum].categories[catName] = [];
            }

            // We need to aggregate stats for the product within this week/category slot
            // Since we iterate events, we might see the same product multiple times in a week.
            // We need a map for products within the category group for this specific week.
            // Let's rely on finding existing reference?
            // Actually, arrays are harder to search. Let's make categories an object of products first.
            if (!historyTree[month].weeks[weekNum].categories[catName]._productsMap) {
                historyTree[month].weeks[weekNum].categories[catName]._productsMap = {};
            }

            let prodStats = historyTree[month].weeks[weekNum].categories[catName]._productsMap[pId];
            if (!prodStats) {
                prodStats = {
                    id: pId,
                    name: e.productName,
                    unit: e.unit,
                    added: 0,
                    cleared: 0,
                    endBalance: 0
                };
                historyTree[month].weeks[weekNum].categories[catName]._productsMap[pId] = prodStats;
            }

            if (!runningBalances[pId]) runningBalances[pId] = 0;

            if (e.type === 'OPENING' || e.type === 'IN') {
                runningBalances[pId] += e.quantity;
                prodStats.added += e.quantity;
            } else if (e.type === 'OUT') {
                runningBalances[pId] -= e.quantity;
                prodStats.cleared += e.quantity;
            }
            // Update end balance constantly, the last one stands
            prodStats.endBalance = runningBalances[pId];
        });

        // Transform Tree to Arrays
        const result = Object.keys(historyTree).map(month => {
            const weeksObj = historyTree[month].weeks;
            // Weeks 1-5
            const weeks = Object.keys(weeksObj).sort().map(weekLabel => {
                const catsObj = weeksObj[weekLabel].categories;
                const categories = Object.keys(catsObj).map(catName => {
                    const productsMap = catsObj[catName]._productsMap;
                    const products = Object.values(productsMap);
                    return { name: catName, products };
                });
                return { week: weekLabel, categories };
            });
            // Try to sort months? (Naive string sort or date parsing? Events were already sorted, so Object.keys might be creation order if JS engine preserves insertion order for string keys mostly, but better to trust the data).
            // Since we processed chronologically, months *should* be in order of appearance in `historyTree` if we use a Map or rely on node key order.
            // Let's just return the list.
            return { month, weeks };
        });

        // Reverse to show latest month first?
        // Usually history is newest first.
        // events was ASC. So historyTree keys likely ASC.
        // Let's reverse the final array.
        result.reverse();
        // Also reverse weeks inside?
        result.forEach(m => m.weeks.reverse());

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};
