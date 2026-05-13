const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Client = require('./models/Client');
const YardIntake = require('./models/YardIntake');
const CrushingProcessing = require('./models/CrushingProcessing');
const AssayingTesting = require('./models/AssayingTesting');
const BaggingWarehouse = require('./models/BaggingWarehouse');
const LoadingDispatch = require('./models/LoadingDispatch');
const Weighbridge = require('./models/Weighbridge');
const Transporter = require('./models/Transporter');
const Quotation = require('./models/Quotation');
const Invoice = require('./models/Invoice');
const CompanySettings = require('./models/CompanySettings');

const seedAllData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Seed User
        let admin = await User.findOne({ email: 'admin@gme.com' });
        if (!admin) {
            admin = new User({
                name: 'System Admin',
                email: 'admin@gme.com',
                password: 'password123',
                role: 'Admin',
                department: 'Management',
                status: 'Active',
                initials: 'SA'
            });
            await admin.save();
        }
        const userId = admin._id;

        // 2. Seed Company Settings
        await CompanySettings.deleteMany({});
        await new CompanySettings({
            name: 'Global Material Exchange (GME)',
            address: '123 Mining Plaza, Sector 4, Industrial Area',
            rcNumber: 'RC-123456789',
            tin: 'TIN-987654321',
            phone: '+971 4 123 4567',
            email: 'info@gme-global.com',
            currency: 'AED',
            vatPercentage: 5,
            materialTypes: ['Iron Ore', 'Copper', 'Cobalt', 'Gold', 'Silver'],
            machines: ['Crusher Unit 1', 'Crusher Unit 2', 'Crusher Unit 3', 'Crusher Unit 4'],
            warehouses: ['Zone A-4', 'Zone B-2', 'Zone C-1', 'Main Storage'],
            salesPersons: ['Ahmed Al-Maktoum', 'John Smith', 'Sarah Chen'],
            inspectionTypes: ['Quality Check', 'Purity Test', 'Safety Audit'],
            laboratories: ['GME Internal Lab', 'Bureau Veritas', 'SGS'],
            destinations: ['Jebel Ali Port', 'Abu Dhabi Port', 'Mumbai Port', 'Antwerp Port']
        }).save();
        console.log('Company Settings seeded');

        // 3. Seed Clients
        await Client.deleteMany({});
        const clients = [
            { name: 'Emirates Steel', email: 'procurement@emiratessteel.ae', phone: '+971 2 555 1111', tin: 'TIN-UAE-001', address: 'Abu Dhabi Industrial City', industry: 'Construction', status: 'Active', primaryContact: 'Hassan Al-Saba', registrationDate: '2025-01-15', type: 'Customer', userId },
            { name: 'Global Logistics Corp', email: 'logistics@glc.com', phone: '+971 4 222 3333', tin: 'TIN-UAE-002', address: 'Jebel Ali Free Zone', industry: 'Logistics', status: 'Active', primaryContact: 'Mark Spencer', registrationDate: '2025-02-20', type: 'Supplier', userId },
            { name: 'Indus Refineries', email: 'info@indusref.com', phone: '+91 22 4444 5555', tin: 'TIN-IND-999', address: 'Mumbai Port Area', industry: 'Mining', status: 'Active', primaryContact: 'Rajesh Kumar', registrationDate: '2024-11-10', type: 'Both', userId }
        ];
        await Client.insertMany(clients);
        console.log('Clients seeded');

        // 4. Seed Yard Intake
        await YardIntake.deleteMany({});
        const intakes = [
            { supplierName: 'Northern Mining Group', vehicleNumber: 'DXB-A-12345', materialType: [{ name: 'Iron Ore', grossWeight: 45000, tareWeight: 15000, netWeight: 30000 }], grossWeight: 45000, tareWeight: 15000, netWeight: 30000, grnNumber: 'GRN-2026-001', status: 'Completed', customerName: 'Emirates Steel', userId },
            { supplierName: 'Copper Fields Inc', vehicleNumber: 'SHJ-B-98765', materialType: [{ name: 'Copper Concentrate', grossWeight: 32000, tareWeight: 12000, netWeight: 20000 }], grossWeight: 32000, tareWeight: 12000, netWeight: 20000, grnNumber: 'GRN-2026-002', status: 'Pending', customerName: 'Indus Refineries', userId },
            { supplierName: 'Zambia Mines', vehicleNumber: 'AD-C-54321', materialType: [{ name: 'Cobalt', grossWeight: 15000, tareWeight: 5000, netWeight: 10000 }], grossWeight: 15000, tareWeight: 5000, netWeight: 10000, grnNumber: 'GRN-2026-003', status: 'Paid', customerName: 'N/A', userId }
        ];
        await YardIntake.insertMany(intakes);
        console.log('Yard Intakes seeded');

        // 5. Seed Crushing Processing
        await CrushingProcessing.deleteMany({});
        const processing = [
            { batchId: 'BATCH-001', rawMaterial: ['Iron Ore'], inputQuantity: 30000, machineAssigned: 'Crusher Unit 4', outputGrade: 'High Grade (65% Fe)', outputQuantity: 28500, processingDate: new Date(), status: 'Completed', userId },
            { batchId: 'BATCH-002', rawMaterial: ['Copper Concentrate'], inputQuantity: 20000, machineAssigned: 'Crusher Unit 1', outputGrade: 'Grade A', outputQuantity: 19200, processingDate: new Date(), status: 'Processing', userId }
        ];
        await CrushingProcessing.insertMany(processing);
        console.log('Crushing Processing seeded');

        // 6. Seed Assaying & Testing
        await AssayingTesting.deleteMany({});
        const tests = [
            { sampleId: 'SAM-101', batchId: 'BATCH-001', testType: 'Purity Check', labName: 'GME Internal Lab', mineralType: ['Iron Ore'], purity: '65.2%', status: 'Completed', submittedDate: '2026-05-01', resultDate: '2026-05-02', userId },
            { sampleId: 'SAM-102', batchId: 'BATCH-002', testType: 'Quality Audit', labName: 'SGS', mineralType: ['Copper'], purity: '99.9%', status: 'Completed', submittedDate: '2026-05-05', resultDate: '2026-05-06', userId }
        ];
        await AssayingTesting.insertMany(tests);
        console.log('Assaying & Testing seeded');

        // 7. Seed Bagging & Warehouse
        await BaggingWarehouse.deleteMany({});
        const bagging = [
            { baggingId: 'BAG-001', batchId: 'BATCH-001', baggingDate: new Date().toISOString(), numberOfBags: 600, weightPerBag: 50, totalWeight: 30000, warehouseLocation: 'Zone A-4', status: 'Completed', userId },
            { baggingId: 'BAG-002', batchId: 'BATCH-003', baggingDate: new Date().toISOString(), numberOfBags: 400, weightPerBag: 25, totalWeight: 10000, warehouseLocation: 'Zone C-1', status: 'Pending', userId }
        ];
        await BaggingWarehouse.insertMany(bagging);
        console.log('Bagging & Warehouse seeded');

        // 8. Seed Loading & Dispatch
        await LoadingDispatch.deleteMany({});
        const dispatches = [
            { dispatchId: 'DISP-001', batchId: 'BATCH-001', containerNumber: 'MSCU1234567', loadingWeight: 28000, destination: 'Jebel Ali Port', dispatchDate: '2026-05-10', status: 'Dispatched', driverName: 'Abdul Kareem', contactNumber: '+971 50 111 2222', userId },
            { dispatchId: 'DISP-002', batchId: 'BATCH-002', containerNumber: 'MAEU9876543', loadingWeight: 19000, destination: 'Abu Dhabi Port', dispatchDate: '2026-05-11', status: 'Loaded', driverName: 'Suresh Kumar', contactNumber: '+971 55 333 4444', userId }
        ];
        await LoadingDispatch.insertMany(dispatches);
        console.log('Loading & Dispatch seeded');

        // 9. Seed Weighbridge
        await Weighbridge.deleteMany({});
        const weighbridge = [
            { vehicleNo: 'DXB-A-12345', type: 'Inbound', grossWeight: 45000, tareWeight: 15000, netWeight: 30000, status: 'Completed', supplierName: 'Northern Mining Group', dateTime: new Date().toISOString(), userId },
            { vehicleNo: 'SHJ-B-98765', type: 'Inbound', grossWeight: 32000, tareWeight: 12000, netWeight: 20000, status: 'In-Progress', supplierName: 'Copper Fields Inc', dateTime: new Date().toISOString(), userId }
        ];
        await Weighbridge.insertMany(weighbridge);
        console.log('Weighbridge seeded');

        // 10. Seed Transporters
        await Transporter.deleteMany({});
        const transporters = [
            { companyName: 'Swift Haulage LLC', contactPerson: 'Hamad Ali', phone: '+971 50 123 4567', email: 'hamad@swifthaul.ae', gstNumber: 'GST-DXB-001', userId },
            { companyName: 'Desert Kings Logistics', contactPerson: 'Omar Khan', phone: '+971 55 987 6543', email: 'info@desertkings.ae', gstNumber: 'GST-DXB-002', userId }
        ];
        await Transporter.insertMany(transporters);
        console.log('Transporters seeded');

        // 11. Seed Quotations
        await Quotation.deleteMany({});
        const quotations = [
            { quotationNo: 'QUO-2026-001', customerName: 'Emirates Steel', amount: 150000, status: 'Sent', dateTime: new Date().toISOString(), validUntil: new Date(Date.now() + 30*24*60*60*1000).toISOString(), subject: 'Supply of High Grade Iron Ore', lineItems: [{ description: 'Iron Ore High Grade', quantity: 100, rate: 1500, total: 150000 }], userId },
            { quotationNo: 'QUO-2026-002', customerName: 'Indus Refineries', amount: 85000, status: 'Draft', dateTime: new Date().toISOString(), validUntil: new Date(Date.now() + 15*24*60*60*1000).toISOString(), subject: 'Copper Concentrate Quote', lineItems: [{ description: 'Copper concentrate', quantity: 50, rate: 1700, total: 85000 }], userId }
        ];
        await Quotation.insertMany(quotations);
        console.log('Quotations seeded');

        // 12. Seed Invoices
        await Invoice.deleteMany({});
        const invoices = [
            { invoiceNo: 'INV-2026-001', customerName: 'Emirates Steel', amount: 150000, dateTime: new Date().toISOString(), status: 'Unpaid', userId },
            { invoiceNo: 'INV-2026-002', customerName: 'Indus Refineries', amount: 42000, dateTime: new Date().toISOString(), status: 'Paid', userId }
        ];
        await Invoice.insertMany(invoices);
        console.log('Invoices seeded');

        console.log('All data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedAllData();
