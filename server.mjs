import express from "express";
import * as path from "path";

const rootDir = process.cwd();
const port = process.env.PORT || 8000;
const app = express();

app.use(express.static('static'));

app.use('/path', express.static('node_modules/path'))

app.get("/", (_, res) => {
    res.redirect("/menu");
});

app.get("/game", (_, res) => {
    res.sendFile(path.join(rootDir, "static/game.html"));
});

app.get("/rules", (req, res) => {
    res.sendFile(path.join(rootDir, "static/rules.html"));
});

app.get("/menu", (req, res) => {
    res.sendFile(path.join(rootDir, "static/index.html"));
});

app.listen(port, () => console.log(`App listening on port ${port}`));