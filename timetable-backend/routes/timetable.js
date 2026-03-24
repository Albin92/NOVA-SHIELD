const router = require('express').Router();
const { generate, getAll, clearTimetable, resetAll } = require('../controllers/timetableController');
router.post('/generate', generate);
router.get('/',          getAll);
router.delete('/clear',clearTimetable);
router.delete('/reset',resetAll);
module.exports = router;
