import express from "express";
import hbs from "express-handlebars";
import * as path from "path";

const rootDir = process.cwd();
const port = 1234;
const app = express();
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "/views/layouts/"),
        partialsDir: path.join(rootDir, "/views/partials/"),
    })
);

app.use(express.static('static'));

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
