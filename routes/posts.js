const express = require("express");
const {
  CreatePost,
  GetAllPosts,
  GetUsersPosts,
  DeletePost,
} = require("../controllers/postController");
const { ProtectedRoute } = require("../controllers/authController");

const router = express.Router();

// Protect all routes that come after this 'use middleware

router.use(ProtectedRoute);

router.get("/getallposts", ProtectedRoute, GetAllPosts);
router.get("/getuserposts", ProtectedRoute, GetUsersPosts);
router.post("/createpost", ProtectedRoute, CreatePost);
router.delete("/deletepost/:postId", ProtectedRoute, DeletePost);

module.exports = router;
