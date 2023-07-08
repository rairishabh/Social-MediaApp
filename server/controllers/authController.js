const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;

const signUpController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      // return res.status(400).send("all fields are required");
      return res.send(error(400, "all fields are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      // return res.status(409).send("User already exists with this email");
      return res.send(error(409, "User already exists with this email"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    user.save();

    return res.send(success(201, "user created successfully"));
  } catch (e) {
    res.send(error(500, e.message));
    console.log("error>>", e);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // return res.status(400${email}).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.send(
        error(404, `User with this email: ${email} does not exist`)
      );
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.send(error(403, "Incorrect Password"));
    }

    const accessToken = generateAccesstoken({
      _id: user._id,
    });

    const refreshToken = generateRefreshtoken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(201, { accessToken: accessToken }));
  } catch (e) {
    res.send(error(500, e.message));
    console.log("error>>", e);
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(error(200, "User logout successfully"));
  } catch (e) {
    console.log("error form logoutController", e);
    return res.send(error(500, e.message));
  }
};

// This api will check the refresh token validity and generate new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookies>>>>>", cookies);
  if (!cookies.jwt) {
    return res.send(error(401, "Refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccesstoken({ _id });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    return res.send(error(401, "Invalid Refresh Token"));
  }
};

// Internal Function

const generateAccesstoken = (data) => {
  try {
    const token = jwt.sign(data, accessTokenPrivateKey, { expiresIn: "1d" });
    console.log(token);
    return token;
  } catch (e) {
    console.log("error:", e);
    return res.send(error(401, "Token Expired"));
  }
};

const generateRefreshtoken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log("error:", e);
    return res.status(401).send("Token Expired");
  }
};

module.exports = {
  signUpController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
