
module.exports = {
    buildCriteria: (criteria, deleteFlag = true) => {
        const { where = {} } = criteria;
        delete criteria.where;
        if (deleteFlag) where.deleted = false;
        return { criteria, where };
    },

    formatCurrency: input => {
        return parseInt(input).toLocaleString('en-US', { style: 'decimal' });
    },

    postIntro: (post, no_of_letters = 500) => {
        if (post.length <= no_of_letters) return post;
        const intro = post.substr(0, no_of_letters - 1);
        return intro.substr(0, intro.lastIndexOf(' ')) + '...';
    },

    formatDate: date => new Date(date).toLocaleDateString('en-GB')
}