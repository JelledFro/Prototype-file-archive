const express = require('express')
const cors = require('cors')
const lowdb = require('lowdb')
const fileUpload = require('express-fileupload');
var path = require('path');
const fs = require('fs')


const db = new lowdb.LowSync(new lowdb.JSONFileSync('./src/files/db.json'))
db.read()
db.data ||= { fileInfo: [] }

const PORT = 3010

const app = express()

app.use(fileUpload({
    createParentPath: true
}));

var fileUploadOptions = {
    root: path.join(__dirname + '/files/')
};

app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())

//routes
app.get('/fileInfo/all', (req, res) => {
    db.read()
    return res.json(db.data.fileInfo)
})

app.get('/file/:id', (req, res) => {
    console.log('getting file')
    //TODO find filename by id
    const { fileInfo } = db.data
    const id = req.params["id"]
    
    const itemToFind = fileInfo.find(file => file.id == id)
    res.sendFile(itemToFind.filename, fileUploadOptions);
  }); 

app.post('/file/newfile', (req, res) => {
    const file = req.files.file
    const fileInfo = req.body
    let filename
    if(fileInfo.filename){
        filename = fileInfo.filename + "." + file.name.split('.')[1]
    } else {
        filename = file.name
    }
    const fileData = {
        "id": fileInfo.id,
        "filename": filename, 
        "description": fileInfo.description,
        "date": fileInfo.date
      }
    db.data.fileInfo.push(fileData)
    db.write()

    file.mv('./src/files/' + filename);
    res.sendStatus(200)
})

app.delete('/file/:id', (req, res) => {
    const { fileInfo } = db.data
    const id = req.params["id"]
    
    const itemToDelete = fileInfo.find(file => file.id == id)
    console.log('deleting file', itemToDelete) 



    db.data.fileInfo = fileInfo.filter(file => file.id != id)
    db.write()

    const filepath = './src/files/' + itemToDelete.filename

    fs.unlink(filepath, (err) => { 
        if (err) throw err;
        console.log('file was deleted');
      });
      
  }); 

app.listen(PORT, () => {
    console.log(`server started, listening on http://localhost:${PORT}`)
})