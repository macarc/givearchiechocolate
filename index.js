const fs = require('fs');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let file_openable = true;


function getFileLock() {
    while (! file_openable) {}
    file_openable = false;
    console.log('opening');
}

function returnFileLock() {
    file_openable = true;
    console.log('closing');
}

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    socket.on('howmany', (req,res) => {
        getFileLock();
        const data = fs.readFileSync('bars.txt');
        const string_data = data.toString();
        io.emit('bar-count', string_data);
        returnFileLock();
    });
    socket.on('moar', (req,res) => {
        getFileLock();
        const data = fs.readFileSync('bars.txt');
        const val = parseInt(data) + 1;
        const new_val = val.toString();
        fs.writeFileSync('bars.txt', new_val);
        io.emit('bar-count', new_val);
        returnFileLock();
    });
});



http.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));
