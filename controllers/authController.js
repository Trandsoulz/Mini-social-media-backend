const CatchAsnycError = require("../utils/CatchAsyncError");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const { Token } = require("../models/tokenModel");
const { sendEmail } = require("../utils/sendMail");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const config = process.env;
const secret = config.JWT_SECRET;
const expiresIn = config.JWT_EXPIRES_IN;

exports.ProtectedRoute = CatchAsnycError(async (req, res, next) => {
  // Get user token and verify it has a token
  const token = req.headers.authorization;
  if (!token) {
    return next(new AppError("Unauthorised access", 401));
  }
  //   console.log(token);
  const userToken = token.split(" ")[1];
  // console.log(userToken);

  //   getId from the JWT token. Verify it exists
  const { id: userId } = jwt.verify(userToken, secret);

  req.user = userId;
  next();
});

exports.DecodeJWT = CatchAsnycError(async (req, res, next) => {
  const { token } = req.body;
  const decodedToken = jwt.verify(token, secret, { complete: true });

  res.status(200).json({
    status: "success",
    message: decodedToken,
  });
});

exports.Signup = CatchAsnycError(async (req, res, next) => {
  const newUser = {
    name: req.body.full_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    password: req.body.password,
  };

  const user = await User.create(newUser);

  const userDetails = {
    full_name: user.name,
    email: user.email,
    phone_number: user.phone_number,
  };

  // Put userId inside the jwt
  const userId = user._id;

  const token = await jwt.sign({ id: userId }, secret, { expiresIn });
  // res.setHeader("authorization", `Bearer ${token}`);

  // console.log(res.authorization);
  res.header("Authorization", `Bearer ${token}`).status(201).json({
    status: "success",
    token,
    userDetails,
  });
});

exports.Login = CatchAsnycError(async (req, res, next) => {
  const { email, password } = req.body;
  // ! First do error handling
  if (!email || !password) {
    return next(new AppError("Please, input your details", 400));
  }

  // Find user with email, and add hashpassword as well
  const user = await User.findOne({ email }).select("+hashedPassword");
  // console.log(user);

  //Now, ensure the password is thesame
  const correctPassword = await bcrypt.compare(password, user.hashedPassword);

  // Now, conditionals
  if (!user) return next(new AppError("User does not exist", 404));
  if (!correctPassword) return next(new AppError("Incorrect details", 400));

  const userDetails = {
    full_name: user.name,
    email: user.email,
    phone_number: user.phone_number,
  };
  // console.log(user);

  // Put userId inside the jwt
  const userId = user._id;

  // Sign token, and log the user in
  const token = await jwt.sign({ id: userId }, secret, {
    noTimestamp: true,
    expiresIn,
  });

  res.header("Authorization", `Bearer ${token}`).status(200).json({
    status: "success",
    message: "Logged in successfully",
    userDetails,
  });
});

exports.ForgotPassword = CatchAsnycError(async (req, res, next) => {
  // ! Get and verify user
  const { email: userEmail } = req.body;

  const user = await User.findOne({ email: userEmail }).select(
    "password hashedPassword email name passwordResetToken passwordResetExpires _id"
  );

  if (!user)
    return next(new AppError("User with this email, doesnt exist", 404));

  // ! Generate a random reset token

  let token = new Token();
  const OTPToken = await token.generateOtp();
  token._user = user._id;
  await token.save();

  // req.user = user._id;
  // ! Send to the user's email

  try {
    await sendEmail({
      email: user.email,
      subject: "Otp for reset password. (5 minutes)",
      message: `Input this 6 digit token, in order to reset your password <strong> ${OTPToken} </strong>`,
    });
  } catch (error) {
    console.log(error);
    token.otpToken = undefined;
    await token.save({ validateBeforeSave: false });
    return next(new AppError("An error occured", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Successfully sent a password reset token, to this email address",
    OTPToken,
  });
});

exports.ResetPassword = CatchAsnycError(async (req, res, next) => {
  const { token, password } = req.body;
  // Hash the token, and compare it with the one in the DB.
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Compare the token,
  const Tokenverify = await Token.findOne({ otpToken: hashedToken });
  // console.log(Tokenverify);

  if (!Tokenverify) next(new AppError("Token is invalid", 401));

  // console.log()

  // Find the user
  const user = await User.findById(Tokenverify._user).select("password");
  // Edit the password to the given password
  user.password = password;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Your password has been reset. Go back and log in",
  });
});

exports.DeleteUser = CatchAsnycError(async (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId);
  res.status(204).json({
    status: "success",
  });
});
