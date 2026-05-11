const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const exportDocumentationController = require('../controllers/exportDocumentationController');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.get('/', exportDocumentationController.getAllShipments);
router.post('/', exportDocumentationController.createShipment);
router.patch('/:id', exportDocumentationController.updateShipment);
router.post('/upload/:id/:docKey', upload.single('document'), exportDocumentationController.uploadDocument);
router.delete('/document/:id/:docKey', exportDocumentationController.deleteDocument);

module.exports = router;
