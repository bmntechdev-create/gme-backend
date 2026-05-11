const express = require('express');
const router = express.Router();
const weighbridgeController = require('../controllers/weighbridgeController');

// Get all weighbridge logs
router.get('/', weighbridgeController.getAllLogs);

// Create new weighbridge log (Inbound or Outbound)
router.post('/', weighbridgeController.createLog);

module.exports = router;
