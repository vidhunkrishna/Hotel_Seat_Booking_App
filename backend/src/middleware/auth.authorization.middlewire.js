export const authorizationmiddleware = (...allowedroles) => {
  return (req, res, next) => {
    const role = req.user.role;
    if (!allowedroles.includes(role)) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    next();
  };
};
