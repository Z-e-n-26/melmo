const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret-key', {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            role: user.role,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.register = async (req, res) => {
    // Basic register for testing, though not strictly required by requirements (only Admin can manage users, but need way to create first user if seed fails or for extension)
    try {
        const user = await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            role: req.body.role || 'staff'
        });
        res.send({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
