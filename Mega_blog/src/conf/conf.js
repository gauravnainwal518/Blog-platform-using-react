const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteCommentsCollectionId: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  appwriteFunctionId: String(import.meta.env.VITE_APPWRITE_FUNCTION_ID),
  appwriteDomain: String(import.meta.env.VITE_APP_DOMAIN), 
  //oauthGoogleUrl: String(import.meta.env.VITE_OAUTH_GOOGLE_URL), 
};

export default conf;
