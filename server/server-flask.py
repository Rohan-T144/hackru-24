import io
from flask import Flask, jsonify, request, send_file
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
import gridfs
from datetime import datetime
import sys

sys.path.append('..')

from db import DataBaseClient


app = Flask(__name__)
CORS(app)

client = DataBaseClient()
global NAME 
NAME = 'hackru-2024'

# Endpoint to write a document to the user's database
@app.route('/api/<user_id>/add_document', methods=['POST'])
def add_document(user_id):
    data = request.json
    project = data.get('project')
    user_idn = data.get('user_idn')
    audio_name = data.get('audio_name')
    audio_id = data.get('audio_id')
    transcription = data.get('transcription')
    score = data.get('score')
    advice = data.get('advice')
    date = data.get('date', datetime.today().date().strftime("%Y-%m-%d"))
    audio_data = None
    # audio_data = request.files['audio_data'].read() if 'audio_data' in request.files else None

    doc_id = client.write(user_idn, project, audio_name, transcription, score, advice, audio_data, date)
    
    if doc_id:
        return jsonify({"success": True, "id": str(doc_id)}), 201
    else:
        return jsonify({"success": False, "error": "Document could not be created"}), 500

# Endpoint to read a document from the user's database
@app.route('/api/<user_id>/get_document/<doc_id>', methods=['GET'])
def get_document(user_id, doc_id):
    dv = client.get_collection.distinct('user_idn')
    if user_id not in dv:
        return ('User could not be found'), 401
    
    document = client.read_document(doc_id)
    if document:
        return jsonify(document), 200
    else:
        return jsonify({"error": "Document not found"}), 404

@app.route('/api/<user_id>/upload_audio', methods=['POST'])
def upload_audio(user_id):
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not audio_file.filename.endswith('.mp3'):
        return jsonify({"error": "Only MP3 files are supported"}), 400

    try:
        audio_data = audio_file.read()
        audio_id = client.write_audio_to_gridfs(audio_data, filename=audio_file.filename)
        
        return jsonify({
            "success": True,
            "audio_id": audio_id,
            "message": "Audio file uploaded successfully"
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error uploading audio: {str(e)}"
        }), 500

@app.route('/api/<user_id>/get_audio/<audio_id>', methods=['GET'])
def get_audio(user_id, audio_id):
    try:
        audio_data = client.read_audio_from_gridfs(audio_id)
        
        if not audio_data:
            return jsonify({"error": "Audio file not found"}), 404
        
        audio_io = io.BytesIO(audio_data)
        
        return send_file(
            audio_io,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=f'audio_{audio_id}.mp3'
        )
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error retrieving audio: {str(e)}"
        }), 500

@app.route('/api/<user_id>/get_project_documents/<project_name>', methods=['GET'])
def get_project_documents(user_id, project_name):
    documents = client.read_project(project_name, user_id)
    
    if documents:
        return jsonify(documents), 200
    else:
        return jsonify({"error": "No documents found for this user and project"}), 404

if __name__ == '__main__':
    app.run(port=3000)