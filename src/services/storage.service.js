import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export const uploadProfilePhoto = async (uid, file) => {
    try {
        const fileRef = ref(storage, `profile_photos/${uid}/${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw new Error('Failed to upload profile photo.');
    }
};

export const uploadImage = async (file) => {
    try {
        const fileRef = ref(storage, `post_images/${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef); 
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image.');
    }
};