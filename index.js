const express = require('express');
const cors = require('cors');

const app =  express();

app.use( express.json () );
app.use( cors() );

const requestLogger = (request, response, next) =>{
  const logText = [
    request.method,
    request.url,
    JSON.stringify(request.body),
  ].join(' ');

  console.log(logText);
  next();
}

app.use(requestLogger)

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ];

app.get('/', (request, response) =>{
    console.log('Sent homepage\n');
    response.send('<h1>Home Page<h1>');
});

app.get('/api/notes', (request, response) => {
    console.log(`Sent all notes: ${JSON.stringify(notes)}\n`);
    response.json(notes);
});

app.post('/api/notes', (request, response) => {
  const body = request.body;
  
  if(!body.content){
    return response.status(400).json({
      error: `No content was sent`
    });
  }

  const newNote = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  console.log('New note created\n')
  notes = notes.concat(newNote);
  response.json(newNote);
})

app.get('/api/notes/:id', (request, response) =>{
    const id = request.params.id-0;
    const note = notes.find(note => note.id === id)
    if (note){
        response.json(note);
    } else{
        response.status(404).end();
    }
});

console.log('Sent particular note\n');
app.put('/api/notes/:id', (request, response)=>{
  const id = request.params.id-0;
  const body = request.body;
  notes = notes.filter(note => note.id !== id).concat(body);
  response.json(body);
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id-0;
    notes = notes.filter( note => note.id!==id );
    console.log(notes);
    response.status(204).end();
    console.log('Note deleted\n');
});

const unknownEndpoint = (request, response, next) =>{
  response.status(404).json({
    error: "unkown endpoint"
  });
  next();
}

app.use( unknownEndpoint );

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});