import express from "express";
import path from "path";
import fs from "fs";
const app = express();
const pathToTemplate = path.join(path.resolve(), "public", "index.html");
const template = fs.readFileSync(pathToTemplate, "utf-8");

app.use(express.static("public"));
app.use(express.json());

app.get("/", (_req, res) => {
    res.end(template);
});

app.post("/get-url-data", (req, res) => {
    const serverResponse = {
        title: "Я спросил у сервера...",
        text: "the url: " + req.body.url + " was sended to the server",
    };
    res.end(JSON.stringify(serverResponse));
});

app.listen(4200);
