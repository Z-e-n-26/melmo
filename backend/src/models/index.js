const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.Category = require('./Category')(sequelize, Sequelize);
db.Product = require('./Product')(sequelize, Sequelize);
db.StockMovement = require('./StockMovement')(sequelize, Sequelize);

// Associations
db.Category.hasMany(db.Product, { foreignKey: 'category_id', as: 'products' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id', as: 'category' });

db.Product.hasMany(db.StockMovement, { foreignKey: 'product_id' });
db.StockMovement.belongsTo(db.Product, { foreignKey: 'product_id' });

db.User.hasMany(db.StockMovement, { foreignKey: 'created_by' });
db.StockMovement.belongsTo(db.User, { foreignKey: 'created_by' });

module.exports = db;
