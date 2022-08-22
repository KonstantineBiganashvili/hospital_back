const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const validators = require('../helpers/validator');

const { validEmail, validPassword } = validators;

// For testing, will remove later
module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.send(users);
    } catch (error) {
        res.status(422).send({ answer: error.message });
    }
};

// User registration functionale
module.exports.registerUsers = async (req, res) => {
    const { login, password } = req.body;
    const errorsArray = [];

    if (!validEmail(login)) errorsArray.push('Please enter valid email!');
    if (!validPassword(password))
        errorsArray.push(
            'Password has to be at least 8 symbols long and must contain at least one number and special symbol!'
        );

    if (errorsArray.length) {
        return res.status(422).send({ answer: errorsArray });
    }

    const oldUser = await User.findOne({ where: { login } });
    if (oldUser) {
        errorsArray.push(
            'User with this email already exists, please use different email!'
        );
        return res.status(409).send({ answer: errorsArray });
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            login: login.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { user_id: user.id, login, password },
            process.env.TOKEN_KEY,
            {
                expiresIn: '2h',
            }
        );

        user.token = token;

        return res.status(201).send({ login, token });
    } catch (error) {
        return res.status(422).send({ message: error.message });
    }
};

// User login function
module.exports.loginUsers = async (req, res) => {
    const { login, password } = req.body;

    if (!login.trim() || !password.trim()) {
        return res
            .status(400)
            .send({ answer: 'You have to enter all fields!' });
    }

    try {
        const user = await User.findOne({ where: { login } });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user.id, login, password },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '2h',
                }
            );

            user.token = token;

            return res.status(200).json({ id: user.id, token });
        }

        return res.status(400).send({ message: 'Invalid credentials!' });
    } catch (error) {
        return res.status(422).send({ message: error.message });
    }
};
