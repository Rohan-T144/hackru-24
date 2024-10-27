from flask import Flask, jsonify, request, send_file
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
import gridfs
from datetime import datetime
import io

app = Flask(__name__)
CORS(app)

# In-memory store for user-specific clients
user_clients = {}

# Database setup
class DataBaseClient():
    def __init__(self, name, connect_nw='localhost', connect_port=27017):
        self.name = name
        self.client = MongoClient(connect_nw, connect_port)
        self.db = self.client[f"{self.name}"]
        self.collection = self.db[f'{self.name}']
        self.fs = gridfs.GridFS(self.db)

    def write(self, project, audio_name, transcription, score, advice, audio_data=None, date=None):
        date = date or datetime.today().date().strftime("%Y-%m-%d")
        
        if not audio_data:
            document = {
                "date": date,
                "project": project,
                "audio_name": audio_name,        
                "transcription": transcription,
                "score": score,
                "advice": advice,
                "audio_id": None,
            } 
        else:
            audio_id = self.write_audio_to_gridfs(audio_data)
            document = {
                "date": date,
                "project": project,
                "audio_name": audio_name,        
                "transcription": transcription,
                "score": score,
                "advice": advice,
                "audio_id": audio_id
            } 

        result = self.collection.insert_one(document)
        return result.inserted_id if result.acknowledged else None

    def write_audio_to_gridfs(self, audio_data, filename="audio_file.mp3"):
        audio_id = self.fs.put(audio_data, filename=filename)
        return str(audio_id)

    def read_audio_from_gridfs(self, audio_id):
        if audio_id:
            audio_data = self.fs.get(ObjectId(audio_id))
            return audio_data.read()
        return None

    def read_document(self, doc_id):
        return self.collection.find_one({"_id": ObjectId(doc_id)})

# Create new user and initialize their database client
@app.route('/api/create_user', methods=['POST'])
def create_user():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    if user_id in user_clients:
        return jsonify({"error": "User already exists"}), 409

    user_clients[user_id] = DataBaseClient(name=user_id)
    return jsonify({"success": True, "message": f"User {user_id} created successfully"}), 201

# Example endpoint that uses a specific user's database
@app.route('/api/<user_id>/document', methods=['POST'])
def create_user_document(user_id):
    if user_id not in user_clients:
        return jsonify({"error": "User not found"}), 404
    
    data = request.json
    project = data['project']
    audio_name = data['audio_name']
    transcription = data['transcription']
    score = data['score']
    advice = data['advice']
    date = data.get('date', datetime.today().date().strftime("%Y-%m-%d"))

    audio_data = None
    if 'audio_data' in request.files:
        audio_data = request.files['audio_data'].read()

    doc_id = user_clients[user_id].write(project, audio_name, transcription, score, advice, audio_data, date)
    if doc_id:
        return jsonify({"success": True, "id": str(doc_id)}), 201
    else:
        return jsonify({"success": False, "error": "Document could not be created"}), 500

# Fetch document for a specific user
@app.route('/api/<user_id>/document/<doc_id>', methods=['GET'])
def get_user_document(user_id, doc_id):
    if user_id not in user_clients:
        return jsonify({"error": "User not found"}), 404

    document = user_clients[user_id].read_document(doc_id)
    if document:
        document['_id'] = str(document['_id'])
        if document.get('audio_id'):
            document['audio_id'] = str(document['audio_id'])
        return jsonify(document)
    else:
        return jsonify({"error": "Document not found"}), 404

if __name__ == '__main__':
    app.run(port=5000)