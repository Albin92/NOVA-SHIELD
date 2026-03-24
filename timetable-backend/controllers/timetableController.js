const { runSolver } = require('../algorithm/solver');

exports.generate = async (req, res) => {
  try {
    const db = req.app.get('db');

    // Fetch all data from Firestore
    const [subSnap, facSnap, roomSnap, slotSnap] = await Promise.all([
      db.collection('subjects').get(),
      db.collection('faculty').get(),
      db.collection('rooms').get(),
      db.collection('timeslots').get()
    ]);

    // Build lookup maps
    const facultyMap = {};
    facSnap.docs.forEach(doc => { facultyMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const subjects  = subSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      faculty_id: facultyMap[doc.data().faculty_id] || { id: doc.data().faculty_id }
    }));
    const rooms     = roomSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const timeslots = slotSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const expandedSubjects = [];
    subjects.forEach(sub => {
      const hours = parseInt(sub.hours_per_week, 10) || 1;
      for (let i = 0; i < hours; i++) {
        // give each instance a unique ID string to avoid key collisions later if needed
        expandedSubjects.push({ ...sub, instanceId: `${sub.id}-${i}` });
      }
    });

    // Run CSP algorithm
    const result = runSolver(expandedSubjects, rooms, timeslots);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // Delete old timetable from Firestore
    const oldSnap = await db.collection('timetable').get();
    const deleteOps = oldSnap.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteOps);

    // Save new timetable to Firestore
    const saveOps = result.schedule.map(entry => {
      const cleanEntry = {
        ...entry,
        generated_at: new Date().toISOString()
      };
      // Firestore does not accept undefined values
      Object.keys(cleanEntry).forEach(key => {
        if (cleanEntry[key] === undefined) {
          cleanEntry[key] = null;
        }
      });
      return db.collection('timetable').add(cleanEntry);
    });
    await Promise.all(saveOps);

    res.json({ message: 'Timetable generated', schedule: result.schedule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const db       = req.app.get('db');
    const snapshot  = await db.collection('timetable').get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearTimetable = async (req, res) => {
  try {
    const db = req.app.get('db');
    const oldSnap = await db.collection('timetable').get();
    const deleteOps = oldSnap.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteOps);
    res.json({ message: 'Timetable cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetAll = async (req, res) => {
  try {
    const db = req.app.get('db');
    const collections = ['timetable', 'faculty', 'subjects', 'rooms', 'timeslots'];
    for (const coll of collections) {
      const snap = await db.collection(coll).get();
      const deleteOps = snap.docs.map(doc => doc.ref.delete());
      await Promise.all(deleteOps);
    }
    res.json({ message: 'All data reset' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
