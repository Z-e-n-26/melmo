const express = require('express');
const cors = require('cors');
let db = null;
let dbError = null;

try {
    db = require('./models');
} catch (err) {
    console.error("Failed to load database models:", err);
    dbError = err.message + (err.stack ? '\n' + err.stack : '');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');

app.get('/api/health', (req, res) => {
    res.json({
        status: db ? 'ok' : 'error',
        message: db ? 'Server is healthy' : 'Database failed to load',
        timestamp: new Date().toISOString(),
        dbError: dbError
    });
});

if (db) {
    app.use('/api/auth', authRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/stock', stockRoutes);

    // Database Init Route for Vercel
    app.get('/api/init', async (req, res) => {
        try {
            await db.sequelize.sync({ alter: true }); // Sync tables
            const seed = require('./seed');
            await seed(db); // Run seeders
            res.json({ message: 'Database initialized and seeded successfully.' });
        } catch (error) {
            console.error('Init Error:', error);
            res.status(500).json({ error: error.message });
        }
    });
} else {
    // Fallback route for all other requests to indicate server is in safe mode
    app.use('/api/*', (req, res) => {
        res.status(503).json({
            error: 'Service Unavailable',
            message: 'Database connection failed. Check /api/health for details.',
            dbError: dbError
        });
    });
}

// Export app for Vercel/Testing
module.exports = app;

// Only listen if run directly (not imported as module)
if (require.main === module) {
    // Sync Database and Seed
    db.sequelize.sync().then(() => {
        console.log('Database synced.');
        require('./seed')(db);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    });
}
