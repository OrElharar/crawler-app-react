import Axios from "axios";
const API_DB_URL = "http://localhost:4000";


export const getNextDepthLvlFromDB = async (crawlerId) => {
    try {
        const res = await Axios.get(API_DB_URL + `/get-next-depth/${crawlerId}`);
        return res.data;
    } catch (err) {
        if (err.status === 404) {
            return {
                currentDepthTree: [],
                isCrawlingDone: false
            }
        }
        throw err
    }
};

export const postCrawerOnDB = async (reqBody) => {

    try {
        const res = await Axios.post(API_DB_URL + "/set-crawler", {
            data: { ...reqBody }

        });
        return res.data;
    } catch (err) {
        throw (err)
    }
};

// export const deleteImage = async (id, key) => {
//     try {
//         await Axios.delete(DB_URL + "/delete-image", {
//             data: { id, key }
//         })
//         return
//     } catch (err) {
//         console.log(err);
//     }
// }
