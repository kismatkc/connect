import { supabase } from "./database.js";
import { getAfterKeywordText } from "./utils.js";
export const uploadPicture = async (fileName, buffer) => {
    try {
        const bucketName = "posts_pictures";
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, buffer, {
            upsert: true,
            contentType: "image/*",
        });
        if (error)
            throw error;
        const { data: { publicUrl }, } = supabase.storage.from(bucketName).getPublicUrl(fileName); //the size is is th eonly modifier for the link so its better to append the size isntead of making additional cloumns in table
        return publicUrl;
    }
    catch (error) {
        console.log(error);
    }
};
export const deletePictures = async (url) => {
    try {
        const bucketName = "posts_pictures";
        const baseName = getAfterKeywordText(url, `${bucketName}/`);
        const fileName = `${baseName}`;
        const { data, error } = await supabase.storage
            .from(bucketName)
            .remove([fileName]);
        if (error)
            throw error;
        return data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
