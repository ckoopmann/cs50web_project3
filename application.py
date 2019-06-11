import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import sys

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channel_list = []
channel_sessions = {}
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
    channel_sessions[new_channel] = []
    channel_messages[new_channel] = []
    print("New Channel: " + new_channel)
    emit('announce channel', {"channelname":  new_channel}, broadcast=True)

@socketio.on("send message")
def channel(data):
    text = data["text"]
    username = data["username"]
    print(username + ": " + text)

    #Find the channel that this user is in:
    for key, value in channel_sessions.items():
            if(request.sid in value):
                channel_name = key
                sessions = value

    if not channel:
        return


    emit('announce message', {"text":  text, "username": username}, broadcast=True)


@socketio.on("connected")
def channels():
    emit('all channels', {"channels":  channel_list})

@socketio.on("change channel")
def change(data):
    new_channel = data["channelname"]

    for key, value in channel_sessions.items():
            if(request.sid in value):
                value.remove(request.sid)
            if(key == new_channel):
                value.append(request.sid)
                print("Channel Changed: " + new_channel)
    print(channel_sessions)
