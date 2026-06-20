exports.getAll = async (req, res) => {
  try {
    const db = req.app.get('db');
    // Fetch all 3 collections in parallel
    const [snapshot, facultySnap, subjectsSnap] = await Promise.all([
      db.collection('notes').get(),
      db.collection('faculty').get(),
      db.collection('subjects').get()
    ]);

    const facultyMap = {};
    facultySnap.docs.forEach(doc => { facultyMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const subjectsMap = {};
    subjectsSnap.docs.forEach(doc => { subjectsMap[doc.id] = { id: doc.id, ...doc.data() }; });

    const data = snapshot.docs.map(doc => {
      const note = { id: doc.id, ...doc.data() };
      return {
        ...note,
        faculty: facultyMap[note.faculty_id] || { name: note.faculty_id || 'Unknown Faculty' },
        subject: subjectsMap[note.subject_id] || { name: note.subject_id || 'Unknown Subject' }
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
    const noteData = {
      title: req.body.title,
      content: req.body.content,
      fileUrl: req.body.fileUrl || '',
      faculty_id: req.body.faculty_id,
      subject_id: req.body.subject_id,
      createdAt: req.body.createdAt || new Date().toISOString()
    };
    const ref = await db.collection('notes').add(noteData);
    res.status(201).json({ id: ref.id, ...noteData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const db = req.app.get('db');
    await db.collection('notes').doc(req.params.id).delete();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
