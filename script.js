document.addEventListener("DOMContentLoaded", () =>{
    const form = document.querySelector("form");
    const input = document.getElementById("progress-input");

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const entry = input.value.trim();
        if (entry === '') return;
        
        saveEntry(entry);
        input.value = '';
    });
});

function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem("progressEntries")) || [];
    entries.push(entry); 
    localStorage.setItem("progressEntries", JSON.stringify(entries)); 
    console.log("Saved Entry: ", entries)
}