const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.send(success(401, "Authorization header is requied"));
  }

  const accesstoken = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accesstoken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id;

    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "User not found"));
    }
    next();
  } catch (e) {
    console.log("error>>>>>>", e);
    return res.send(error(401, "Invaild access key"));
  }
};
