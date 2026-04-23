const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./database/db'); // Initialize DB
const chatRoutes = require('./routes/chat');
const mockDB = require('./data/mockDB.json');

const app = express();
app.use(cors());
app.use(express.json());

// Expose uploads directory statically if needed
app.use('/uploads', express.static('uploads'));

app.use('/api/chat', chatRoutes);

app.get('/api/student/info', (req, res) => {
  res.json(mockDB.student);
});

// We keep the mock calendar but merge it with dynamic reminders
app.get('/api/calendar', (req, res) => {
  db.all("SELECT * FROM reminders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.json(mockDB.calendar);
    }
    const dynamicReminders = rows.map(r => ({
      title: `[Reminder] ${r.title}`,
      date: r.time,
      isReminder: true
    }));
    res.json([...mockDB.calendar, ...dynamicReminders]);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
