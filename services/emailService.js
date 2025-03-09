// services/emailService.js
const nodemailer = require('nodemailer');

// Configuration du transporteur (exemple pour Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Vous pouvez utiliser un autre service (ex: SendGrid, Mailgun)
  auth: {
    user: process.env.EMAIL_USER, // Votre adresse e-mail
    pass: process.env.EMAIL_PASS, // Votre mot de passe ou clé d'application
  },
});

// Fonction pour envoyer un e-mail
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Expéditeur
      to, // Destinataire
      subject, // Sujet de l'e-mail
      text, // Corps de l'e-mail en texte brut
      html, // Corps de l'e-mail en HTML (optionnel)
    };

    // Envoyer l'e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail envoyé :', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
    throw error;
  }
};

// Exemple d'utilisation
// sendEmail('destinataire@example.com', 'Sujet', 'Texte brut', '<p>HTML</p>');

module.exports = { sendEmail };