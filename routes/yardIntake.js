const express = require('express');
const router = express.Router();
const yardIntakeController = require('../controllers/yardIntakeController');

// Get all Yard Intake records
router.get('/', yardIntakeController.getAllIntakes);

// Create new Yard Intake record
router.post('/', yardIntakeController.createIntake);

// Update Yard Intake record
router.patch('/:id', yardIntakeController.updateIntake);

// Delete Yard Intake record
router.delete('/:id', yardIntakeController.deleteIntake);

module.exports = router;
