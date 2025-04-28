import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";
import { Databases, Query } from "appwrite"; // import for fetching posts

export class AuthService {
    client = new Client();
    account;
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error('Failed to create account:', error);
            throw new Error('Account creation failed. Please try again.');
        }
    }

    async login({ email, password }) {
        try {
            console.log('Attempting to log in with:', { email, password });
    
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log('Login successful:', session);
    
            // Step 3: get user info
            const user = await this.getCurrentUser();
    
            // Ensure only the posts belonging to the logged-in user are returned
            const posts = await this.getUserPosts(user.$id);
    
            // Return both user and posts
            return {
                user,
                posts
            };
        } catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed. Please check your credentials and try again.');
        }
    }
    
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }

    // ✅ New method to get posts by user
    async getUserPosts(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("userId", userId)] // Ensure filtering by the logged-in user's ID
            );
            return response.documents;
        } catch (error) {
            console.log("Error fetching user posts:", error);
            return [];
        }
    }
    
}

const authService = new AuthService();

export default authService;