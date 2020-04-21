const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
let PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"))
});

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    fs.readFile('./db/db.json', 'utf-8', function(error, result) {
        if (error) {
          return console.log(error);
        }
        let note = JSON.parse(result)
        note.push(newNote)
        fs.writeFileSync("./db/db.json", JSON.stringify(note));
        res.json(note);
          });
      });
      
app.delete("/api/notes/:id", function(req, res) {
    let result = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    result = result.filter(note => {
        return note.id != noteID;
    })
    
    for (note of result) {
        note.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(result));
    res.json(result);
})


app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

