"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = void 0;
const handleFileUpload = (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file was uploaded.',
            });
            return;
        }
        const host = req.get('host');
        const protocol = req.protocol;
        const relativeUrl = `/uploads/${req.file.filename}`;
        const fullUrl = `${protocol}://${host}${relativeUrl}`;
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            fileUrl: fullUrl,
            relativeUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'File upload failed: ' + error.message,
        });
    }
};
exports.handleFileUpload = handleFileUpload;
