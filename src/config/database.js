module.exports = {
    url: process.env.MONGOLAB_URL || process.env.DATABASE_URL || 'mongodb://localhost'
};
