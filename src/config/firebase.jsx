// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDoPxZ23awjvw__5pOX0QYW1yO1eWJNO6U",
    authDomain: "finabee-admin.firebaseapp.com",
    projectId: "finabee-admin",
    storageBucket: "finabee-admin.appspot.com",
    messagingSenderId: "104237587824",
    appId: "1:104237587824:web:8853ae0426c5ab1e0a43b5",
    measurementId: "G-KKNRCB2C9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)

export { app, analytics, storage, }