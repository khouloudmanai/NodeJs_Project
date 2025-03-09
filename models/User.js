const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs'); // Ensure bcryptjs is correctly imported

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email doit être unique
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['client', 'professional', 'admin'] },
  age: { type: Number } // Pas d'index unique ici
});

// Hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(userPassword) {
  return bcryptjs.compare(userPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);