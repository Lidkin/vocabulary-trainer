const { addArtImage, allArtImages, getArtImage,
    addArtImageToOpencall, deleteOpencallImage,
    updateArtInfo, getArtImagesIdsByOpencall, listOpencallsForSubbmit,
    getImageStatus, allArtInOpencalls } = require('../controllers/gallery.controller.js');
const { verifyToken } = require('../middlewares/verify.token.js');
const express = require('express');
const gRouter = express.Router();

const multer = require('multer');
const uuid = require('uuid').v4;

const storage = multer.memoryStorage({
    destination: (req, file, cb) => { cb(null, '../uploads') },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => file.mimetype.split("/")[0] === "image" ? cb(null, true) : cb(new Error("file is not a image"), false);

const upload = multer({ storage, fileFilter, limits: { fileSize: 2000000 } });

gRouter.post('/addimage', verifyToken, upload.single("file"), addArtImage);  // add art image and info to table "image"
gRouter.post('/addimageopencall', verifyToken, addArtImageToOpencall); // add image_id, opencall_id and status to table "opencall_image"
gRouter.get('/allimages', verifyToken, allArtImages);  // all images of user with role=artist
gRouter.get('/byid', verifyToken, getArtImage);
gRouter.delete('/delete', verifyToken, deleteOpencallImage);
gRouter.get('/status', getImageStatus);  // get status of art image from table "opencall_image"  with /api/gallery/status
gRouter.patch('/update', verifyToken, updateArtInfo);
gRouter.get('/getids', verifyToken, getArtImagesIdsByOpencall);  
gRouter.get('/listopencalls', listOpencallsForSubbmit);  // /api/gallery/listopencalls?ids=imageIds
gRouter.get('/artinopencall', allArtInOpencalls); //  /api/gallery/artinopencall?imageIds=..&status=..

module.exports = { gRouter };
