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

    // Run CSP algorithm
    const result = runSolver(subjects, rooms, timeslots);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // Delete old timetable from Firestore
    const oldSnap = await db.collection('timetable').get();
    const deleteOps = oldSnap.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteOps);

    // Save new timetable to Firestore
    const saveOps = result.schedule.map(entry =>
      db.collection('timetable').add({
        ...entry,
        generated_at: new Date().toISOString()
      })
    );
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
