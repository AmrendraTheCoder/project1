import jwt from "jsonwebtoken";
// Instead of redefining the interface, we'll use the existing one
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined) {
        res.status(401).json({ status: 401, message: "UnAuthorised" });
        return;
    }
    const token = authHeader.split(" ")[1];
    // * Verify the JWT token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            res.status(401).json({ status: 401, message: "UnAuthorized" });
            return;
        }
        // Use type assertion without specifying the interface name
        req.user = user;
        next();
    });
};
export default authMiddleware;
