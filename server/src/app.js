const express = require('express')
const cors = require('cors')
const lowdb = require('lowdb')
const fileUpload = require('express-fileupload');
var path = require('path');


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
    console.log('all files!')
    return res.json(db.data.fileInfo)
})

app.get('/file', (req, res) => {
    console.log('getting file')
    const filename = req.params["filename"]
    res.sendFile('Programming task - english.pdf', fileUploadOptions);
  }); 

app.post('/file/newfile', (req, res) => {
    const file = req.files.file
    const fileInfo = req.body
    console.log('file: ', file)
    console.log('fileInfo: ', fileInfo)
    const fileData = {
        "filename": file.name, //TODO: use fileInfo.filename unless empty 
        "description": fileInfo.description,
        "date": fileInfo.date
      }
    db.data.fileInfo.push(fileData)
    db.write()

    file.mv('./src/files/' + file.name);
    res.sendStatus(200)
})

app.listen(PORT, () => {
    console.log(`server started, listening on http://localhost:${PORT}`)
})