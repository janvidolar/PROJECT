const UserService = require("../service/UserService");
const { getCreatedResponse, getOkResponse, getGeneralResponse, getUpdatedResponse, getDeletedResponse } = require("../utils/Response");
const MessageConstant = require("../constant/MessageConstant");

class UserController {
    // Create User
    addUser = async (req, res, next) => {
        try {
            const result = await UserService.addUser(req.body);
            const meta = getCreatedResponse(
                MessageConstant.USER_ADDED_SUCCESSFULLY,
            );
            return getGeneralResponse(res, meta, result);
        } catch (error) {
            console.log("Error in addUser: ", error);
            next(error);
        }
    };

    // Get all users
    getAllUsers = async (_, res, next) => {
        try {
            const result = await UserService.getAllUsers();
            const meta = getOkResponse(
                MessageConstant.USERS_FOUND_SUCCESSFULLY,
            );
            return getGeneralResponse(res, meta, result);
        } catch (error) {
            console.log("Error in getAllUsers: ", error);
            next(error);
        }
    };

    // Login User
    loginUser = async (req, res, next) => {
        try {
            const result = await UserService.loginUser(req.body);
            const meta = getOkResponse(MessageConstant.LOGIN_SUCCESSFULLY);
            return getGeneralResponse(res, meta, result);
        } catch (error) {
            console.log("Error in loginUser: ", error);
            next(error);
        }
    };

    // Get User by ID
    getUserById = async (req, res, next) => {
        try {
            const result = await UserService.getUserById(req.params.id);
            const meta = getOkResponse(MessageConstant.USERS_FOUND_SUCCESSFULLY);
            return getGeneralResponse(res, meta, result);
        } catch (error) {
            console.log("Error in getUserById: ", error);
            next(error);
        }
    };

    // Update User
    updateUserById = async (req, res, next) => {
        try {
            const result = await UserService.updateUserById(
                req.params.id,
                req.body,
            );
            const meta = getUpdatedResponse(
                MessageConstant.USER_UPDATED_SUCCESSFULLY,
            );
            return getGeneralResponse(res, meta, result);
        } catch (error) {
            console.log("Error in updateUserById: ", error);
            next(error);
        }
    };

    // Delete User
    deleteUserById = async (req, res, next) => {
        try {
            await UserService.deleteUserById(req.params.id);
            const meta = getDeletedResponse(
                MessageConstant.USER_DELETED_SUCCESSFULLY,
            );
            return getGeneralResponse(res, meta, null);
        } catch (error) {
            console.log("Error in deleteUserById: ", error);
            next(error);
        }
    };
}

module.exports = new UserController();
