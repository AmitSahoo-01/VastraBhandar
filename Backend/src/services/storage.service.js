import imageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new imageKit({
    privateKey:config.IMAGEKIT_PRIVATE_KEY,
});


export async function uploadFile({buffer,filename,folder="VB"}){
    const result = await client.files.upload({
        file:await imageKit.toFile(buffer),
        fileName,
        folder,
    });
    return result;
}