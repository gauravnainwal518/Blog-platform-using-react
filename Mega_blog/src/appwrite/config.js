import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Account, Query } from "appwrite";
import { addPost } from '../store/postSlice.js';
import { toast } from 'react-toastify';

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
            const userData = await this.account.get();
            toast.success('User data fetched successfully!');  
            return userData;
        } catch (error) {
            console.error("Appwrite service :: getUserData :: error", error);
            toast.error('Failed to fetch user data.'); 
        }
    }

    async uploadFile(file) {
        try {
            if (!file || typeof file !== "object" || !file.size) {
                throw new Error("Invalid file object passed to uploadFile.");
            }

            const response = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );

            toast.success('File uploaded successfully!'); 
            return response;
        } catch (error) {
            console.error("File upload error:", error);
            toast.error('Failed to upload file.'); 
            throw error;
        }
    }

    async createPost({ title, slug, content, featuredImageFile, status, userId }) {
        if (!title || !slug || !content || !status || !userId) {
            toast.error('All fields are required to create a post.'); 
            throw new Error("All fields are required to create a post.");
        }
    
        if (!featuredImageFile) {
            toast.error('Featured image is required.'); 
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
                likedBy: [] // Initialize likedBy as an empty array to track users who liked the post
            };
    
            const createdPost = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                postData
            );
    
            toast.success('Post created successfully!');  
            return createdPost;
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
            toast.error('Failed to create post.');  
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
            toast.success('Fetched user posts successfully!'); 
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: fetchUserPosts :: error", error);
            toast.error('Failed to fetch user posts.'); 
            throw error;
        }
    }

    async getAllPosts() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
            toast.success('Fetched all posts successfully!');  
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: getAllPosts :: error", error);
            toast.error('Failed to fetch all posts.');  
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
            toast.success('Fetched post successfully!');  
            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", error);
            toast.error('Failed to fetch post.');  
            throw error;
        }
    }

    async updatePost(postId, updatedData) {
        try {
            const now = new Date().toISOString(); 
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
            toast.success('Post updated successfully!');  
            return response;
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error('Failed to update post.');  
        }
    }

    async deletePost(postId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
            toast.success('Post deleted successfully!');  
            return true;
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error('Failed to delete post.');  
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            const response = await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            toast.success('File deleted successfully!');  
            return response;
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error('Failed to delete file.'); 
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
            toast.error('All fields are required to create a comment.');  
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
    
            toast.success('Comment created successfully!');  
            return response;
        } catch (error) {
            console.error("Appwrite service :: createComment :: error", error);
            toast.error('Failed to create comment.');  
            throw error;
        }
    }
    
    async fetchCommentsByArticleId(articleId) {
        if (!articleId) {
            toast.error('Article ID is required to fetch comments.');  
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
    
            toast.success('Fetched comments successfully!');  
            return response.documents;
        } catch (error) {
            console.error("Appwrite service :: fetchCommentsByArticleId :: error", error);
            toast.error('Failed to fetch comments.'); 
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
            toast.success('Comment deleted successfully!');  
            return true;
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error('Failed to delete comment.');  
            throw error;
        }
    }
    
    async updateComment(commentId, updatedContent) {
        const contentString = typeof updatedContent === 'string'
          ? updatedContent.trim() 
          : String(updatedContent).trim(); // Convert to string explicitly if it's not a string
      
        if (!contentString) {
          toast.error("Content cannot be empty!");  
          throw new Error("Content is required to update a comment.");
        }
      
        try {
          const updatedComment = { content: contentString };
      
          const response = await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCommentsCollectionId,
            commentId,
            updatedComment
          );
      
          toast.success('Comment updated successfully!');  
          return response;
        } catch (error) {
          console.error("Error updating comment:", error);
          toast.error('Failed to update comment.');  
          throw error;
        }
      }

    async likePost(postId, userId) {
        try {
            // Fetch the current post data
            const post = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
    
            if (post) {
                // Parse the likedBy array from the post data
                let likedByArray = post.likedBy || [];
    
                // Check if the user has already liked the post
                const userIndex = likedByArray.indexOf(userId);
    
                if (userIndex === -1) {
                    // User has not liked the post, add their userId to the likedBy array
                    likedByArray.push(userId);
                } else {
                    // User has already liked the post, remove their userId to unlike
                    likedByArray.splice(userIndex, 1);
                }
    
                // Update the post document with the new likedBy array
                const updatedPost = await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    postId,
                    { likedBy: likedByArray }
                );
    
                toast.success('Post liked/unliked successfully!');  
                return updatedPost;
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
            toast.error('Failed to like/unlike post.');  
            throw new Error('Unable to toggle like on the post.');
        }
    }
}

const service = new Service();
export default service;
