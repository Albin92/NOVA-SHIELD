const router = require('express').Router();
const { generate, getAll } = require('../controllers/timetableController');
router.post('/generate', generate);
router.get('/',          getAll);
module.exports = router;
