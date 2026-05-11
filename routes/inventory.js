const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Get all inventory logs (variance/loss)
router.get('/logs', inventoryController.getAllLogs);

// Create new inventory log (variance/loss)
router.post('/logs', inventoryController.createLog);

// Trace Detail: Aggregate data across modules for a Batch ID
router.get('/trace/:batchId', inventoryController.getTraceDetail);

// Delete inventory log
router.delete('/logs/:id', inventoryController.deleteLog);

module.exports = router;
