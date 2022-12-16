const mongoose = require("mongoose");

const RepairSchema = new mongoose.Schema({
  tenantid: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  unit: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  amount: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  // paymentdate: {
  //   type: Date,
  //   required: [true, "Please fill up this field"],
  // },
  description: {
    type: String,
    required: [true, "Please fill up this field"],
  },
  paymentmode: {
    type: String,
    default: "Gcash",
  },
  proofofpayment: {
    type: String,
    // required: [true, "Please fill up this field"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: [true, "Please fill up this field"],
  },
});

module.exports =
  mongoose.models.Repair || mongoose.model("Repair", RepairSchema);
