// Load current value of  name
 if (!localStorage.getItem('name')){
   var name = prompt("Enter your Name","dickhead");
   localStorage.setItem('name', name);
 } else {
   var name = localStorage.getItem('name');
 }

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#username').innerHTML = name;

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


    // When connected, configure channel creation
    socket.on('connect', () => {
        // Emit connected message to request initial channel list
        socket.emit('connected');

        // Each button should emit a "submit channel" event
        document.querySelector('#channel').onsubmit = () => {
            var channelname = document.querySelector('#channelname').value;
            socket.emit('create channel', {'channelname': channelname});
            return false;
        };
    });

    // When the initial channels are announced add all of them
    socket.on('all channels', data => {
        data.channels.forEach(channel => {
            const li = document.createElement('li');
            li.innerHTML = channel;
            document.querySelector('#channels').append(li);
        })
    });

    // When a new channel is announced, add to the unordered list
    socket.on('announce channel', data => {
        const li = document.createElement('li');
        li.innerHTML = data.channelname;
        document.querySelector('#channels').append(li);
    });

});
