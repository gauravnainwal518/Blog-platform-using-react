import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage } from "appwrite";
import { Query } from 'appwrite';

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    /**
     * Uploads a file to the Appwrite bucket.
     * @param {File} file - The file object to be uploaded.
     * @returns {Promise<Object>} The file upload response.
     */
    async uploadFile(file) {
        try {
            console.log("Starting file upload...");
            console.log("Bucket ID:", conf.appwriteBucketId);
            console.log("File:", file);
    
            // Upload the file to the specified bucket
            const response = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
    
            console.log("File upload response:", response);
    
            // Extract the fileId from the response (Appwrite's response contains a unique ID for the file)
            const fileId = response.$id; // This is the fileId returned after upload
            console.log("Uploaded fileId:", fileId);
    
            // Return the fileId for future use (e.g., for preview or saving to the database)
            return fileId;
        } catch (error) {
            console.error("File upload error:", error);
            throw error;
        }
    }
    
    /**
     * Creates a new blog post with a featured image.
     * @param {Object} post - The post data.
     * @returns {Promise<Object>} The created post document.
     */
    async createPost({ title, slug, content, featuredImageFile, status, userId }) {
        if (!title || !slug || !content || !status || !userId) {
          throw new Error("All fields are required to create a post.");
        }
      
        if (!featuredImageFile) {
          throw new Error("Featured image is required.");
        }
      
        try {
          // Upload the featured image file first
          const fileResponse = await this.uploadFile(featuredImageFile);
          console.log("File upload response:", fileResponse);  // Log the response to check
      
          const featuredImage = fileResponse.$id;
          console.log("Featured image file ID:", featuredImage);  // Log the file ID
      
          // Prepare the data to send to the database
          const postData = {
            title,
            slug,
            content,
            featuredImage,  // Use the file ID
            status,
            userId,
          };
          console.log("Data sent to Appwrite:", postData);  // Log the data
      
          // Create the post document in the database
          return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            postData
          );
        } catch (error) {
          console.error("Appwrite service :: createPost :: error", error);
          throw error;
        }
      }
    
    
   

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
    }

    // New method to fetch all posts
async getAllPosts() {
    try {
        const response = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId
        );

        console.log("All Posts:", response); // Check the response
        return response.documents; // Return all posts
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

        console.log("All Posts:", response.documents); // Debugging
        return response.documents; // Return all posts
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
                Query.equal('slug', slug) // Assuming 'slug' is a field in your collection
            ]
        );
        console.log("Fetched documents:", response.documents); // Log the response
        return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
        console.error("Appwrite service :: getPost :: error", error);
        throw error;
    }
}


async updatePost(postId, updatedData) {
    try {
        const response = await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            postId,
            updatedData
        );
        return response; // Return the updated post data
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

async deletePost(postId) {
    try {
        // Delete the post document from the database
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

    
  

}    
const service = new Service();
export default service;
