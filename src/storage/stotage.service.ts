import { Injectable } from '@nestjs/common';

import {bucket} from '../firebase';

@Injectable()
export class StorageService {
    async storefile(file){
        return new Promise( (resolve,reject) => {
            try {
                const {originalname,buffer} = file;
                const blob = bucket.file(originalname);
                const blobSteam = blob.createWriteStream({
                    resumable : false
                })
                    .on('finish', () => {
                        
                        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;   
                        console.log(publicUrl);
                        resolve(publicUrl)
                    })
        
                    .on('error', () => {
                        reject(`Unable to upload image, something went wrong`)
                    })
        
                    .end(buffer);
                }
            catch(err) {
                reject(err.message)
            }
        } ) 
    }

}