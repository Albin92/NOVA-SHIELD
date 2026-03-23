exports.getAll = async (req, res) => {
  try {
    const db       = req.app.get('db');
    const snapshot  = await db.collection('timeslots').get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const db  = req.app.get('db');
    const ref = await db.collection('timeslots').add(req.body);
    res.status(201).json({ id: ref.id, ...req.body });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const db = req.app.get('db');
    await db.collection('timeslots').doc(req.params.id).delete();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
