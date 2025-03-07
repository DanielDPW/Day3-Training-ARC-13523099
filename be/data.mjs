import fs from "fs/promises"

const file = "./notes.json"

export async function read() {
    try {
        const data = await fs.readFile(file, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function write(data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}