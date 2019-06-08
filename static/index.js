// Load current value of  name
 if (!localStorage.getItem('name')){
   var name = prompt("Enter your Name","dickhead");
   localStorage.setItem('name', name);
 } else {
   var name = localStorage.getItem('name');
 }

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#heading').innerHTML = name;

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


    socket.emit('my event', {data: 'I\'m connected!'});

    // When connected, configure channel creation
    socket.on('connect', () => {
        // Each button should emit a "submit channel" event
        document.querySelector('#channel').onsubmit = () => {
            var channelname = document.querySelector('#channelname').value;
            socket.emit('create channel', {'channelname': channelname});
            return false;
        };
    });

    // When a new channel is announced, add to the unordered list
    socket.on('announce channel', data => {
        const li = document.createElement('li');
        li.innerHTML = data.channelname;
        document.querySelector('#channels').append(li);
    });


    // When a new vote is announced, add to the unordered list
    socket.on('announce vote', data => {
        const li = document.createElement('li');
        li.innerHTML = `Vote recorded: ${data.selection}`;
        document.querySelector('#votes').append(li);
    });
});
