const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Get all invoices
router.get('/', invoiceController.getAllInvoices);

// Create new invoice
router.post('/', invoiceController.createInvoice);

// Update invoice status
router.patch('/:id', invoiceController.updateInvoice);

module.exports = router;
