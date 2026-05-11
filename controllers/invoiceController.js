const Invoice = require('../models/Invoice');
const CompanySettings = require('../models/CompanySettings');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
exports.getAllInvoices = async (req, res) => {
    try {
        const [invoices, settings] = await Promise.all([
            Invoice.find().sort({ createdAt: -1 }),
            CompanySettings.findOne()
        ]);
        const companyCurrency = settings?.currency || 'USD';

        // For invoices that have the old bad default 'USD' and no quotationId,
        // replace with company currency so they display correctly.
        const mapped = invoices.map(inv => {
            const obj = inv.toObject();
            const wasDefaultUSD = obj.currency === 'USD' && !obj.quotationId;
            return {
                ...obj,
                currency: wasDefaultUSD ? companyCurrency : (obj.currency || companyCurrency)
            };
        });

        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
    try {
        const {
            invoiceNo,
            customerName,
            shipmentId,
            amount,
            dateTime,
            date,
            status,
            items,
            subtotal,
            taxAmount,
            discountAmount,
            currency
        } = req.body;

        const userId = req.user.userId;

        // Robust mapping for line items
        const formattedItems = (items || []).map(item => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate || item.unitPrice,
            total: item.total || (item.quantity * (item.rate || item.unitPrice))
        }));

        const invoice = new Invoice({
            invoiceNo,
            customerName,
            shipmentId,
            quotationId: req.body.quotationId,
            currency,
            amount,
            dateTime: dateTime || date || new Date().toISOString(),
            status,
            lineItems: formattedItems,
            subtotal,
            taxAmount,
            discountAmount,
            userId
        });

        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error in createInvoice:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            details: error.errors
        });
    }
};

// @desc    Update invoice status
// @route   PATCH /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
    try {
        const { status, customerName, amount, items, subtotal, taxAmount, discountAmount } = req.body;
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (status) invoice.status = status;
        if (customerName) invoice.customerName = customerName;
        if (amount) invoice.amount = amount;
        if (items) invoice.lineItems = items;
        if (subtotal) invoice.subtotal = subtotal;
        if (taxAmount !== undefined) invoice.taxAmount = taxAmount;
        if (discountAmount !== undefined) invoice.discountAmount = discountAmount;

        await invoice.save();
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
