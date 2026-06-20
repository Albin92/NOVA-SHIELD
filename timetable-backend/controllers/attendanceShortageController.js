exports.getAll = async (req, res) => {
  try {
    const db = req.app.get('db');
    // Fetch all 3 collections in parallel
    const [snapshot, facultySnap, subjectsSnap] = await Promise.all([
      db.collection('attendance_shortages').get(),
      db.collection('faculty').get(),
      db.collection('subjects').get()
    ]);

    const facultyMap = {};
    facultySnap.docs.forEach(doc => { facultyMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const subjectsMap = {};
    subjectsSnap.docs.forEach(doc => { subjectsMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const data = snapshot.docs.map(doc => {
      const short = { id: doc.id, ...doc.data() };
      return {
        ...short,
        faculty: facultyMap[short.faculty_id] || { name: short.faculty_id || 'Unknown Faculty' },
        subject: subjectsMap[short.subject_id] || { name: short.subject_id || 'Unknown Subject' }
      };
    });

    // Sort by createdAt descending
    data.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const db = req.app.get('db');
    const shortageData = {
      title: req.body.title,
      month: req.body.month || 'May',
      fileUrl: req.body.fileUrl || '',
      faculty_id: req.body.faculty_id,
      subject_id: req.body.subject_id,
      createdAt: req.body.createdAt || new Date().toISOString()
    };
    const ref = await db.collection('attendance_shortages').add(shortageData);
    res.status(201).json({ id: ref.id, ...shortageData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const db = req.app.get('db');
    await db.collection('attendance_shortages').doc(req.params.id).delete();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
