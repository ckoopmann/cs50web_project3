// Load current value of  name
 if (!localStorage.getItem('name')){
   var name = prompt("Enter your Name","guest");
   localStorage.setItem('name', name);
 } else {
   var name = localStorage.getItem('name');
 }

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#username').innerHTML = name;

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Emit connected message to request initial channel list
    socket.emit('connected');

    // When connected, configure channel creation
    socket.on('connect', () => {

        // Each button should emit a "submit channel" event
        document.querySelector('#channel').onsubmit = () => {
            var channelname = document.querySelector('#channelname').value;
            socket.emit('create channel', {'channelname': channelname});
            return false;
        };
    });

    // When the initial channels are announced add all of them
    socket.on('all channels', data => {
        const sel = document.querySelector('#channels');
        data.channels.forEach(channel => {
            const opt = document.createElement('option');
            // create text node to add to option element (opt)
            opt.appendChild( document.createTextNode(channel) );

            // set value property of opt
            opt.value = channel;
            sel.appendChild(opt);
        })
        socket.emit('change channel',  {'channelname': sel.value})
    });

    // When a new channel is announced, add to the unordered list
    socket.on('announce channel', data => {
        const opt = document.createElement('option');
        const channel = data.channelname
        const sel = document.querySelector('#channels');
        // create text node to add to option element (opt)
        opt.appendChild( document.createTextNode(channel) );
        // set value property of opt
        opt.value = channel;
        sel.appendChild(opt);
        if(sel.value == channel){
             socket.emit('change channel',  {'channelname': sel.value})
        }
    });

    document.querySelector('#channels').onchange = function(){
        alert(this.value + "has been selected");
        socket.emit('change channel',  {'channelname': this.value})
    }

});
