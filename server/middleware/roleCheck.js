const roleCheck = (roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user info" });
        }

        if (roles.includes(req.user.role)) {
            return next();
        }

        return res.status(403).json({
            message: `Access Denied: Role '${req.user.role}' is not permitted.`,
        });
    };
};

module.exports = { roleCheck };

