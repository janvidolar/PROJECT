const getInitials = (name = "") => {
    return name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join("");
};

const formatStatus = (status, naValue = "") => {
    if (!status) return naValue;
    return status
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

module.exports = { getInitials, formatStatus };
