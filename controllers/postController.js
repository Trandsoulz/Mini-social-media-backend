const Posts = require("../models/postModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const CatchAsyncError = require("../utils/CatchAsyncError");

const config = process.env;

exports.GetAllPosts = CatchAsyncError(async (req, res, next) => {
  // console.log(req.user);
  const posts = await Posts.find();

  res.status(200).json({
    status: "success",
    length: posts.length,
    posts,
  });
});

exports.GetUsersPosts = CatchAsyncError(async (req, res, next) => {
  // console.log(req.user);

  const userId = req.user;

  // Find posts associated with userId parent reference, then show only the user_posts using select. Then populate the user_posts with the user's posts
  // const { user_posts: userPosts } = await User.findById(userId)
  //   .select("user_posts")
  //   .populate("user_posts");

  // another way to search for posts, is to filter it. Look for posts that have identical _user and return it
  let filter = { _user: userId };
  const userPosts = await Posts.find(filter).sort("-createdAt");

  res.status(200).json({
    status: `success`,
    userPosts,
  });
});

exports.CreatePost = CatchAsyncError(async (req, res, next) => {
  // console.log(req.headers, req.body, req.user);
  // console.log(req.user, req.body)
  // Which was gotten from the protected route middleware
  const userId = req.user;

  const newPost = {
    description: req.body.description,
    images: req.body.images,
    _user: userId,
  };

  const post = await Posts.create(newPost);

  const postDetails = {
    description: post.description,
    images: post.images,
  };

  // console.log(newPost);

  res.status(200).json({
    status: "success",
    postDetails,
  });
});

exports.DeletePost = CatchAsyncError(async (req, res, next) => {
  const userId = req.user;
  const { postId: idOfPost } = req.params;
  console.log(req.params);

  await Posts.findByIdAndDelete(idOfPost);

  res.status(204).json({
    status: "success",
    message: "Post deleted",
  });
});
