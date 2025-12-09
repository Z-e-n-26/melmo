const Sequelize = require('sequelize');
const path = require('path');

const config = process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    }
    : {
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false
    };

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(config.url, config)
    : new Sequelize(config);

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
