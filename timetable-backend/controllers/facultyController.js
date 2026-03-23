const fs = require('fs');
const path = require('path');

// This points to a local file that will act as our database
const dbFilePath = path.join(__dirname, '../localDB.json');

// Helper to ensure the database file exists
const initDB = () => {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({ faculty: [], subjects: [], rooms: [], timeslots: [], timetable: null }));
  }
};

const readDB = () => JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

exports.getAll = async (req, res) => {
  try {
    initDB();
    const db = readDB();
    res.json(db.faculty || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    initDB();
    const db = readDB();
    // We use Date.now() to generate a unique ID, just like Firestore does
    const newItem = { id: Date.now().toString(), ...req.body }; 
    
    if (!db.faculty) db.faculty = [];
    db.faculty.push(newItem);
    writeDB(db);
    
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    initDB();
    const db = readDB();
    db.faculty = db.faculty.filter(item => item.id !== req.params.id);
    writeDB(db);
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};