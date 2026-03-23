const router = require('express').Router();
const { getAll, create, remove } = require('../controllers/subjectController');
router.get('/',    getAll);
router.post('/',   create);
router.delete('/:id', remove);
module.exports = router;
