import express from "express"
import { readNote, writeNote } from "./data.mjs";
import cors from "cors"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("../fe"));

app.use((req, res, next) => {
    const requestIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
	const requestProtocol = req.headers["x-forwarded-proto"] || req.protocol;
	console.log(`[REQUEST]: ${requestIp}: (${requestProtocol}) ${req.originalUrl}`);
	next();
});

app.get("/notes", async(req, res) => {
    const data = await readNote();
    res.json(data);
});

app.post("/notes", async(req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({message: "Bad Request"})
    }

    const data = await readNote();
    const newNote = {
        id: data.length > 0 ? Math.min(...Array.from({ length: data.length + 1 }, (_, i) => i + 1).filter((id) => !data.some((n) => n.id === id))) : 1,
        title,
        content,
    };
    data.push(newNote);
    await writeNote(data);
    res.status(201).json(newNote);
})

app.put("/notes/:id", async(req, res) => {
    const { title, content } = req.body;
    const data = await readNote();
    const idx = data.findIndex((note) => note.id == Number(req.params.id));

    if (idx === -1) {
        return res.status(404).json({message: "Not Found"});
    }
    data[idx].title = title || data[idx].title;
    data[idx].content = content || data[idx].content;
    
    await writeNote(data);
    res.json(data[idx]);
})

app.delete("/notes/:id", async(req, res) => {
    let data = await readNote();
    data = data.filter((note) => note.id != Number(req.params.id));
    await writeNote(data);
    res.json({message: "Note Deleted"})
})

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});