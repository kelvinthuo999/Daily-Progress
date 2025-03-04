// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkgSWvT6DuSQdr8lhcQkSdtApkKhStb7w",
    authDomain: "daily-progress-249b7.firebaseapp.com",
    projectId: "daily-progress-249b7",
    storageBucket: "daily-progress-249b7.firebasestorage.app",
    messagingSenderId: "340735874860",
    appId: "1:340735874860:web:78e835d8f3582b91b7be89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const input = document.getElementById("progress-input");
    const entriesList = document.createElement("ul");
    document.querySelector(".container").appendChild(entriesList); // Add list to UI

    // Save entry to Firestore
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent page refresh
        const entry = input.value.trim();
        if (entry === "") return;

        try {
            await addDoc(collection(db, "progressEntries"), {
                text: entry,
                timestamp: serverTimestamp()
            });
            console.log("Entry saved to Firestore:", entry);
        } catch (error) {
            console.error("Error saving entry:", error);
        }

        input.value = ""; // Clear input
    });

    // Fetch & display entries from Firestore in real-time
    const q = query(collection(db, "progressEntries"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        entriesList.innerHTML = ""; // Clear list before updating
        snapshot.forEach(doc => {
            const li = document.createElement("li");
            li.textContent = doc.data().text;
            entriesList.appendChild(li);
        });
    });
});
