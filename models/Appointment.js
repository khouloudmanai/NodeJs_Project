const mongoose = require('mongoose')
const bcryptjs = require("bcryptjs");
const appoinmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  professionel: String,
  Date: Date,
  status: {
    type: String,
    enum: ["scheduled", "cancelled"],
    default: "scheduled",
  },
});




module.exports = mongoose.model('Appoinments', appoinmentSchema)