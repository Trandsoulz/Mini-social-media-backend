const mongoose = require("mongoose");
const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);
module.exports = async () => {
  await mongoose.connect(DB);
  console.log("DB connected...");
};
