import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase (substitua pelas suas credenciais)
const firebaseConfig = {
    apiKey: "AIzaSyC52D7ZXXGhJxmqFR5Fzs2gKUSg6QPmGd8",
    authDomain: "museu-perypery.firebaseapp.com",
    projectId: "museu-perypery",
    storageBucket: "museu-perypery.firebasestorage.app",
    messagingSenderId: "968580407557",
    appId: "1:968580407557:web:611e17839b5ab74e89176c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
