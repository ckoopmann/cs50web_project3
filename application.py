import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import sys
import time

max_messages = 10

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channel_list = []
user_rooms = {}
channel_messages = {}

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("create channel")
def channel(data):
    new_channel = data["channelname"]
    if new_channel in channel_list:
        return
    channel_list.append(new_channel)
    channel_messages[new_channel] = []
    print("New Channel: " + new_channel)
    emit('announce channel', {"channelname":  new_channel}, broadcast=True)

@socketio.on("send message")
def channel(data):
    text = data["text"]
    username = data["username"]
    print(username + ": " + text)

    if(request.sid not in user_rooms):
        return

    room = user_rooms[request.sid]
    timestamp = time.strftime("%d/%m/%Y %H:%M:%S")
    channel_messages[room].append((username, text, timestamp))

    if len(channel_messages[room]) > max_messages:
        channel_messages[room].pop(0)

    emit('announce message', {"text":  text, "username": username, "timestamp": timestamp}, room = room)


@socketio.on("connected")
def channels():
    emit('all channels', {"channels":  channel_list})

@socketio.on("change channel")
def change(data):
    if(data["channelname"] == ""):
        return

    new_channel = data["channelname"]

    if(request.sid in user_rooms):
        old_channel = user_rooms[request.sid]
        leave_room(old_channel)

    user_rooms[request.sid] = new_channel
    join_room(new_channel)

    for username, text, timestamp in channel_messages[new_channel]:
        emit('announce message', {"text":  text, "username": username, "timestamp": timestamp})

    print("Channel Changed: " + new_channel)
    print(user_rooms)
