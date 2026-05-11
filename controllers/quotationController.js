const Quotation = require('../models/Quotation');

// @desc    Get all quotations
// @route   GET /api/quotations
// @access  Private
exports.getAllQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().sort({ createdAt: -1 });
        res.json(quotations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new quotation
// @route   POST /api/quotations
// @access  Private
exports.createQuotation = async (req, res) => {
    try {
        const {
            quotationNo,
            customerName,
            amount,
            dateTime,
            validUntil,
            status,
            items,
            subtotal,
            taxAmount,
            discountAmount,
            notes,
            currency,
            subject,
            salesPerson
        } = req.body;

        const userId = req.user.userId;

        // Robust mapping for line items
        const formattedItems = (items || []).map(item => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate || item.unitPrice,
            total: item.total || (item.quantity * (item.rate || item.unitPrice))
        }));

        const quotation = new Quotation({
            quotationNo,
            customerName,
            amount,
            dateTime: dateTime || new Date().toISOString(),
            validUntil,
            status: status || 'Draft',
            lineItems: formattedItems,
            subtotal,
            taxAmount,
            discountAmount,
            notes,
            currency,
            subject,
            salesPerson,
            userId
        });

        await quotation.save();
        res.status(201).json(quotation);
    } catch (error) {
        console.error('Error in createQuotation:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            details: error.errors
        });
    }
};

// @desc    Update quotation
// @route   PATCH /api/quotations/:id
// @access  Private
exports.updateQuotation = async (req, res) => {
    try {
        const { status, customerName, amount, items, subtotal, taxAmount, discountAmount, notes, validUntil, currency, subject, salesPerson } = req.body;
        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        if (status) quotation.status = status;
        if (customerName) quotation.customerName = customerName;
        if (amount) quotation.amount = amount;
        if (items) quotation.lineItems = items;
        if (subtotal) quotation.subtotal = subtotal;
        if (taxAmount !== undefined) quotation.taxAmount = taxAmount;
        if (discountAmount !== undefined) quotation.discountAmount = discountAmount;
        if (notes) quotation.notes = notes;
        if (validUntil) quotation.validUntil = validUntil;
        if (currency) quotation.currency = currency;
        if (subject !== undefined) quotation.subject = subject;
        if (salesPerson !== undefined) quotation.salesPerson = salesPerson;

        await quotation.save();
        res.json(quotation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Download quotation PDF
// @route   GET /api/quotations/:id/download
// @access  Private
exports.downloadQuotationPDF = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        const CompanySettings = require('../models/CompanySettings');
        const settings = await CompanySettings.findOne();

        const { generateQuotationPDF } = require('../utils/pdf');
        const pdfBuffer = await generateQuotationPDF(quotation, settings);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Quotation_${quotation.quotationNo}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Send quotation via email
// @route   POST /api/quotations/:id/send-email
// @access  Private
exports.sendQuotationEmail = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        const { customTo, customSubject, customBody } = req.body;

        const Client = require('../models/Client');
        const client = await Client.findOne({ name: quotation.customerName });
        
        const recipientEmail = customTo || client?.email;
        if (!recipientEmail) {
            return res.status(400).json({ message: 'Recipient email not found. Please provide an email address.' });
        }

        const CompanySettings = require('../models/CompanySettings');
        const settings = await CompanySettings.findOne();

        const { generateQuotationPDF } = require('../utils/pdf');
        const pdfBuffer = await generateQuotationPDF(quotation, settings);

        const { sendEmailWithAttachment } = require('../utils/email');
        
        const subject = customSubject || quotation.subject || `Quotation ${quotation.quotationNo} from ${settings?.name || 'GME'}`;
        const text = customBody || `Dear ${quotation.customerName},\n\nPlease find attached the quotation ${quotation.quotationNo} as requested.\n\nBest regards,\n${settings?.name || 'GME Team'}`;
        const html = customBody ? `<div style="font-family: Arial, sans-serif; white-space: pre-wrap;">${customBody}</div>` : `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #203727;">Quotation: ${quotation.quotationNo}</h2>
                <p>Dear <strong>${quotation.customerName}</strong>,</p>
                <p>Please find attached the quotation as requested.</p>
                <p><strong>Quotation Details:</strong></p>
                <ul>
                    <li><strong>Number:</strong> ${quotation.quotationNo}</li>
                    <li><strong>Date:</strong> ${new Date(quotation.dateTime).toLocaleDateString()}</li>
                    <li><strong>Total Amount:</strong> ${quotation.currency || 'AED'} ${quotation.amount.toLocaleString()}</li>
                </ul>
                <p>If you have any questions, feel free to contact us.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>${settings?.name || 'GME Team'}</strong></p>
            </div>
        `;

        await sendEmailWithAttachment({
            to: recipientEmail,
            subject: subject,
            text: text,
            html: html,
            attachments: [
                {
                    filename: `Quotation_${quotation.quotationNo}.pdf`,
                    content: pdfBuffer
                }
            ]
        });

        res.json({ message: 'Quotation email sent successfully to ' + recipientEmail });
    } catch (error) {
        console.error('Email Sending Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete quotation
// @route   DELETE /api/quotations/:id
// @access  Private
exports.deleteQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findByIdAndDelete(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }
        res.json({ message: 'Quotation deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = exports;
