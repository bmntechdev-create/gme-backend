const YardIntake = require('../models/YardIntake');
const CrushingProcessing = require('../models/CrushingProcessing');
const LoadingDispatch = require('../models/LoadingDispatch');
const Invoice = require('../models/Invoice');
const InventoryLog = require('../models/InventoryLog');
const ExportDocumentation = require('../models/ExportDocumentation');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Stats
        const totalIntake = await YardIntake.aggregate([
            { $group: { _id: null, total: { $sum: "$netWeight" } } }
        ]);

        const totalProcessing = await CrushingProcessing.aggregate([
            { $group: { _id: null, total: { $sum: "$outputQuantity" } } }
        ]);

        const activeShipments = await LoadingDispatch.countDocuments({ status: { $in: ['Loaded', 'Dispatched'] } });

        const pendingReceivables = await Invoice.aggregate([
            { $match: { status: 'Unpaid' } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        const totalRevenue = await Invoice.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const inventoryStock = await InventoryLog.aggregate([
             { $group: { _id: null, total: { $sum: "$outputQty" } } }
        ]);

        // 2. Recent Activities (Fetch latest 2 from each major category)
        const recentIntakes = await YardIntake.find().sort({ createdAt: -1 }).limit(2);
        const recentProcessing = await CrushingProcessing.find().sort({ createdAt: -1 }).limit(2);
        const recentDispatches = await LoadingDispatch.find().sort({ createdAt: -1 }).limit(2);

        const activities = [
            ...recentIntakes.map(item => ({
                type: 'Intake Recorded',
                reference: item.grnNumber,
                description: `from ${item.supplierName}`,
                timestamp: item.createdAt,
                status: item.status
            })),
            ...recentProcessing.map(item => ({
                type: 'Processing Started',
                reference: item.batchId,
                description: `${item.inputQuantity} kg of ${item.rawMaterial.join(', ')}`,
                timestamp: item.createdAt,
                status: item.status
            })),
            ...recentDispatches.map(item => ({
                type: 'Dispatch',
                reference: item.dispatchId,
                description: `to ${item.destination}`,
                timestamp: item.createdAt,
                status: item.status
            }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

        // 3. Trends (Last 6 months)
        const months = [];
        const intakeTrend = [];
        const processingTrend = [];
        const revenueTrend = [];
        const costTrend = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });
            months.push(monthName);

            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            // Intake Trend
            const monthIntake = await YardIntake.aggregate([
                { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: "$netWeight" } } }
            ]);
            intakeTrend.push((monthIntake[0]?.total || 0) / 1000);

            // Processing Trend
            const monthProcessing = await CrushingProcessing.aggregate([
                { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: "$outputQuantity" } } }
            ]);
            processingTrend.push((monthProcessing[0]?.total || 0) / 1000);

            // Revenue Trend
            const monthRevenue = await Invoice.aggregate([
                { $match: { status: 'Paid', createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            revenueTrend.push(monthRevenue[0]?.total || 0);

            // Cost Trend (Approximated or tracked elsewhere, for now using 70% of revenue as dummy cost if not tracked)
            // If you have a Cost model, use that.
            const monthCost = await Invoice.aggregate([
                { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            costTrend.push((monthCost[0]?.total || 0) * 0.6); // Placeholder logic for cost if no separate model
        }

        const exportTrend = processingTrend.map(v => v * 0.8); // Placeholder for export trend

        res.json({
            stats: {
                intakeVolume: (totalIntake[0]?.total || 0) / 1000,
                processingVolume: (totalProcessing[0]?.total || 0) / 1000,
                activeShipments,
                pendingReceivables: pendingReceivables[0]?.total || 0,
                pendingCount: pendingReceivables[0]?.count || 0,
                totalRevenue: totalRevenue[0]?.total || 0,
                inventoryStock: (inventoryStock[0]?.total || 0) / 1000
            },
            activities,
            trends: {
                months,
                throughput: { intake: intakeTrend, processing: processingTrend, export: exportTrend },
                revenueVsCost: { revenue: revenueTrend, cost: costTrend }
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
