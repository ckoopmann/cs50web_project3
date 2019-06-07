
// Load current value of  name
document.addEventListener('DOMContentLoaded', () => {

  if (!localStorage.getItem('name')){
    const name = prompt("Enter your Name","dickhead");
    localStorage.setItem('name', name);
  } else {
    const name = localStorage.getItem('name');
    alert('Your Username is: ' + name);
  }

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
