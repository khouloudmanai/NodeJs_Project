const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment.js");
const User = require("../models/user");
const mongoose = require("mongoose");
const authenticate = require('../middlewares/authMiddleware');

router.post("/create", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).send({ message: "appointment saved successfully", appointment });
  } catch (error) {
    res.status(500).send({ message: "error saving appointment", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user'); 
    const events = appointments.map(appointment => ({
      title: `Appointment with ${appointment.professionel}`,
      start: appointment.Date, // Assuming `Date` is a valid date string
    }));
    res.status(200).json(events); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Convert string to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const appointment = await Appointment.findOne({ user: userId }).populate('user');
    console.log("Appointment:", appointment);

    if (!appointment) {
      return res.status(404).json({ error: "No appointment found for the specified user" });
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
      },
      appointment: {
        date: appointment.Date,
        professional: appointment.professionel,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error fetching data", details: error.message });
  }
});

router.put("/update/:user", async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      user: req.params.user,
    });

    if (!appointment) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { user: req.params.user },
      { $set: req.body }, // Updates only the provided fields
      { new: true, runValidators: true } // Returns updated document & validates data
    );

    res
      .status(200)
      .json({
        message: "Appointment updated successfully",
        updatedAppointment,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: error.message });
  }
});


 router.delete("/delete/:user", async (req, res) => {
   try {
     const appointment = await Appointment.findOne({ user: req.params.user });

     if (!appointment) {
       return res.status(404).json({ message: "Appointment not found" });
     }

     await Appointment.deleteOne({ user: req.params.user });

     res.status(200).json({ message: "Appointment deleted successfully" });
   } catch (error) {
     res
       .status(500)
       .json({ message: "Error deleting appointment", error: error.message });
   }
 });

module.exports = router;