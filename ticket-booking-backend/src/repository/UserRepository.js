const MessageConstant = require("../constant/MessageConstant");
const { getInitials } = require("../helper/DataHelper");
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");
const User = require("../model/User");
const { InvalidRequestException } = require("../utils/Exception");

class UserRepository {
    // Create User
    async addUser(data) {
        const existingUser = await User.findOne({
            where: { email: data?.email, softDelete: false },
        });
        if (existingUser) {
            throw new InvalidRequestException(
                MessageConstant.USER_ALREADY_EXISTS_WITH_THIS_EMAIL
            );
        }
        return await User.create(data);
    }

    // async await used for asynchronous operations
    sum(a, b) {
        return a + b
        // return await User.create(data);
    }

    // Get all users
    async getAllUsers() {
        return await User.findAll({
            where: { softDelete: false },
            order: [["id", "ASC"]]
        });
    }

    // Get user for login by email
    async loginUser(email) {
        return await User.findOne({
            where: { email, softDelete: false },
        });
    }

    // Get user by ID including tickets & event details
    async getUserById(id) {
        const user = await User.findOne({   
            where: { id, softDelete: false },
            include: [
                {
                    model: Ticket,
                    as: "tickets",
                    required: false,
                    include: [
                        {
                            model: Event,
                            as: "event",
                            where: { softDelete: false }
                        }
                    ]
                }
            ]
        });
        if (!user) return null;
        const tickets = user.tickets || [];
        return {
            ...user.dataValues,
            initials: getInitials(user?.name),
            totalBookings: tickets?.filter((t) => !t.softDelete)?.length,
            cancelledBookings: tickets?.filter((t) => t.softDelete)?.length,
        };
    }

    // Fetch user only by email (reusable for validation)
    async getUserByEmail(email) {
        return await User.findOne({
            where: { email, softDelete: false },
        });
    }

    // Update User
    async updateUserById(id, data) {
        return await User.update(data, {
            where: { id },
            returning: true,
        });
        // [1]
    }

    // Soft Delete
    async deleteUserById(id) {
        return await User.update({ softDelete: true }, { where: { id, softDelete: false } });
    }
}

module.exports = new UserRepository();