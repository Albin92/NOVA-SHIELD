require('dotenv').config(); // THIS MUST BE LINE 1
const express  = require('express');
const cors     = require('cors');
const admin    = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId:  process.env.FIREBASE_PROJECT_ID
});

const db  = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Make Firestore db accessible in all routes
app.set('db', db);

// Routes
app.use('/api/faculty',   require('./routes/faculty'));
app.use('/api/subjects',  require('./routes/subjects'));
app.use('/api/rooms',     require('./routes/rooms'));
app.use('/api/timeslots', require('./routes/timeslots'));
app.use('/api/timetable', require('./routes/timetable'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);