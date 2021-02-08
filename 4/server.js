import express from "express";
import path from "path";
import fs from "fs";
const app = express();
const pathToTemplate = path.join(path.resolve(), "public", "index.html");
const template = fs.readFileSync(pathToTemplate, "utf-8");

app.use(express.static("public"));

app.get("/", (_req, res) => {
    res.end(template);
});

app.listen(4200);
