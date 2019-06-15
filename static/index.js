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
        if(channelname === ""){
            return false
        }
        socket.emit('create channel', {'channelname': channelname});
        return false;
    };

    // Send Message
    document.querySelector('#message').onsubmit = () => {
        var text = document.querySelector('#text').value;
        socket.emit('send message', {'text': text, 'username':name});
        return false;
    };


    });



    // When the initial channels are announced add all of them
    socket.on('all channels', data => {
        const sel = document.querySelector('#channels');
        var channelname = localStorage.getItem('channel')

        data.channels.forEach(channel => {
            const opt = document.createElement('option');
            // create text node to add to option element (opt)
            opt.appendChild( document.createTextNode(channel) );

            // set value property of opt
            opt.value = channel;
            sel.appendChild(opt);
            if(channelname && channelname === channel){
                sel.value = channel;
            }
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

    // When a new channel is announced, add to the unordered list
    socket.on('announce message', data => {
        const text = document.createTextNode(data.text)
        const username = document.createTextNode(data.username)
        const timestamp = document.createTextNode(data.timestamp)
        const chat = document.querySelector('.chat');

        // Create Listitem
        const li = document.createElement('li');
        li.className = "clearfix";
        // Create First level div
        const message = document.createElement('div')
        message.className = "chat-body clearfix";
        // Add Header
        const header = document.createElement('div')
        header.className = "header";
        const strong = document.createElement('strong')
        const small = document.createElement('small')
        small.className = "pull-right text-muted"
        // Ceate Text Paragraph
        const p = document.createElement('p')
        // Glue it all together
        p.appendChild(text)
        strong.appendChild(username)
        small.appendChild(timestamp)
        header.appendChild(strong)
        header.appendChild(small)
        message.appendChild(header)
        message.appendChild(p)
        li.appendChild(message)
        chat.appendChild(li);
    });

    document.querySelector('#channels').onchange = function(){
        localStorage.setItem("channel", this.value)
        var myNode =  document.querySelector('.chat');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        socket.emit('change channel',  {'channelname': this.value})
    }

    // Search Messages
    document.querySelector('#search').onsubmit = () => {
        var searchterm = document.querySelector('#searchterm').value;
        var chat =  document.querySelector('.chat');
        var message_nodes = chat.querySelectorAll('li');
        console.log(message_nodes);
        for(var node of message_nodes){
            var text = node.getElementsByTagName('p')[0].innerHTML;
            if(!text.includes(searchterm)){
                chat.removeChild(node);
            }
        }
        return false;
    };

    // Search Messages
    document.querySelector('#reset').onclick = () => {
        var channel = document.querySelector('#channels').value
        var myNode =  document.querySelector('.chat');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        socket.emit('change channel',  {'channelname': channel})
        return false;
    };


});
