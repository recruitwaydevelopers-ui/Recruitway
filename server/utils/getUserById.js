const Auth = require("../models/Auth/Auth-model");

const getUserById = async (userId) => {
    try {
        return await Auth.findById(userId);
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        return null;
    }
};

module.exports = { getUserById };
