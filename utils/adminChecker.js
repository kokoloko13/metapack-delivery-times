const Role = require('../models/role');

module.exports = async (roleId) => {
    const userRole = await Role.findById(roleId);

    return userRole === "ADMIN" ? true : false;
}