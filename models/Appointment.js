const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur client
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur professionnel
    required: true,
  },
  date: {
    type: Date, // Date et heure du rendez-vous
    required: true,
  },
  duration: {
    type: Number, // Durée du rendez-vous en minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], // Statut du rendez-vous
    default: 'pending',
  },
  notes: {
    type: String, // Notes supplémentaires sur le rendez-vous
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date de création du rendez-vous
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Date de mise à jour du rendez-vous
  },
});

// Mettre à jour la date de mise à jour avant de sauvegarder
appointmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;