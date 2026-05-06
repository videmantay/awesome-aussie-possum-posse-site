import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDzEsoWrv4hhsPS4ua_uXqUbPqhbkUZVeQ',
  authDomain: 'awesausspossposs-firebase.firebaseapp.com',
  projectId: 'awesausspossposs-firebase',
  storageBucket: 'awesausspossposs-firebase.firebasestorage.app',
  messagingSenderId: '588794942858',
  appId: '1:588794942858:web:a2c917567a684a3bb1e473',
  measurementId: 'G-QV4L3X10CJ',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, 'awesausspossposs');
export const storage = getStorage(app);

export default app;
