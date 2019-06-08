import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import sys

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("create channel")
def channel(data):
    new_channel = data["channelname"]
    print("New Channel: " + new_channel, file=sys.stdout)
    emit('announce channel', {"channelname":  new_channel}, broadcast=True)


@socketio.on("submit vote")
def vote(data):
    selection = data["selection"]
    emit("announce vote", {"selection": selection}, broadcast=True)
