const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
let PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"))
});


app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    let notesData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let uniqueID = (notesData.length).toString();
    newNote = uniqueID;
    notesData.push(newNote);
    

    fs.writeFileSync("./db/db.json", JSON.stringify(notesData));
    console.log("Note added: ", newNote);
    res.json(notesData);
})

app.delete("/api/notes/:id", function(req, res) {
    let noteID = req.params.id;
    let notesData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newID = 0;

    notesData = notesData.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of notesData) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(notesData));

    res.json(notesData);
})

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});


