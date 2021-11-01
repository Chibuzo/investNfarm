const User = require('../models').User;
const emailService = require('../services/emailService');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ErrorHandler } = require('../helpers/errorHandler');

const create = async ({ fname, lname, email, phone, country, gender, password }) => {
    if (!fname || !lname) throw new ErrorHandler(400, 'Firstname and lastname are required');
    if (!email) throw new ErrorHandler(400, 'Email is required');
    if (!phone) throw new ErrorHandler(400, 'Phone number is required');
    if (!country) throw new ErrorHandler(400, 'Country is required');
    if (!password) throw new ErrorHandler(400, 'Password is required');

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const data = {
        fullname: `${lname} ${fname}`,
        email,
        gender,
        phone,
        country,
        password: passwordHash
    };
    const newUser = await User.create(data);
    emailService.sendConfirmationEmail(newUser);
    return sanitize(newUser);
}

const login = async ({ email, password }) => {
    const foundUser = await User.findOne({
        where: { email },
        attributes: ['id', 'fullname', 'email', 'country', 'phone', 'password', 'active']
    });
    if (!foundUser) throw new ErrorHandler(404, 'Email or password is incorrect');

    const user = foundUser.toJSON();

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new ErrorHandler(400, 'Email and password doesn\'t match');

    delete user.password;
    delete user.active;
    return user;
}

const find = async (criteria = {}) => {
    const users = await User.findAll(criteria);
    return users.map(user => sanitize(user));
}

const sanitize = user => {
    delete user.password;
    return {
        ...user.toJSON(),
        investment_count: user.UserInvestments ? user.UserInvestments.length : null
    };
}

module.exports = {
    create,
    login,
    find
}