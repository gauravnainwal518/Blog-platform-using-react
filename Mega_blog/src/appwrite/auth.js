import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            console.error('Failed to create account:', error);
            throw new Error('Account creation failed. Please try again.');
        }
    }

    async login({email, password}) {
        try {
            // Debugging output
            console.log('Attempting to log in with:', {email, password});
            
            // Check if the method exists
            if (!this.account.createEmailPasswordSession) {
                throw new Error('createEmailSession method is not defined on the account object.');
            }
    
            // Attempt to create a session
            const session = await this.account.createEmailPasswordSession(email, password);
            
            // Additional logging
            console.log('Login successful:', session);
            
            return session;
        } catch (error) {
            // Detailed error handling
            console.error('Error during login:', error);
            throw new Error('Login failed. Please check your credentials and try again.');
        }
    }
    

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService

