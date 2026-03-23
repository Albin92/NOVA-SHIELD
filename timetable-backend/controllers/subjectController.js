exports.getAll = async (req, res) => {
  try {
    const db       = req.app.get('db');
    const snapshot  = await db.collection('subjects').get();
    const subjects  = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Attach faculty name to each subject
    const facultySnap = await db.collection('faculty').get();
    const facultyMap  = {};
    facultySnap.docs.forEach(doc => { facultyMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const data = subjects.map(sub => ({
      ...sub,
      faculty_id: facultyMap[sub.faculty_id] || sub.faculty_id
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const db  = req.app.get('db');
    const ref = await db.collection('subjects').add(req.body);
    res.status(201).json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const db = req.app.get('db');
    await db.collection('subjects').doc(req.params.id).delete();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
