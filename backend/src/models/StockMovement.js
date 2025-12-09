module.exports = (sequelize, DataTypes) => {
    const StockMovement = sequelize.define('StockMovement', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT'),
            allowNull: false
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        unit_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER, // User ID
            allowNull: false
        }
    });
    return StockMovement;
};
