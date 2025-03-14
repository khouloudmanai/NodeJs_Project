require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
//const notificationRoutes = require('./routes/notificationRoutes');
const { authenticate } = require('./middlewares/authMiddleware');
const User = require('./models/user');
const Emailservice = require('./mailer/Emailservice');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Connexion à MongoDB
mongoose.connect(process.env.DB_URI)
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => {
  console.error('❌ Erreur de connexion à MongoDB :', err);
  process.exit(1);
});

app.use(express.json());
// Routes API
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/events', eventRoutes);

const emailService = new Emailservice({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // Corrected to 'true' for SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  const emailSent = await emailService.sendEmail({ to, subject, text });
  if (emailSent) {
    res.send({ message: "Email sent successfully" });
  } else {
    res.status(500).send({ message: "Failed to send email" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// Démarrage du serveur
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log('SECRET_KEY:', process.env.JWT_SECRET);
});
