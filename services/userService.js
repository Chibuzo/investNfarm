const User = require('../models').User;
const emailService = require('../services/emailService');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ErrorHandler } = require('../helpers/errorHandler');

const { Buffer } = require('buffer');

const create = async ({ fullname, age_group, email, phone, country, gender, password }) => {
    if (!fullname) throw new ErrorHandler(400, 'Fullname are required');
    if (!email) throw new ErrorHandler(400, 'Email is required');
    if (!phone) throw new ErrorHandler(400, 'Phone number is required');
    if (!country) throw new ErrorHandler(400, 'Country is required');
    if (!password) throw new ErrorHandler(400, 'Password is required');

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new ErrorHandler(400, `A user already exist with this email (${email})`);

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const data = {
        fullname,
        email,
        age_group,
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
        attributes: ['id', 'fullname', 'email', 'country', 'phone', 'password', 'status']
    });
    if (!foundUser) throw new ErrorHandler(404, 'Email or password is incorrect');

    const user = foundUser.toJSON();

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new ErrorHandler(400, 'Email and password doesn\'t match');

    if (user.status === 'Inactive') {
        return { status: false, email: user.email };
    }

    delete user.password;
    return user;
}

const activateAccount = async (email_hash, hash_string) => {
    if (!email_hash || !hash_string) {
        throw new ErrorHandler(400, 'Email or hash not found');
    }
    const email = Buffer.from(email_hash, 'base64').toString('ascii');
    const user = await User.findOne({ where: { email } }, { raw: true });

    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(user.email + 'okirikwenEE129Okpkenakai').digest('hex');
    if (hash_string !== hash) {
        throw new ErrorHandler(400, 'Invalid hash. couldn\'t verify your email');
    }
    await User.update({ status: 'Active' }, { where: { email } });
    return { ...user, status: 'Active' };
}

const find = async (criteria = {}) => {
    const { where = {} } = criteria;
    delete criteria.where;
    where.deleted = false;
    const users = await User.findAll({
        where,
        order: [
            ['createdAt', 'DESC']
        ],
        criteria
    });
    return users.map(user => sanitize(user));
}

const updateUser = async userData => {
    const id = userData.id
    delete userData.id;
    return User.update(userData, { where: { id } });
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
    activateAccount,
    find,
    updateUser
}