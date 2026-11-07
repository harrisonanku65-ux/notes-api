const fs = require('fs')
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

//middleware
app.use(cors());  //Allows frontend cross-origin requests 
app.use(express.json());  //Allows the backend to read incoming JSON  data

function saveNotes(){
  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
}

const data = { name: "welcome to my domain", version:"1.0"};
let notes = [];
if(fs.existsSync('notes.json')){
  notes= JSON.parse(fs.readFileSync('notes.json', 'utf-8'))
}
let nextId = notes.length ? Math.max(...notes.map(n => n.id))+ 1 : 1;

//API endpoint (GET Request)
app.get('/api/info', (req, res) => {
  res.json(data);
});

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  const newNote ={
    id: nextId++,
    title,
    content,
    createdAt: new Date()
  };

  if(!title || !content){
    return res.status(400).json({ error: "Title and content are required"});
  }
  notes. push(newNote);
  saveNotes();
  res.status(201).json(newNote);
});

app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  
  //step 2: find the notes 
  const note = notes.find(n => n.id === id);
  //step 3: if not found, send a 404
  if(!note){
    return res.status(404).json({ error: "Note not found" });
  }
  //
  res.json(note);



  //step 4: send the note back
})

app.delete('/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  //step 1: find the position of the note in the array
  const index = notes.findIndex(n => n.id === id);
  //step 2: if it isnt there, send a 404
  if(index === -1){
    return res.status(404).json({ error: "Note not found"});
  }
  //step 3: remove it from the array
  notes.splice(index ,1 );
  saveNotes();

  //step 4: send a request.
  res.json({ message: "Note deleted"});

});


app.put('/notes/:id' , (req, res) => {
  //step 1: read the id from req params (like GET and DELETE)
  const id = Number(req.params.id);
  // step 2: find the note (like GET)
  const index = notes.findIndex(n => n.id === id);
  // step 3: if it isnt there, send a 404(like GET and  DELETE)
  if(index === -1){
    return res.status(404).json({ error: " Note not found"});
  }
  //step 4: read title and content from req.body (like POST)
  const { title, content } = req.body;

  if(!title || !content){
    return res.status(400).json({ error: "Title and content are required"});
  }

  //step 5: change the notes title and content
  const note = notes[index];

  note.title = title;
  note.content = content;

  //save
  saveNotes();
  //step 6: send the updated note back
  res.json(note);
});

//Start the server
app.listen(PORT, () =>{
  console.log(`server is running at http://localhost:${PORT}`);

});