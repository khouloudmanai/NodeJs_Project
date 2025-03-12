const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.post('/create', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: "error saving user", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "user not found" });
    }
    res.send({ user });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:email", async (req, res) => {
   try {
     const user = await User.findOne({ email: req.params.email });
     if (!user) {
       return res.status(404).send({ message: "User not found" });
     }

     const updatedUser = await User.findOneAndUpdate(
       { email: req.params.email },
       { $set: req.body }, // Dynamically update fields from request body
       { new: true } // Return the updated document
     );

     res.status(200).json(updatedUser);
   } catch (error) {
     res
       .status(500)
       .send({ message: "Error updating user", error: error.message });
   }
}); 

  

router.delete("/delete/:email", async (req, res) => {
   try {
     const user = await User.findOne({ email: req.params.email });
     if (!user) {
       return res.status(404).send({ message: "User not found" });
     }

     await User.deleteOne({ email: req.params.email });

     res.status(200).send({ message: "User deleted successfully" });
   } catch (error) {
     res
       .status(500)
       .send({ message: "Error deleting user", error: error.message });
   }
  });

module.exports = router;
