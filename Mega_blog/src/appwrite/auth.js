import conf from '../conf/conf.js';
import { Client, Account, ID, Databases, Query } from "appwrite";
import { toast } from 'react-toastify'; 

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

    // Create Account (create user, login immediately, and send email verification)
    async createAccount({ email, password, name }) {
        try {
            console.log("Received data in createAccount:", { email, password, name });

            // Validate email format (simple regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.error("Invalid email format:", email);
                toast.error("Invalid email format"); // Show error toast
                throw new Error("Invalid email format");
            }

            // Validate password length
            if (password.length < 8) {
                console.error("Password is too short. Minimum length is 8 characters.");
                toast.error("Password is too short. Minimum length is 8 characters."); // Show error toast
                throw new Error("Password is too short. Minimum length is 8 characters.");
            }

            // Step 1: Create the user account in Appwrite
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                console.log("User account created successfully:", userAccount);

                // Step 2: Log the user in (so they are authenticated)
                const session = await this.account.createEmailPasswordSession(email, password);
                if (!session) {
                    toast.error("Failed to log in user after account creation.");  
                    throw new Error("Failed to log in user after account creation.");
                }

                // Step 3: Send the verification email after successful login
                await this.sendVerificationEmail();

                toast.success("Account created successfully. Please verify your email.");
                return { success: true, message: "Account created successfully. Please verify your email.", user: userAccount };
            }
            toast.error("Account creation failed. Try again."); 
            return { success: false, message: "Account creation failed. Try again." };
        } catch (error) {
            console.error('AuthService :: createAccount :: error', error);
            if (error.response) {
                console.error('Appwrite error details:', error.response);
            }
            toast.error(error.message || 'Account creation failed. Please try again.'); // 
            return { success: false, message: error.message || 'Account creation failed. Please try again.' };
        }
    }

    // Login User (checks if email verified)
    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            const user = await this.getCurrentUser();

            if (!user.emailVerification) {
                await this.account.deleteSession("current"); // Force logout if email not verified
                toast.error('Email not verified. Please verify your email before logging in.'); 
                throw new Error('Email not verified. Please verify your email before logging in.');
            }

            const posts = await this.getUserPosts(user.$id);

            toast.success('Login successful!'); 
            return {
                user,
                posts
            };
        } catch (error) {
            console.error('AuthService :: login :: error', error);
            toast.error(error.message || 'Login failed. Please check your credentials.'); // Show error toast
            throw new Error(error.message || 'Login failed. Please check your credentials.');
        }
    }

    // Get Current User
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error('AuthService :: getCurrentUser :: error', error);
            return null;
        }
    }

   // Logout User
async logout() {
    try {
        await this.account.deleteSessions(); // Try to destroy all sessions
        console.log("AuthService :: logout :: Appwrite session deleted successfully.");
        toast.success('Logged out successfully!');
    } catch (error) {
        console.error("AuthService :: logout :: error", error);

        // Gracefully handle guest session error
        if (
            error?.message?.includes("missing scope") ||
            error?.message?.toLowerCase().includes("guest")
        ) {
            console.warn("User is already logged out or session is invalid.");
            toast.info("Session already ended.");
        } else {
            toast.error(error.message || "Failed to logout. Please try again.");
            throw new Error(error.message || "Failed to logout. Please try again.");
        }
    } finally {
        // Always clear local session info and redirect
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login'; // Or navigate using router
    }
}


    // Fetch Posts for Logged-In User
    async getUserPosts(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("userId", userId)]
            );
            return response.documents;
        } catch (error) {
            console.error('AuthService :: getUserPosts :: error', error);
            return [];
        }
    }

    // Send Email Verification
    async sendVerificationEmail() {
        try {
            // fallback URL to-> /verify page
            return await this.account.createVerification(`${conf.appwriteDomain}/verify`);
        } catch (error) {
            console.error('AuthService :: sendVerificationEmail :: error', error);
            toast.error(error.message || 'Failed to send verification email.'); 
            throw new Error(error.message || 'Failed to send verification email.');
        }
    }

    // Send Password Recovery Email
    async sendRecoveryEmail(email) {
        try {
            //  fallback URL to-> /reset-password page
            return await this.account.createRecovery(email, `${conf.appwriteDomain}/reset-password`);
        } catch (error) {
            console.error('AuthService :: sendRecoveryEmail :: error', error);
            toast.error(error.message || 'Failed to send recovery email.'); 
            throw new Error(error.message || 'Failed to send recovery email.');
        }
    }

    // Confirm Password Reset
    async confirmRecovery(userId, secret, newPassword) {
        try {
            return await this.account.updateRecovery(userId, secret, newPassword, newPassword);
        } catch (error) {
            console.error('AuthService :: confirmRecovery :: error', error);
            toast.error(error.message || 'Password reset failed.'); 
            throw new Error(error.message || 'Password reset failed.');
        }
    }

    // Confirm Email Verification (for email verification confirmation process)
    async confirmEmailVerification(userId, secret) {
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            console.error('AuthService :: confirmEmailVerification :: error', error);
            toast.error(error.message || 'Email verification failed.'); 
            throw new Error(error.message || 'Email verification failed.');
        }
    }
}

// Create and export a single instance
const authService = new AuthService();
export default authService;
