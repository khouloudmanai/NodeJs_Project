// services/calendarService.js
const { Calendar } = require('@fullcalendar/core');
const dayGridPlugin = require('@fullcalendar/daygrid');
const timeGridPlugin = require('@fullcalendar/timegrid');
const interactionPlugin = require('@fullcalendar/interaction');

// Initialiser un calendrier
const initCalendar = (calendarEl, events, onDateClick, onEventClick) => {
  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events, // Événements à afficher
    dateClick: onDateClick, // Callback pour le clic sur une date
    eventClick: onEventClick, // Callback pour le clic sur un événement
  });

  calendar.render();
  return calendar;
};

// Convertir un rendez-vous en événement FullCalendar
const convertToCalendarEvent = (appointment) => {
  return {
    id: appointment._id,
    title: `Rendez-vous avec ${appointment.professional.name}`,
    start: appointment.date,
    end: new Date(appointment.date.getTime() + appointment.duration * 60000), // Convertir la durée en millisecondes
    extendedProps: {
      notes: appointment.notes,
      status: appointment.status,
    },
  };
};

module.exports = { initCalendar, convertToCalendarEvent };