const fs = require('fs');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/',function(req,res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('howmany', (req,res) => {
        fs.readFile('bars.txt',(err,data) => {
            if (! err) {
                data = data.toString();
                io.emit('bar-count',data);
            } else {
                console.error(err);
            }
        });
    });
    socket.on('moar', (req,res) => {
        fs.readFile('bars.txt',(err,data) => {
            if (! err) {
                let val = parseInt(data);
                let new_val = (++val).toString();
                fs.writeFile('bars.txt',new_val,err => console.error(err));
                io.emit('bar-count',new_val);
            } else {
                console.error(err);
            }
        });
    });
});



http.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));
