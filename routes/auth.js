const express = require("express");

const {
  Signup,
  DeleteUser,
  Login,
  DecodeJWT,
  ForgotPassword,
  ResetPassword,
} = require("../controllers/authController");

const router = express.Router();

// router.route("/").post(authController);

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/decodejwt", DecodeJWT);

router.post("/forgotpassword", ForgotPassword);

router.patch("/resetpassword", ResetPassword);

router.delete("/deleteusers/:id", DeleteUser);

module.exports = router;
