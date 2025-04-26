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


    async createComment({ content, articleId, userId }) {
        if (!content || !articleId || !userId) {
            throw new Error("All fields are required to create a comment.");
        }
    
        try {
            const now = new Date().toISOString();
    
            const commentData = {
                content,
                articleId,
                userId,
                createdAt: now,
            };
    
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                ID.unique(),
                commentData
            );
    
            console.log("Created comment:", response);
            return response;
        } catch (error) {
            console.error("Appwrite service :: createComment :: error", error);
            throw error;
        }
    }
    
    async fetchCommentsByArticleId(articleId) {
        if (!articleId) {
            throw new Error("Article ID is required to fetch comments.");
        }
    
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                [
                    Query.equal('articleId', articleId)
                ]
            );
    
            console.log("Fetched comments:", response.documents);
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: fetchCommentsByArticleId :: error", error);
            throw error;
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                commentId
            );
            console.log("Comment deleted successfully:", commentId);
            return true;
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
    
    async updateComment(commentId, updatedContent) {
        // Ensure updatedContent is a string before passing it to the database
        const contentString = typeof updatedContent === 'string'
          ? updatedContent.trim() 
          : String(updatedContent).trim(); // Convert to string explicitly if it's not a string
      
        console.log("Updating comment content (Appwrite):", contentString); // Log content
      
        if (!contentString) {
          alert("Content cannot be empty!");
          throw new Error("Content is required to update a comment.");
        }
      
        if (contentString.length > 255) {
          alert("Content must be less than 255 characters!");
          throw new Error("Content too long.");
        }
      
        try {
          const updatedComment = { content: contentString };
      
          const response = await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCommentsCollectionId,
            commentId,
            updatedComment
          );
      
          console.log("Updated comment:", response);
          return response;
        } catch (error) {
          console.error("Error updating comment:", error);
          throw error;
        }
      }
      
}    

const service = new Service();
export default service;
