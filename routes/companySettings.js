const express = require('express');
const router = express.Router();
const companySettingsController = require('../controllers/companySettingsController');

// Get company settings
router.get('/', companySettingsController.getSettings);

// Update company settings
router.patch('/', companySettingsController.updateSettings);

module.exports = router;
