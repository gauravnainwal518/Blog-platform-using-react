import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Account, Query } from "appwrite";
import { addPost } from '../store/postSlice.js';

export class Service {
    client = new Client();
    account;  // Ensure account is initialized here
    databases;
    bucket;

    constructor() {
        // Initialize the client and set configuration
        this.client
            .setEndpoint(conf.appwriteUrl)  // Set your Appwrite API endpoint
            .setProject(conf.appwriteProjectId);  // Set your Appwrite Project ID

        this.account = new Account(this.client);  // Initialize the Account object
        this.databases = new Databases(this.client);  // Initialize Databases
        this.bucket = new Storage(this.client);  // Initialize Storage (for files)
    }

    // ✅ New Method: Fetch User Data (Get User Account)
    async getUserData() {
        try {
            return await this.account.get();  // Fetch user data from Appwrite
        } catch (error) {
            console.error("Appwrite service :: getUserData :: error", error);
            throw error;
        }
    }

    // Upload File
    async uploadFile(file) {
        try {
            console.log("Starting file upload...");
            const response = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            if (!response || !response.$id) {
                throw new Error("No file ID returned after upload.");
            }
            return response;
        } catch (error) {
            console.error("File upload error:", error);
            throw error;
        }
    }
// Create Post
// config.js
async createPost({ title, slug, content, featuredImageFile, status, userId }) {
    if (!title || !slug || !content || !status || !userId) {
        throw new Error("All fields are required to create a post.");
    }

    if (!featuredImageFile) {
        throw new Error("Featured image is required.");
    }

    try {
        const fileResponse = await this.uploadFile(featuredImageFile);
        if (!fileResponse || !fileResponse.$id) {
            throw new Error("File upload failed, no file ID returned.");
        }

        const featuredImage = fileResponse.$id;

        const postData = {
            title,
            slug,
            content,
            featuredImage,
            status,
            userId,
        };

        // Create the post in Appwrite
        const createdPost = await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            postData
        );

        return createdPost;

    } catch (error) {
        console.error("Appwrite service :: createPost :: error", error);
        throw error;
    }
}

    // Fetch posts by user
    async fetchUserPosts(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('userId', userId)
                ]
            );
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: fetchUserPosts :: error", error);
            throw error;
        }
    }

    // Get all posts
    async getAllPosts() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: getAllPosts :: error", error);
            throw error;
        }
    }

    // Get posts (alias for getAllPosts)
    async getPosts() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            throw error;
        }
    }

    // Get single post by slug
    async getPost(slug) {
        
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('slug', slug)
                ]
            );
            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", error);
            throw error;
        }
    }

    // Update post
    async updatePost(postId, updatedData) {
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,
                updatedData
            );
            return response;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }

    // Delete post
    async deletePost(postId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
            console.log("Post deleted successfully:", postId);
            return true;
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            const response = await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            console.log("File deleted successfully:", response);
            return response;
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }

    getFilePreview(fileId) {
        try {
            const response = this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
            console.log("File preview response:", response);
    
            if (response && response.href) {
                console.log("Preview URL:", response.href);
                return response.href;
            } else {
                console.error("No preview available for file:", fileId);
                return "/default_img.jpg";  // ✅ Correct fallback image path
            }
        } catch (error) {
            console.error("Error getting file preview:", error);
            return "/default_img.jpg";  // ✅ Correct fallback image path
        }
    }
    
    

    // ✅ New Method: Get Posts by User (wrapper)
    getPostsByUser(userId) {
        return this.fetchUserPosts(userId);
    }
}

const service = new Service();
export default service;
