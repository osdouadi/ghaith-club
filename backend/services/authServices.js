const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

// Signup services
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "sucess",
    token,
    data: {
      user,
    },
  });
};

// Login services
exports.verifyCredentialsAdd = async (email, password, next) => {
  // 1) => Check if user iserted his email and password
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
};

// Protect routes

// Check if token exists
const isThereToken = (next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (res.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in!"));
  }
};

// Check if user still exists
const checkUserExists = async (decodedToken, currentUser, next) => {
  if (!currentUser) {
    return next(new AppError("This user no longer exists", 401));
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently chnaged password! Please login again.")
    );
  }
};

exports.protect = catchAsync(async (req, res, next) => {
  // Verify token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const currentUser = await User.findById(decodedToken.id);

  isThereToken(next);
  checkUserExists(decodedToken, currentUser, next);

  // Grant access to the protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Authorazation
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission"));
    }

    next();
  };
};
