const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  sms: {
    type: String,
  },
  image: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Request || mongoose.model("Request", RequestSchema);
