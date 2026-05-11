const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// Get all quotations
router.get('/', quotationController.getAllQuotations);

// Create new quotation
router.post('/', quotationController.createQuotation);

// Update quotation
router.patch('/:id', quotationController.updateQuotation);

// Download PDF
router.get('/:id/download', quotationController.downloadQuotationPDF);

// Send Email
router.post('/:id/send-email', quotationController.sendQuotationEmail);

// Delete quotation
router.delete('/:id', quotationController.deleteQuotation);

module.exports = router;
