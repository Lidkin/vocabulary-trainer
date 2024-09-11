const { _addArtImage, _allArtImages, _getArtImage,
    _addArtImageToOpencall, _deleteOpencallImage,
    _updateArtInfo, _getArtImagesIdsByOpencall, _listOpencallsForSubbmit,
    _getImageStatus, _allArtInOpencalls } = require('../models/gallery.model.js');
const { S3Uploadv3 } = require('../s3Service.js');

const addArtImage = async (req, res) => {  // add art image and info to table "image"
    try {
        const username = req.user.username;
        const imageUrl = await S3Uploadv3(req.file, "arts");
        const row = await _addArtImage(username, imageUrl.Location, req.body);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const listOpencallsForSubbmit = async (req, res) => {  // /api/gallery/listopencalls?ids=imageIds
    try {
        const ids = req.query.ids;
        const row = await _listOpencallsForSubbmit(ids);
        console.log("list of opencalls:", row)
        const data = row.map(item => item.opencall_id);
        const opencallIds = Array.from(new Set(data));
        res.json(opencallIds);
    } catch (error) {
        console.log(error);
    }
}

const allArtImages = async (req, res) => {  // all images of user with role=artist
    try {
        const username = req.user.username;
        const rows = await _allArtImages(username);

        const imageMap = new Map();
        rows.forEach((row) => {
            const imageId = row.id;
            const imageStatus = row.image_status;
            const opencallName = row.opencallName;
            if (!imageMap.has(imageId)) {
                imageMap.set(imageId, {
                    ...row,
                    opencall_info: [],
                });
            }

            imageMap.get(imageId).opencall_info.push({
                image_status: row.image_status,
                opencall_name: row.opencall_name
            });
        });

        const result = Array.from(imageMap.values());
        res.json(result);
    } catch (error) {
        console.log(error);
    };
};

const getArtImage = async (req, res) => {
    try {
        const image_id = req.query.image_id;
        const row = await _getArtImage(image_id);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const addArtImageToOpencall = async (req, res) => {  // add image_id, opencall_id and status to table "opencall_image" with end-point /addimageopencall
    try {
        const opencall_id = req.body.opencall_id;
        const image_id = req.body.image_id;
        const image_status = req.query.status;
        const row = await _addArtImageToOpencall(opencall_id, image_id, image_status);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const deleteOpencallImage = async (req, res) => {
    try {
        const opencall_id = req.query.opencall_id;
        const image_id = req.query.image_id;
        const data = await _deleteOpencallImage(opencall_id, image_id)
        res.json(data);

    } catch (error) {
        console.log(error);
    }
};

const allArtInOpencalls = async (req, res) => {
    try {
        const imageIds = req.query.imageIds;
        const status = req.query.status;
        const row = await _allArtInOpencalls(status, imageIds);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
}

// const changeImageStatus = async (req, res) => {
// try {
// const { status, ids } = req.body;
// const data = await _changeImageStatus(status, ids);
// res.json(data);
// } catch (error) {
// console.log(error);
// }
// };

const updateArtInfo = async (req, res) => {
    try {
        const id = req.query.id;
        const artInfo = req.body;
        const data = await _updateArtInfo(id, artInfo);
        console.log("update return",data);
        res.json(data);
    } catch (error) {
        console.log(error);
    }
}

const getArtImagesIdsByOpencall = async (req, res) => {
    try {
        const opencall_id = req.query.opencall_id;
        const data = await _getArtImagesIdsByOpencall(opencall_id);
        console.log("image ids", data);
        res.json(data);
    } catch (error) {
        console.log(error);
    };
};

const getImageStatus = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await _getImageStatus(id);
        res.json(data);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    addArtImage, allArtImages, getArtImage,
    addArtImageToOpencall, deleteOpencallImage,
    updateArtInfo, getArtImagesIdsByOpencall, listOpencallsForSubbmit,
    getImageStatus, allArtInOpencalls
};