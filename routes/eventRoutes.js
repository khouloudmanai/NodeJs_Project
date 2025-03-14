const express = require("express");
const router = express.Router();  // Utilisation de 'router' au lieu de 'app'
const Event = require("../models/Event.js");

// Route pour récupérer tous les événements
router.get('/', async (req, res) => {  // Remplace 'app.get' par 'router.get'
    try {
        const events = await Event.find();

        const formattedEvents = events.map(event => ({
            title: event.title,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            location: event.location
        }));

        res.json(formattedEvents);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events', error: err });
    }
});

// Route pour ajouter un événement
router.post('/', async (req, res) => {  // Remplace 'app.post' par 'router.post'
    const { title, start, end, location } = req.body;

    // Vérification des données reçues
    if (!title || !start || !end || !location) {
        return res.status(400).json({ message: "Missing required fields: title, start, end, or location." });
    }

    try {
        // Créer un nouveau document d'événement
        const newEvent = new Event({
            title,
            start: new Date(start), // Assure-toi que `start` et `end` sont au format Date
            end: new Date(end),
            location
        });

        // Sauvegarder l'événement dans la base de données
        const savedEvent = await newEvent.save();

        // Retourner la réponse avec l'événement créé
        res.status(201).json({
            message: 'Event created',
            event: savedEvent
        });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ message: 'Error creating event', error: err });
    }
});

module.exports = router;  // Exporter le router

