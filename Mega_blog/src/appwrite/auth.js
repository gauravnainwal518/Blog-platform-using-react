import conf from '../conf/conf.js';
import { Client, Account, ID, Databases, Query } from "appwrite";

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
            console.log("Received data in createAccount:", { email, password, name });

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.error("Invalid email format:", email);
                throw new Error("Invalid email format");
            }

            if (password.length < 8) {
                console.error("Password is too short. Minimum length is 8 characters.");
                throw new Error("Password is too short. Minimum length is 8 characters.");
            }

            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                console.log("User account created successfully:", userAccount);

                const session = await this.account.createEmailPasswordSession(email, password);
                if (!session) {
                    throw new Error("Failed to log in user after account creation.");
                }

                await this.sendVerificationEmail();

                return {
                    success: true,
                    message: "Account created successfully. Please verify your email.",
                    user: userAccount
                };
            }
            return { success: false, message: "Account creation failed. Try again." };
        } catch (error) {
            console.error('AuthService :: createAccount :: error', error);
            if (error.response) {
                console.error('Appwrite error details:', error.response);
            }
            return { success: false, message: error.message || 'Account creation failed. Please try again.' };
        }
    }

    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            const user = await this.getCurrentUser();

            if (!user.emailVerification) {
                await this.account.deleteSession("current");
                throw new Error('Email not verified. Please verify your email before logging in.');
            }

            const posts = await this.getUserPosts(user.$id);

            return {
                user,
                posts
            };
        } catch (error) {
            console.error('AuthService :: login :: error', error);
            throw new Error(error.message || 'Login failed. Please check your credentials.');
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error('AuthService :: getCurrentUser :: error', error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
            console.log("AuthService :: logout :: Appwrite session deleted successfully.");
        } catch (error) {
            console.error("AuthService :: logout :: error", error);
            if (
                error?.message?.includes("missing scope") ||
                error?.message?.toLowerCase().includes("guest")
            ) {
                console.warn("User is already logged out or session is invalid.");
            } else {
                throw new Error(error.message || "Failed to logout. Please try again.");
            }
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
        }
    }

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

    async sendVerificationEmail() {
        try {
            return await this.account.createVerification(`${conf.appwriteDomain}/verify`);
        } catch (error) {
            console.error('AuthService :: sendVerificationEmail :: error', error);
            throw new Error(error.message || 'Failed to send verification email.');
        }
    }

    async sendRecoveryEmail(email) {
        try {
            return await this.account.createRecovery(email, `${conf.appwriteDomain}/reset-password`);
        } catch (error) {
            console.error('AuthService :: sendRecoveryEmail :: error', error);
            throw new Error(error.message || 'Failed to send recovery email.');
        }
    }

    async confirmRecovery(userId, secret, newPassword) {
        try {
            return await this.account.updateRecovery(userId, secret, newPassword, newPassword);
        } catch (error) {
            console.error('AuthService :: confirmRecovery :: error', error);
            throw new Error(error.message || 'Password reset failed.');
        }
    }

    async confirmEmailVerification(userId, secret) {
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            console.error('AuthService :: confirmEmailVerification :: error', error);
            throw new Error(error.message || 'Email verification failed.');
        }
    }
}

const authService = new AuthService();
export default authService;
