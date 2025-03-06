// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } 
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

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const input = document.getElementById("progress-input");
    const fieldSelect = document.getElementById("progress-field");
    const entriesContainer = document.createElement("div");
    entriesContainer.classList.add("entries-container");
    document.querySelector(".container").appendChild(entriesContainer);

    // Save entry to Firestore
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const entry = input.value.trim();
        const field = fieldSelect.value;

        if (entry === "" || field === "") return;

        try {
            await addDoc(collection(db, "progressEntries"), {
                text: entry,
                field: field,
                timestamp: serverTimestamp()
            });
            console.log("Entry saved:", { entry, field });
        } catch (error) {
            console.error("Error saving entry:", error);
        }

        input.value = "";
        fieldSelect.value = "";
    });

    // Fetch & display grouped entries by date
    const q = query(collection(db, "progressEntries"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        entriesContainer.innerHTML = ""; // Clear before updating

        const groupedEntries = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp?.toDate().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }) || "Unknown Date";

            if (!groupedEntries[date]) {
                groupedEntries[date] = [];
            }
            groupedEntries[date].push({ id: doc.id, ...data });
        });

        // Render grouped entries
        Object.keys(groupedEntries).forEach(date => {
            const tile = document.createElement("div");
            tile.classList.add("entry-tile");

            const title = document.createElement("h2");
            title.textContent = date;

            const list = document.createElement("ul");
            groupedEntries[date].forEach(entry => {
                const li = document.createElement("li");
                li.textContent = `${entry.text} (${entry.field})`;
                li.classList.add("entry-item");

                // Create a delete button (hidden by default)
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "❌ Delete";
                deleteBtn.classList.add("delete-btn", "hidden");
                deleteBtn.onclick = () => deleteEntry(entry.id);

                li.appendChild(deleteBtn);
                list.appendChild(li);

                // Show delete button when clicked
                li.addEventListener("click", (e) => {
                    e.stopPropagation(); // Prevent event from bubbling up
                    hideAllDeleteButtons(); // Hide other buttons first
                    deleteBtn.classList.remove("hidden"); // Show delete button
                });
            });

            tile.appendChild(title);
            tile.appendChild(list);
            entriesContainer.appendChild(tile);
        });
    });

    // Function to hide all delete buttons
    function hideAllDeleteButtons() {
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.classList.add("hidden");
        });
    }

    // Hide delete buttons when clicking anywhere else
    document.addEventListener("click", hideAllDeleteButtons);

    // Delete function
    async function deleteEntry(id) {
        if (!confirm("Are you sure you want to delete this entry?")) return;

        try {
            await deleteDoc(doc(db, "progressEntries", id));
            console.log("Entry deleted");
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    }
});
