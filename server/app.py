from flask import Flask, request, jsonify

import sys
from groq_evaluation import evaluate_speech_with_groq
from flask_cors import CORS

from ..db.db import DataBaseClient

app = Flask(__name__)

CORS(app, origins="http://localhost:5173")

db_client = DataBaseClient('mongodb://127.0.0.1:27017')

# app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/')
def index():
    return "Flask server is running."


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

    app.run(debug=True, host='0.0.0.0', port=4000)

