module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unit_type: {
            type: DataTypes.STRING, // kg, gram, litre, ml, unit, piece
            allowNull: false
        },
        opening_stock: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        current_stock: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        closing_stock: {
            type: DataTypes.FLOAT, // Calculated field, stored for caching or snapshot
            defaultValue: 0
        },
        total_added: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        total_used: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    });
    return Product;
};
