const express = require('express');
const router = express.Router();
const loadingDispatchController = require('../controllers/loadingDispatchController');

// Get all dispatch records
router.get('/', loadingDispatchController.getAllDispatches);

// Create new dispatch record
router.post('/', loadingDispatchController.createDispatch);

// Update dispatch status
router.patch('/:id', loadingDispatchController.updateDispatch);

// Delete dispatch record
router.delete('/:id', loadingDispatchController.deleteDispatch);

module.exports = router;
