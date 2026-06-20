exports.getAll = async (req, res) => {
  try {
    const db = req.app.get('db');
    const [snapshot, facultySnap, subjectsSnap] = await Promise.all([
      db.collection('marksheets').get(),
      db.collection('faculty').get(),
      db.collection('subjects').get()
    ]);

    const facultyMap = {};
    facultySnap.docs.forEach(doc => { facultyMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const subjectsMap = {};
    subjectsSnap.docs.forEach(doc => { subjectsMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const data = snapshot.docs.map(doc => {
      const sheet = { id: doc.id, ...doc.data() };
      return {
        ...sheet,
        faculty: facultyMap[sheet.faculty_id] || { name: sheet.faculty_id || 'Unknown Faculty' },
        subject: subjectsMap[sheet.subject_id] || { name: sheet.subject_id || 'Unknown Subject' }
      };
    });

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
    const sheetData = {
      title: req.body.title,
      examType: req.body.examType || 'Internals 1',
      year: req.body.year || new Date().getFullYear().toString(),
      fileUrl: req.body.fileUrl || '',
      faculty_id: req.body.faculty_id,
      subject_id: req.body.subject_id,
      createdAt: req.body.createdAt || new Date().toISOString()
    };
    const ref = await db.collection('marksheets').add(sheetData);
    res.status(201).json({ id: ref.id, ...sheetData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const db = req.app.get('db');
    await db.collection('marksheets').doc(req.params.id).delete();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
