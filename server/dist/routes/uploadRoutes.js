"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_js_1 = require("../controllers/uploadController.js");
const upload_js_1 = require("../middleware/upload.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Middleware to catch multer file format/size errors gracefully
const uploadMiddleware = (req, res, next) => {
    upload_js_1.upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error',
            });
        }
        next();
    });
};
router.post('/', auth_js_1.authenticateAdmin, uploadMiddleware, uploadController_js_1.handleFileUpload);
exports.default = router;
