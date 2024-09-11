const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allArtImages = async (username) => {
    const user_id = await userId(username);

    return db("image")
        .select([
            "image.id",
            "image.url",
            "image.name",
            "image.creation_year",
            "image.price",
            "image.description",
            "size.width",
            "size.height",
        ])
        .distinct("image.id")
        .leftJoin("size", "image.size_id", "size.id")
        .leftJoin("opencall_image", "opencall_image.image_id", "image.id")
        .leftJoin("opencall", "opencall_image.opencall_id", "opencall.id")
        .select([
            "opencall_image.image_status",
            "opencall.name as opencall_name"
        ])
        .where("image.user_id", user_id)
        .orderBy("image.id");
};

const _listOpencallsForSubbmit = async (ids) => {  // /api/gallery/listopencalls?ids=ids
    const imageIds = ids.split(',');
    return db("opencall_image")
        .select("opencall_id")
        .whereIn("image_id", imageIds);
};

const _getArtImage = async (image_id) => {
    const id = image_id.split(",");
    return db("image")
        .whereIn("image.id", id)
        .join("size", "image.size_id", "size.id")
        .select("image.id", "image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
        .returning(["id", "url", "name", "creation_year", "price", "description", "width", "height"]);
};

const _getArtImagesIdsByOpencall = async (opencall_id) => {
    console.log("opencall id ", opencall_id);
    return db("opencall_image")
        .where("opencall_id", opencall_id)
        .select("image_id")
        .returning(["image_id"]);
};

const _getImageStatus = async (id) => {
    return db("opencall_image")
        .select("image_status")
        .where("image_id", id);
};

const _addArtImage = async (username, url, artImageInfo) => {   // add art image and info to table "image"
    const user_id = await userId(username);
    const { name, price, description, creation_year, width, height } = artImageInfo;
    let size_id = await db("size")
        .select("id")
        .where({ width, height });

    if (size_id.length === 0) size_id = await db("size").insert({ width, height }).returning(["id"]);

    return db("image")
        .insert({ url, name, price, description, creation_year, size_id: size_id[0].id, user_id })
        .returning(["id"]);
};

const _addArtImageToOpencall = async (opencall_id, image_id, image_status) => { // add image_id, opencall_id and status to table "opencall_image" with end-point /addimageopencall
    return db("opencall_image")
        .insert({ opencall_id, image_id, image_status });
};

const _deleteOpencallImage = async (opencall_id, image_id) => {
    try {
        const id = image_id.split(",");
        return db("opencall_image")
            .whereIn("image_id", id)
            .andWhere("opencall_id", opencall_id)
            .del()
            .returning(["image_id"]);
    } catch (error) {
        console.log(error);
    }
};

const _allArtInOpencalls = async (status, imageIds) => {
    try {
        const ids = imageIds.length > 1 ? imageIds.split(',') : [imageIds];
        const arrStatus = status.split(',');
        return db("opencall_image")
            .distinct("opencall_id")
            .whereIn("image_status", arrStatus)
            .whereIn("image_id", ids);
    } catch (error) {
        console.log(error);
    }

}

const _updateArtInfo = async (id, artInfo) => {
    try {
        const extractedProperties = {};
        for (const key in artInfo) {
            if (Object.hasOwnProperty.call(artInfo, key)) {
                if (key === "id" || key === "width" || key === "height") continue;
                extractedProperties[key] = artInfo[key];
            }
        };
        let size_id = await db("size")
            .select("id")
            .where({ "width": artInfo.width, "height": artInfo.height });

        if (size_id.length === 0) size_id = await db("size").insert({ "width": artInfo.width, "height": artInfo.height }).returning(["id"]);
        extractedProperties["size_id"] = size_id[0].id;
        console.log("extractedProperties", extractedProperties);

        return db("image")
            .where("id", id)
            .join("size", "image.size_id", "size.id")
            .update(extractedProperties);
    } catch (error) {
        console.log(error);
    }
};

// write endpoint for select art by max size artworcs:
/*
        let width, height, image_id;
        const sizeAndId = await db("opencall_image")
            .where("opencall_id", opencall_id)
            .join("opencall", "opencall_image.opencall_id", "opencall.id")
            .select("opencall.max_width", "opencall.max_height", "opencall_image.image_id", "opencall_image.status")
            .returning(["max_width", "max_height", "image_id", "status"]);

        width = sizeAndId[0].max_width;

        height = sizeAndId[0].max_height;

        image_id = sizeAndId.map(item => item.image_id);


*/

module.exports = {
    _addArtImage, _allArtImages, _getArtImage,
    _addArtImageToOpencall, _deleteOpencallImage,
    _updateArtInfo, _getArtImagesIdsByOpencall, _listOpencallsForSubbmit,
    _getImageStatus, _allArtInOpencalls
};