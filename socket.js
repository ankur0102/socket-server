const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3030 });

const userSockets = { };

wss.on('connection', function connection(ws, req) {
  
  const suburl = 'http://dummy.com/?userName=' + req.url.substring(1);
  const url = new URL(suburl);
  const userName = url.searchParams.get('userName');
  console.log("User connected -> " + userName);

  userSockets[userName] = ws;

  ws.on('message', function incoming(data) {
    console.log("Incoming data -> " + data);
    console.log("Type of Incoming data -> " + typeof(data));
    const message = JSON.parse(data);
    const receiverSocket = userSockets[message.toUser];
    // wss.clients.forEach(function each(client) {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(data);
    //   }
    // });

    if (receiverSocket.readyState === WebSocket.OPEN) {
      
      console.log('Reciever user -> ' + message.toUser + ' online.');
      receiverSocket.send(data);
    } else {
      console.log('Reciever user -> ' + message.toUser + ' offline.');
    }

  });
  ws.addEventListener('userName', () => {
    console.log("User logged");
  });
});
