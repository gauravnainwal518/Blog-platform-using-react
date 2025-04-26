import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Account, Query } from "appwrite";
import { addPost } from '../store/postSlice.js';

export class Service {
    client = new Client();
    account;
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getUserData() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getUserData :: error", error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            //console.log("Starting file upload...", file);

            if (!file || typeof file !== "object" || !file.size) {
                throw new Error("Invalid file object passed to uploadFile.");
            }

            const response = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );

            //console.log("File uploaded successfully:", response);
            return response;

        } catch (error) {
            console.error("File upload error:");
            console.dir(error);
            throw error;
        }
    }

    async createPost({ title, slug, content, featuredImageFile, status, userId }) {
        if (!title || !slug || !content || !status || !userId) {
            throw new Error("All fields are required to create a post.");
        }
    
        if (!featuredImageFile) {
            throw new Error("Featured image is required.");
        }
    
        try {
            const now = new Date().toISOString(); // ISO format for createdAt
    
            const postData = {
                title,
                slug,
                content,
                featuredImage: featuredImageFile,
                status,
                userId,
                createdAt: now,
                updatedAt: now,
            };
    
            console.log("Creating post with data:", postData);
    
            const createdPost = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                postData
            );
    
            console.log("Created post response:", createdPost);
    
            return createdPost;
    
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }
    
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

    async getPosts() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
            // Print the documents to see their structure
        console.log("Fetched Posts:", response.documents);
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            throw error;
        }
    }

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

    async updatePost(postId, updatedData) {
        try {
            const now = new Date().toISOString(); // Update timestamp
            const updatedPost = {
                ...updatedData,
                updatedAt: now,
            };

            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,
                updatedPost
            );
            return response;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }

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
            const url = this.bucket.getFileView(conf.appwriteBucketId, fileId);
            return url;
        } catch (error) {
            console.error("Error getting file view URL:", error);
            return "/default_img.jpg";
        }
    }

    getPostsByUser(userId) {
        return this.fetchUserPosts(userId);
    }
}

const service = new Service();
export default service;
