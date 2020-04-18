# Network Orchestra
## Quadrophonic Performance

[Video demo](https://vimeo.com/400054881)  

A quadrophonic performance using computers as speakers.  

![Quad diagram](includes/quadSetup.png)

## About
This is quadrophonic speaker performance where personal computers are used as speakers. The signals are sent from a performer using master computer that sends network traffic information to a WebSocket Server which are delivered to connected clients. The server is optimized for four clients, but potentially can be scaled much higher.

## Writeup

This week was a little tough to work on this project. Ideally I would have checked out multiple laptops to act as my speakers. I was inspired by the Zaireeka album that was shared in class as well as LAN gaming and wanted to replicate that kind of environment to listen to music. 

With the ER closed, I decided to spend my time working on web socket programming as I don't have a ton of experience with socketio or ToneJs. 

I made it so that clients have a sound and clients join it creates a button on all the computers so that users can trigger another computers sound.

I didn't get too far with the composition but I generally got the tech demo working. I'd like to work on it more to make it more composed or musical.

## Setup & Installation
- Clone the respository
- Begin the WebServer with `npm start`
- Use a modern web browser and connect to `localhost:8000` (This will be the master computer)
- Connect 4 clients to the same network
- In a modern web browser connect client machines to `<serverIpAddress>:8000`
- Browse the internet using the Master computer

## Software used
- Node/Express
- SocketIO
- ToneJS
