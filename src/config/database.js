module.exports = {
    url: process.env.MONGOLAB_URI || process.env.DATABASE_URL || 'mongodb://localhost'
};
