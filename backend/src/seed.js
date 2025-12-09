const bcrypt = require('bcryptjs');

module.exports = async (db) => {
    const userCount = await db.User.count();
    if (userCount === 0) {
        console.log('Seeding Users...');
        await db.User.create({
            username: 'admin',
            password: bcrypt.hashSync('admin123', 8),
            role: 'admin'
        });
        await db.User.create({
            username: 'staff',
            password: bcrypt.hashSync('staff123', 8),
            role: 'staff'
        });
    }

    const categoryCount = await db.Category.count();
    if (categoryCount === 0) {
        console.log('Seeding Categories...');
        await db.Category.bulkCreate([
            { name: 'Flour', description: 'All kinds of flour' },
            { name: 'Snacks', description: 'Ready to eat snacks' },
            { name: 'Veg', description: 'Vegetables' },
            { name: 'Fruits', description: 'Fresh Fruits' },
            { name: 'Packing', description: 'Packing materials' },
            { name: 'Others', description: 'Miscellaneous' }
        ]);
    }
};
