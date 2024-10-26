# server/app.py

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import os

import sys
import json
from groq_evaluation import evaluate_speech_with_groq

app = Flask(__name__)

# from flask import Flask, request

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return "Flask server is running."

@socketio.on('audio_data')
def handle_audio_data(data):
    # Here, `data` contains the raw audio chunks sent from the frontend
    print("Received audio data:", data)
    # print(data)
    # Optionally, process or save the audio data
    # You could save it to a file, pass it to an ML model, etc.

@socketio.on('connect')
def handle_connect():
    print("Client connected.")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected.")

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=4000)

@app.route('/evaluate', methods=['POST'])
def evaluate_speech():
    # Get the speech text from the CLI or default sample
    user_text = request.json.get('speech_text', "I am uhm, practicing, uhm, my speaking skills. How am I, uh, I guess, how am I, uh, doing?")

    # Get evaluation results from Groq
    evaluation_results = evaluate_speech_with_groq(user_text)
    
    if not evaluation_results:
        return jsonify({"error": "Failed to evaluate with Groq"}), 500

    # Display results in CLI
    print("\nEvaluation Results:")
    for aspect in evaluation_results:
        print(f"{aspect['aspect'].capitalize()}: Score - {aspect['score']}, Advice - {aspect['advice']}")

    # Return the result in JSON format for CLI or further use
    return jsonify(evaluation_results)

if __name__ == '__main__':
    # Command-line argument for speech text input
    if len(sys.argv) > 1:
        speech_text = sys.argv[1]
    else:
        speech_text = "I am uhm, practicing, uhm, my speaking skills. How am I, uh, I guess, how am I, uh, doing?"

    # Create a test client to run the evaluation
    with app.test_client() as client:
        response = client.post('/evaluate', json={"speech_text": speech_text})
        print("\nResponse JSON:", json.loads(response.data))