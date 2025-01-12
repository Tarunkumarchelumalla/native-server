// Import required modules
import admin from 'firebase-admin';

// Firebase Admin SDK setup
var serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://firestorage-12638.appspot.com", // Set your bucket name here
});

// Firebase Storage and Admin bucket reference
const storage = admin.storage();
const bucket = storage.bucket();

export { storage, bucket}