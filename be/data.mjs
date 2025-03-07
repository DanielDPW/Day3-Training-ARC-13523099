import fs from "fs/promises"

const file = "./notes.json"

export async function readNote() {
    try {
        const data = await fs.readFile(file, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function writeNote(data) {
    await fs.writeFile(file, JSON.stringify(data, null, 4), "utf-8");
}