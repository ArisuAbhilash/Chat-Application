from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

users = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('new-user-joined')
def handle_new_user(name):
    users[request.sid] = name
    emit('user-joined', name, broadcast=True, include_self=False)

@socketio.on('send')
def handle_send(message):
    name = users.get(request.sid, "Anonymous")
    # Send to everyone **except** the sender
    emit('receive', {'message': message, 'name': name}, broadcast=True, include_self=False)

@socketio.on('disconnect')
def handle_disconnect():
    name = users.pop(request.sid, "Anonymous")
    emit('left', name, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)    
