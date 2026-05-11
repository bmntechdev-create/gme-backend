const PDFDocument = require('pdfkit');
const path = require('path');

const generateQuotationPDF = async (quotation, settings) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            const logoPath = path.join(__dirname, '../public/gme_logo.png');

            // Header Background
            doc.rect(0, 0, 595, 220).fill('#203727');
            
            // Logo
            try {
                doc.image(logoPath, 50, 30, { height: 50 });
            } catch (error) {
                doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('GME', 50, 35);
            }

            // Company Name and Tagline
            doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text((settings?.name || 'GLOBAL MINERAL EXPORTS (GME)').toUpperCase(), 50, 95);
            doc.fontSize(10).font('Helvetica').text('Mineral Processing & Export Company', 50, 120);
            
            // Compliance Info
            doc.fontSize(9).text(`RC: ${settings?.rcNumber || '-'} | TIN Number: ${settings?.tin || '-'}`, 50, 140);

            // Contact Info
            doc.fontSize(8);
            doc.text(`${settings?.email || '-'}`, 50, 160);
            doc.text(`${settings?.phone || '-'}`, 50, 173);
            doc.text(`${settings?.address || '-'}`, 50, 186);

            // Document Type (Large Background Text)
            doc.fillColor('#FFFFFF').opacity(0.15).fontSize(38).font('Helvetica-Bold').text('QUOTATION', 300, 35, { width: 245, align: 'right' });
            doc.opacity(1);

            // Document Info
            doc.fontSize(10).font('Helvetica-Bold');
            doc.fillColor('#FFFFFF').text(`Quotation Number: ${quotation.quotationNo}`, 300, 95, { width: 245, align: 'right' });
            doc.font('Helvetica').fontSize(9);
            doc.text(`Date: ${new Date(quotation.dateTime).toLocaleDateString()}`, 300, 110, { width: 245, align: 'right' });
            if (quotation.validUntil) {
                doc.text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`, 300, 125, { width: 245, align: 'right' });
            }

            // Bill To
            const activeCurrency = quotation.currency || settings?.currency || 'AED';
            
            doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text('QUOTATION FOR:', 50, 240);
            doc.fontSize(14).text(quotation.customerName, 50, 260);

            if (quotation.subject) {
                doc.fontSize(10).font('Helvetica-Bold').text('Subject:', 50, 285);
                doc.font('Helvetica').text(quotation.subject, 100, 285);
            }

            if (quotation.salesPerson) {
                doc.fontSize(10).font('Helvetica-Bold').text('Sales Person:', 350, 285);
                doc.font('Helvetica').text(quotation.salesPerson, 420, 285);
            }

            // Table Header
            doc.rect(50, 320, 500, 20).fill('#203727');
            doc.fillColor('#FFFFFF').fontSize(10).text('Description', 60, 325);
            doc.text('Qty', 300, 325);
            doc.text('Rate', 380, 325);
            doc.text('Amount', 480, 325);

            // Table Rows
            let y = 350;
            doc.fillColor('#000000').font('Helvetica');
            quotation.lineItems.forEach(item => {
                doc.text(item.description, 60, y);
                doc.text(item.quantity.toString(), 300, y);
                doc.text(`${activeCurrency} ${item.rate.toLocaleString()}`, 380, y);
                doc.text(`${activeCurrency} ${item.total.toLocaleString()}`, 480, y);
                y += 20;
                doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeColor('#EEEEEE').stroke();
            });

            // Totals
            y += 20;
            doc.fontSize(11).text('Subtotal:', 350, y);
            doc.text(`${activeCurrency} ${(quotation.subtotal || quotation.amount).toLocaleString()}`, 480, y, { width: 80, align: 'right' });
            
            if (quotation.discountAmount > 0) {
                y += 20;
                doc.text('Discount:', 350, y);
                doc.text(`-${activeCurrency} ${quotation.discountAmount.toLocaleString()}`, 480, y, { width: 80, align: 'right' });
            }

            if (quotation.taxAmount > 0) {
                y += 20;
                doc.text('VAT:', 350, y);
                doc.text(`${activeCurrency} ${quotation.taxAmount.toLocaleString()}`, 480, y, { width: 80, align: 'right' });
            }

            y += 30;
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#203727').text('TOTAL AMOUNT:', 250, y);
            doc.text(`${activeCurrency} ${quotation.amount.toLocaleString()}`, 450, y, { width: 110, align: 'right' });

            if (quotation.notes) {
                y += 60;
                doc.fontSize(10).fillColor('#666666').font('Helvetica-Bold').text('Notes:', 50, y);
                doc.font('Helvetica').text(quotation.notes, 50, y + 15);
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateQuotationPDF };
