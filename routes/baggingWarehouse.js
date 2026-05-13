const express = require('express');
const router = express.Router();
const baggingWarehouseController = require('../controllers/baggingWarehouseController');

// Get all bagging entries
router.get('/', baggingWarehouseController.getAllEntries);

// Create new bagging entry
router.post('/', baggingWarehouseController.createEntry);

// Update bagging entry
router.patch('/:id', baggingWarehouseController.updateEntry);

// Delete bagging entry
router.delete('/:id', baggingWarehouseController.deleteEntry);

module.exports = router;
