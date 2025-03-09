const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur (pour les informations de base)
    required: true,
    unique: true,
  },
  specialty: {
    type: String, // Spécialité du professionnel (ex: médecin généraliste, coach sportif)
    required: true,
    trim: true,
  },
  availability: [
    {
      day: {
        type: String, // Jour de disponibilité (ex: "Lundi", "Mardi")
        required: true,
      },
      startTime: {
        type: String, // Heure de début de disponibilité (ex: "09:00")
        required: true,
      },
      endTime: {
        type: String, // Heure de fin de disponibilité (ex: "17:00")
        required: true,
      },
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment', // Référence aux rendez-vous du professionnel
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Date de création du profil professionnel
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Date de mise à jour du profil professionnel
  },
});

// Mettre à jour la date de mise à jour avant de sauvegarder
professionalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional;