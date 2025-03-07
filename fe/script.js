const API_URL = "http://localhost:3000/notes";

async function getNotes() {
	const res = await fetch(API_URL);
	const data = await res.json();
	const list = document.getElementById("notes");
	list.innerHTML = "";

	data.forEach((note) => {
		const li = document.createElement("li");
		li.innerHTML = `
			<b>${note.title}</b>
			<p>${note.content.replace(/\n/g, "<br>")}</p>
			<div>
				<button onclick="editNote(${note.id}, '${note.title}', '${note.content}')">Edit</button>
				<button onclick="deleteNote(${note.id})">Delete</button>
			</div>
		`;
		list.appendChild(li);
	});
}

async function submitNote() {
	const id = document.getElementById("noteId").value;
	const title = document.getElementById("title").value;
	const content = document.getElementById("content").value;

	const method = id ? "PUT" : "POST";
	const url = id ? `${API_URL}/${id}` : API_URL;

	await fetch(url, {
		method,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title, content }),
	});

	document.getElementById("noteForm").reset();
	document.getElementById("noteId").value = "";
	document.getElementById("title").value = "";
	document.getElementById("content").value = "";
	document.getElementById("title").focus();
	getNotes();
}

async function deleteNote(id) {
	await fetch(`${API_URL}/${id}`, {
		method: "DELETE",
	});
	getNotes();
}

function editNote(id, title, content) {
	document.getElementById("noteId").value = id;
	document.getElementById("title").value = title;
	document.getElementById("content").value = content;
	document.getElementById("title").focus();
}

getNotes();