from pymongo import MongoClient
from pymongo import ObjectId
import gridfs

class DataBaseClient():
    def __init__(name, connect_nw = 'localhost', connect_port = 27017):
        self.name = name
        self.client = MongoClient(connect_nw, connect_port)
        self.db = self.client[f"{self.name}"]
        self.collection = self.db[f'{self.name}']
        self.fs = gridfs.GridFS(self.db)

    def write(self, date : str, audio_data : str, transcription : str, score : int, advice : str) -> bool:
        document = {
            "date": date,
            "audio_data": audio_data,        
            "transcription": transcription,
            "score": score,
            "advice": advice
        }

        result = self.collection.insert_one(document)
        if result.acknowledged: print('Success')
        else: print('Error adding data')
        return result.inserted_id

    def write_audio_to_gridfs(self, audio_data, filename="audio_file.mp3"):
        audio_id = self.fs.put(audio_data, filename=filename)
        return str(audio_id)

    def read_audio_from_gridfs(self, audio_id = None, audio_data : str = None):
        if not audio_id and not audio_data: 
            print('No data to fetch')
            return False
        else if audio_id: audio_data = self.fs.get(ObjectId(audio_id))
        return audio_data.read()

    def read(self, audio_data : str = None, audio_id : str = None):
        if not audio_data and not audio_id: 
            print('No data to fetch')
            return False
        else if audio_data:
            document = self.collection.find_one({"audio_data": audio_data})
        else if audio_id:
            document = self.collection.find_one({"_id": ObjectId(audio_id)})
        return document