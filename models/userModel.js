const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
// const crypto = require("crypto");

const UserModel = new Schema(
  {
    name: {
      type: String,
      trim: true,
      // required: [true, "A full name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "An email is required"],
      lowercase: true,
    },
    phone_number: {
      type: Number,
      max: [11111111111, "Your phone number should not be above 11"],
      min: [1234567890, "Your phone number should not be below 11"],
    },
    password: {
      type: String,
      select: false,
    },
    hashedPassword: {
      type: String,
      select: false,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserModel.pre("save", async function (next) {
  this.hashedPassword = await bcrypt.hash(this.password, 12);
  next();
});

// Virtual populate. Connect posts to a particular user
// UserModel.virtual("user_posts", {
//   ref: "Posts",
//   foreignField: "_user",
//   localField: "_id",
// });

// Instance methods. More like functions you can create

// UserModel.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };

const User = model("User", UserModel);

module.exports = User;
