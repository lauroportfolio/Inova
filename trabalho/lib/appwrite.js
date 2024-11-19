import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: process.env.APPWRITE_ENDPOINT,
    platform: process.env.APPWRITE_PLATFORM,
    projectId: process.env.APPWRITE_PROJECT_ID,
    databaseId: process.env.APPWRITE_DATABASE_ID,
    userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID,
    postCollectionId: process.env.APPWRITE_POST_COLLECTION_ID,
    storageId: process.env.APPWRITE_STORAGE_ID,
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    postCollectionId,
    storageId,
} = config

// react-native SDK na BETA para TESTE
const client = new Client();

client
    .setEndpoint(config.endpoint) // Endpoint do Appwrite
    .setProject(config.projectId) // Project ID
    .setPlatform(config.platform) // Bundle ID

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    // Registrar usuário
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            postCollectionId
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            postCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            postCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if(type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Tipo invalido de arquivo')
        }

        if(!fileUrl) throw Error;

        return fileUrl

    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(
            databaseId, postCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error)
    }
}