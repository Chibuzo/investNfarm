const { Investment, UserInvestments, User, InvestmentCategory } = require('../models');
const { ErrorHandler } = require('../helpers/errorHandler');
const { uploadFile } = require('../helpers/fileUpload');
const { buildCriteria } = require('../services/UtillityService');
const walletService = require('../services/walletService');

const save = async ({ body: investmentData, files }) => {
    const photo_url = await uploadFile(files);
    if (investmentData.id) {
        const id = investmentData.id;
        delete investmentData.id;
        if (photo_url) investmentData.photo_url = photo_url;
        return Investment.update(investmentData, { where: { id } });
    }
    return Investment.create({ ...investmentData, photo_url });
}

const view = async (id, investments = false) => {
    const rawInvestment = await Investment.findOne({
        where: { id },
        //include: ['investors', 'InvestmentCategory']
        include: [
            {
                model: UserInvestments,
                as: 'userInvestments',
                where: { status: 'active' },
                required: false
            },
            {
                model: InvestmentCategory
            }
        ]
    });
    if (!rawInvestment) {
        throw new ErrorHandler(404, 'Investment not found');
    }
    const investment = sanitize(rawInvestment);

    if (investments) {
        investment.investments = await getFarmInvestments(investment.InvestmentCategory.id);
    }
    return investment;
}

const list = async (queryCriteria = {}) => {
    const { where, criteria } = buildCriteria(queryCriteria);

    const investments = await Investment.findAll({
        where,
        order: [
            ['createdAt', 'DESC']
        ],
        ...criteria
    });

    return investments.map(investment => sanitize(investment));
}

const getUserInvestments = async (user_id, queryCriteria = {}, fullData = false) => {
    const user = await User.findByPk(user_id);
    if (!user) return null;

    const { where, criteria } = buildCriteria(queryCriteria);

    if (fullData) {
        return user.getInvestments({ where, ...criteria, joinTableAttributes: ['units', 'createdAt'], raw: true, nest: true });
    }
    return user.getUserInvestments({ where, joinTableAttributes: ['units', 'createdAt'], raw: true });
}

const fetchUserInvestments = async (criteria) => {
    const investments = await UserInvestments.findAll(criteria);
    return investments;
}

const invest = async ({ userId: UserId, investmentId: InvestmentId, units = 1 }) => {
    const investment = await Investment.findByPk(InvestmentId);
    if (!investment) throw new ErrorHandler(404, 'Investment not found');

    // return pending investment if any
    const pendingInvestment = await UserInvestments.findOne({ where: { InvestmentId, UserId, status: 'pending' } });
    if (pendingInvestment) {
        return pendingInvestment;
    }

    return investment.createUserInvestment({ UserId, InvestmentId, units });
}

const updateInvestment = async (data) => {
    const id = data.id;
    delete data.id;
    return Investment.update(data, { where: { id } });
}

const getFarms = async () => {
    const farms = await InvestmentCategory.findAll({ include: 'investments' });
    return farms.map(farm => sanitizeFarm(farm));
}

const viewFarm = async id => {
    const farm = await InvestmentCategory.findByPk(id);
    return sanitizeFarm(farm);
}

const getFarmInvestments = async id => {
    return list({
        where: { InvestmentCategoryId: id },
        include: ['investors', 'InvestmentCategory']
    });
}

const saveFarm = async ({ body: farmData, files }) => {
    const photo_url = await uploadFile(files);
    let benefits = JSON.stringify(farmData['benefit[]'].filter(benefit => benefit));
    delete farmData['benefit[]'];
    farmData.benefits = benefits || [];
    if (farmData.id) {
        const id = farmData.id;
        delete farmData.id;
        if (photo_url) farmData.photo_url = photo_url;
        return InvestmentCategory.update(farmData, { where: { id } });
    }
    return InvestmentCategory.create({ ...farmData, photo_url });
}

const sanitize = rawInvestment => {
    if (!rawInvestment) return null;

    const investment = { ...rawInvestment.toJSON() };
    if (investment.InvestmentCategory) {
        investment.InvestmentCategory.benefits = JSON.parse(investment.InvestmentCategory.benefits) || [];
    }
    if (investment.userInvestments) {
        investment.investor_count = investment.userInvestments.length;
        investment.sold_unit_count = investment.userInvestments.reduce((totalUnits, user) => totalUnits + user.units, 0);
        investment.avaliable_units = investment.units - investment.sold_unit_count;
    }
    return investment;
}

const sanitizeFarm = rawFarm => {
    const farm = { ...rawFarm.toJSON() };
    return { ...farm, benefits: JSON.parse(farm.benefits) || [] };
}

module.exports = {
    save,
    view,
    list,
    getUserInvestments,
    fetchUserInvestments,
    invest,
    updateInvestment,
    getFarms,
    saveFarm,
    viewFarm
}