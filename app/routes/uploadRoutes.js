// image upload using multer and cloudinary

const express = require('express')
const router = express.Router()

const multer = require('multer')
const cloudinary = require('cloudinary').v2

// image upload function

const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFilter, limits: { fileSize: 1000000 }, folder: 'chatapp' });

cloudinary.config({
    cloud_name: "duhlawhvz",
    api_key: "172395347765175",
    api_secret: "3-0BiaCwb7gcN3n73pe_LNty-bs"
});


router.post('/', upload.single('file'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, { 
        folder: 'chatapp',
        quality: "auto:low",
    }, function(err, result) {
        if (err) {
            res.status(500).json({
                message: "Image uploaded failed!",
                data: {
                    error: err
                }
            });
            return res.redirect('back')
        }
        res.status(200).json({
            message: "Image uploaded successfully!",
            data: {
                width: result.width,
                height: result.height,
                format: result.format,
                resource_type: result.resource_type,
                url: result.url,
                secure_url: result.secure_url,
                original_filename: result.original_filename
            }
        });
    });
});

// video upload function

const videoFilter = function(req, file, cb) {
    // accept video files only
    if (!file.originalname.match(/\.(mp4|avi|wmv|mov|flv|3gp|mkv|webm)$/i)) {
        console.log(file.originalname)
        return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
}

const videoUpload = multer({ storage: storage, fileFilter: videoFilter, limits: { fileSize: 100000000 }, folder: 'chatapp' });

// video upload route

router.post('/video', videoUpload.single('file'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: 'chatapp',
        quality: "auto:low",
    }, function(err, result) {
        if (err) {
            res.status(500).json({
                message: "Video uploaded failed!",
                data: {
                    error: err
                }
            });
            return res.redirect('back')
        }
        res.status(200).json({
            message: "Video uploaded successfully!",
            data: {
                width: result.width,
                height: result.height,
                format: result.format,
                resource_type: result.resource_type,
                url: result.url,
                secure_url: result.secure_url,
                original_filename: result.original_filename
            }
        });
    });
});


module.exports = router;