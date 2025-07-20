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
            const userData = await this.account.get();
            return userData;
        } catch (error) {
            console.error("Appwrite service :: getUserData :: error", error);
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

            return response;
        } catch (error) {
            console.error("File upload error:", error);
            throw error;
        }
    }

   async createPost({ title, slug, content, featuredImageFile, status, userId, author }) {
    if (!title || !slug || !content || !status || !userId || !author) {
        throw new Error("All fields including author are required to create a post.");
    }

    if (!featuredImageFile) {
        throw new Error("Featured image is required.");
    }

    try {
        const now = new Date().toISOString();

        const postData = {
            title,
            slug,
            content,
            featuredImage: featuredImageFile,
            status,
            userId,
            author, //  author added 
            createdAt: now,
            updatedAt: now,
            likedBy: []
        };

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


    async fetchUserPosts(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc("updatedAt")
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
            return response;
        } catch (error) {
            console.error("Error updating post:", error);
        }
    }

    async deletePost(postId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
            return true;
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            const response = await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
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
            return true;
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
    
    async updateComment(commentId, updatedContent) {
        const contentString = typeof updatedContent === 'string'
          ? updatedContent.trim() 
          : String(updatedContent).trim();
      
        if (!contentString) {
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
      
          return response;
        } catch (error) {
          console.error("Error updating comment:", error);
          throw error;
        }
      }

    async likePost(postId, userId) {
        try {
            const post = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
    
            if (post) {
                let likedByArray = post.likedBy || [];
                const userIndex = likedByArray.indexOf(userId);

                if (userIndex === -1) {
                    likedByArray.push(userId);
                } else {
                    likedByArray.splice(userIndex, 1);
                }

                const updatedPost = await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    postId,
                    { likedBy: likedByArray }
                );

                return updatedPost;
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
            throw new Error('Unable to toggle like on the post.');
        }
    }
}

const service = new Service();
export default service;
