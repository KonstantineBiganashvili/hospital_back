const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

// For testing, will remove later
module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.send(users);
    } catch (error) {
        res.status(422).send({ answer: error });
    }
};

// User registration functionale
module.exports.registerUsers = async (req, res) => {
    const { login, password } = req.body;
    const errorsArray = [];

    const validateEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const validatePassword =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!login && !password) {
        if (!login) errorsArray.push('Email must not be empty!');
        if (!password) errorsArray.push('Password must not be empty!');
        if (errorsArray.length)
            return res.status(400).send({ answer: errorsArray });
    }

    const oldUser = await User.findOne({ where: { login } });
    if (oldUser) {
        errorsArray.push(
            'User with this email already exists, please use different email!'
        );
        return res.status(409).send({ answer: errorsArray });
    }

    if (
        !validateEmail.test(login) ||
        !validatePassword.test(password) ||
        password.length < 8
    ) {
        if (!validateEmail.test(login))
            errorsArray.push('Please enter valid email!');
        if (!validatePassword.test(password))
            errorsArray.push(
                'Password must contain at least one number and special symbol!'
            );
        if (password.length < 8)
            errorsArray.push('Password must be at least 10 characters long!');

        if (errorsArray.length) {
            return res.status(400).send({ answer: errorsArray });
        }
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            login: login.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(user.id, login, process.env.TOKEN_KEY, {
            expiresIn: '2h',
        });

        user.token = token;

        return res.status(201).send(user);
    } catch (error) {
        return res.status(422).send({ message: error });
    }
};
