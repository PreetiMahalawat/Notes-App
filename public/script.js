// =============================
// SMART NOTES APP
// Part 1
// =============================

const API = "/api/notes";

// Elements
const title = document.getElementById("title");
const description = document.getElementById("description");
const addBtn = document.getElementById("addBtn");
const search = document.getElementById("search");
const notesContainer = document.getElementById("notesContainer");
const count = document.getElementById("count");
const todayCount = document.getElementById("todayCount");
const currentTime = document.getElementById("currentTime");
const themeBtn = document.getElementById("themeBtn");

let editId = null;
let allNotes = [];

// =============================
// Live Clock
// =============================

function updateClock() {
    const now = new Date();

    currentTime.innerHTML = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

updateClock();
setInterval(updateClock, 1000);

// =============================
// Load Notes
// =============================

window.onload = () => {
    loadNotes();
};

// =============================
// Get Notes
// =============================

async function loadNotes() {

    try {

        const res = await fetch(API);

        allNotes = await res.json();

        displayNotes(allNotes);

    } catch (err) {

        console.log(err);

    }

}

// =============================
// Display Notes
// =============================

function displayNotes(notes) {

    notesContainer.innerHTML = "";

    count.innerHTML = notes.length;

    let today = 0;

    const todayDate = new Date().toDateString();

    notes.forEach(note => {

        if (new Date(note.createdAt).toDateString() === todayDate) {
            today++;
        }

        notesContainer.innerHTML += `

        <div class="note-card">

            <h3>${note.title}</h3>

            <p>${note.description}</p>

            <small>

                <i class="fa-solid fa-calendar"></i>

                ${new Date(note.createdAt).toLocaleString()}

            </small>

            <div class="buttons">

                <button class="editBtn"

                    onclick="editNote('${note._id}')">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button class="deleteBtn"

                    onclick="deleteNote('${note._id}')">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        </div>

        `;

    });

    todayCount.innerHTML = today;

}

// =============================
// Add New Note / Update Note
// =============================

addBtn.addEventListener("click", async () => {

    const noteTitle = title.value.trim();
    const noteDescription = description.value.trim();

    if (noteTitle === "" || noteDescription === "") {

        alert("Please enter title and description.");

        return;

    }

    const noteData = {

        title: noteTitle,

        description: noteDescription

    };

    try {

        if (editId === null) {

            // Add Note

            await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(noteData)

            });

        } else {

            // Update Note

            await fetch(`${API}/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(noteData)

            });

            editId = null;

            addBtn.innerHTML = `
                <i class="fa-solid fa-plus"></i>
                Add Note
            `;

        }

        title.value = "";

        description.value = "";

        loadNotes();

    } catch (err) {

        console.log(err);

    }

});

// =============================
// Edit Note
// =============================

function editNote(id) {

    const note = allNotes.find(n => n._id === id);

    if (!note) return;

    title.value = note.title;

    description.value = note.description;

    editId = id;

    addBtn.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Update Note
    `;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// =============================
// Delete Note
// =============================

async function deleteNote(id) {

    const confirmDelete = confirm("Are you sure you want to delete this note?");

    if (!confirmDelete) return;

    try {

        await fetch(`${API}/${id}`, {

            method: "DELETE"

        });

        loadNotes();

    } catch (err) {

        console.log(err);

    }

}

// =============================
// Search Notes
// =============================

search.addEventListener("input", () => {

    const keyword = search.value.toLowerCase();

    const filteredNotes = allNotes.filter(note =>

        note.title.toLowerCase().includes(keyword) ||

        note.description.toLowerCase().includes(keyword)

    );

    displayNotes(filteredNotes);

});

// =============================
// Dark Mode
// =============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("dark")) {

        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");

        localStorage.setItem("theme", "dark");

    } else {

        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");

        localStorage.setItem("theme", "light");

    }

});

// =============================
// Load Saved Theme
// =============================

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.querySelector("i").classList.remove("fa-moon");

    themeBtn.querySelector("i").classList.add("fa-sun");

}

// =============================
// Toast Message (Basic)
// =============================

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}