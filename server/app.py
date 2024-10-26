# server/app.py

from flask import Flask, request, jsonify
import sys
import json
from groq_evaluation import evaluate_speech_with_groq

app = Flask(__name__)

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
