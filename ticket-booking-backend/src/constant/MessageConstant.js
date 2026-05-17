const MessageConstant = {
    // RESPONSE
    SUCCESS: "Success",
    ERROR: "Error",
    OK: "OK",
    CREATED: "CREATED",
    UPDATED: "UPDATED",
    DELETED: "DELETED",
    NO_DATA_FOUND: "No data found",
    SOMETHING_WENT_WRONG: "Something went wrong, please try again later",

    // EXCEPTION
    INVALID_REQUEST: "Invalid request",
    NOT_FOUND: "Not found",
    UNAUTHORIZED: "Unauthorized",
    INTERNAL_SERVER_ERROR: "Internal server error",
    USER_DOES_NOT_EXIST_WITH_THIS_EMAIL: "User does not exist with this email",
    ROLE_MISMATCH: "Role mismatch",
    INCORRECT_PASSWORD: "Incorrect password",
    USER_ALREADY_EXISTS_WITH_THIS_EMAIL: "User already exists with this email",

    // USER
    USER_ADDED_SUCCESSFULLY: "User Added Successfully",
    USER_UPDATED_SUCCESSFULLY: "User Updated Successfully",
    USER_DELETED_SUCCESSFULLY: "User Deleted Successfully",
    USERS_FOUND_SUCCESSFULLY: "User Found Successfully",
    LOGIN_SUCCESSFULLY: "Login Successfully",

    // EVENT
    EVENT_ADDED_SUCCESSFULLY: "Event added successfully",
    EVENT_NOT_FOUND: "Event not found",
    EVENT_FOUND_SUCCESSFULLY: "Event found successfully",
    EVENT_UPDATED_SUCCESSFULLY: "Event updated successfully",
    EVENTS_FOUND_SUCCESSFULLY: "Events found successfully",
    EVENT_DELETED_SUCCESSFULLY: "Event deleted successfully",

    // TICKET
    TICKET_ADDED_SUCCESSFULLY: "Ticket added successfully",
    TICKET_NOT_FOUND: "Ticket not found",
    TICKET_FOUND_SUCCESSFULLY: "Ticket found successfully",
    TICKET_UPDATED_SUCCESSFULLY: "Ticket updated successfully",
    TICKETS_FOUND_SUCCESSFULLY: "Tickets found successfully",
    TICKET_DELETED_SUCCESSFULLY: "Ticket deleted successfully",
};

module.exports = MessageConstant;
