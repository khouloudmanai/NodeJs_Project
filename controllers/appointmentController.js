// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const { sendEmail } = require('../services/emailService');

// Créer un rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const { client, professional, date, duration, notes } = req.body;
    const newAppointment = await Appointment.create({ client, professional, date, duration, notes });

    // Envoyer une confirmation par e-mail
    const userEmail = 'client@example.com'; // Récupérer l'e-mail du client depuis la base de données
    const subject = 'Confirmation de rendez-vous';
    const text = `Votre rendez-vous est confirmé pour le ${newAppointment.date}.`;
    const html = `<p>Votre rendez-vous est confirmé pour le <strong>${newAppointment.date}</strong>.</p>`;

    await sendEmail(userEmail, subject, text, html);

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error });
  }
};

// Récupérer tous les rendez-vous d'un utilisateur
exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ $or: [{ client: userId }, { professional: userId }] });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error });
  }
};

// Récupérer un rendez-vous par son ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du rendez-vous', error });
  }
};

// Mettre à jour un rendez-vous
exports.updateAppointment = async (req, res) => {
  try {
    const { date, duration, notes, status } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, duration, notes, status },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous', error });
  }
};

// Annuler un rendez-vous
exports.cancelAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(200).json({ message: 'Rendez-vous annulé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation du rendez-vous', error });
  }
};