// utils/logger.js
const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

// Format des logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Configuration des transports (console et fichier)
const logger = winston.createLogger({
  level: 'info', // Niveau de log par défaut
  format: combine(
    colorize(), // Ajouter des couleurs pour la console
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Ajouter un timestamp
    logFormat // Appliquer le format personnalisé
  ),
  transports: [
    new winston.transports.Console(), // Logger dans la console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Logger les erreurs dans un fichier
    new winston.transports.File({ filename: 'logs/combined.log' }), // Logger tout dans un fichier
  ],
});

// Exporter le logger
module.exports = logger;