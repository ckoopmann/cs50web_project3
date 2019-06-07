

// Load current value of  name
document.addEventListener('DOMContentLoaded', () => {
  // Set starting value of name to 0
  if (!localStorage.getItem('name'))
      localStorage.setItem('name', prompt("Enter your Name","dickhead"));

  const name = localStorage.getItem('name');
  document.querySelector('#heading').innerHTML = name;


    // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons
  socket.on('connect', () => {

    // Each button should emit a "submit vote" event
    document.querySelector('#channel').onsubmit = () => {
        var channelname = document.querySelector('#channelname').value;
        socket.emit('create channel', {'chanelname': channelname});
      };
    });
  });
});
