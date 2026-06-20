const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const admin    = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

dotenv.config();

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

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/faculty',   require('./routes/faculty'));
app.use('/api/subjects',  require('./routes/subjects'));
app.use('/api/rooms',     require('./routes/rooms'));
app.use('/api/timeslots', require('./routes/timeslots'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/notes',           require('./routes/notes'));
app.use('/api/question-papers', require('./routes/questionPapers'));
app.use('/api/marksheets',           require('./routes/marksheets'));
app.use('/api/attendance-shortages', require('./routes/attendanceShortages'));

// Global error handler — prevents uncaught errors from crashing the process
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
