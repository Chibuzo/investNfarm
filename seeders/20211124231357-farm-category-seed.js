'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('investmentCategories', [
            {
                category_name: "Pig Farm",
                about: `Pig farming also known as piggery is another aspect of farming in most countries of Africa that is making smart investors and
                        entrepreneurs huge money on daily basis. it is becoming very popular day by day. This agricultural business idea can get return
                        of your total investment within very short time. The primary reason for huge returns from this business is due to the high demand
                        of pork meat globally and its fast sales in the market. Pigs reproduce in large numbers and grow super-fast.
                        Despite this huge ROI in pig farming, a lot of people are still ignorant to this billion - dollar business. While some still
                        doubt the profitability of this business`,
                benefits: "",
                model: `Investnfarm is at the forefront of  the development for the production and processing of pork meat . The demand for pork meat globally is unprecedented so much so that no matter the quantity supplied into the market, it would be consumed by ready buyers. This is so because of it is a rich source of certain vitamins and minerals your body needs to function. It’s also an excellent source of high-quality protein, above all, it tastes great and can be found in any of the various recreation centres especially restaurants, fast food outlets etc
                        As part of its value-addition drive, Investnfarm is into commercial processing and marketing of pigs. Pigs from our farm are sold not only alive, a large proportion is processed, prepared and packaged for onward marketing through our retail store (Investnfarm Comodities) and other retail stores.
                        Investment opportunities in pig farming are enormous. Our farm capacities are both modern and are continuously undergoing improvements with the aims of reducing cost of production and improving quality of yield.`,
                photo_url: "piggery.jpg"
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('investmentCategories', null, {});
    }
};
