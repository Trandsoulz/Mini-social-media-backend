const { Schema, model } = require("mongoose");
const crypto = require("crypto");

const TokenModel = new Schema(
  {
    _user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    otpToken: {
      type: String,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 300, // 5 mins
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TokenModel.methods.generateOtp = function () {
  let digits =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  this.otpToken = crypto.createHash("sha256").update(OTP).digest("hex");

  return OTP;
};

exports.Token = model("Token", TokenModel);
