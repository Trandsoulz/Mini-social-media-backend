const { Schema, model } = require("mongoose");

const PostModel = new Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    images: [{ type: String, required: true }],

    _user: { type: Schema.ObjectId, ref: "User", required: true },

    // createdAt: { type: Date, default: Date.now, select: false },
  },
  {
    timestamps: true,
  }
);

// Query middleware

// Sort all the posts to make sure the top most feild is the last item added
PostModel.pre(/^find/, function () {
  this.sort("-createdAt");
});

// populate the user
// PostModel.pre(/^find/, function () {
//   this.populate({
//     path: "_user",
//     select: "-__v -createdAt",
//   });
// });

const Posts = model("Posts", PostModel);
module.exports = Posts;
