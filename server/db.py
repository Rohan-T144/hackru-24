from pymongo import MongoClient
from bson import ObjectId
import gridfs
from datetime import datetime
import librosa


class DataBaseClient:
    def __init__(self, connect_nw="localhost", connect_port=27017):
        self.name = "hackru-2024"
        self.client = MongoClient(connect_nw, connect_port)
        self.db = self.client[f"{self.name}"]
        self.collection = self.db[f"{self.name}"]
        self.fs = gridfs.GridFS(self.db)

    def write(
        self,
        user_id: str,
        project: str,
        audio_id,
        audio_name: str,
        transcription: str,
        score: int,
        advice: str,
        audio_data=None,
        date: str = datetime.today().date().strftime("%Y-%m-%d"),
    ) -> bool:
        if not audio_data:
            document = {
                "user_id": user_id,
                "date": date,
                "audio_id": audio_id,
                "project": project,
                "audio_name": audio_name,
                "transcription": transcription,
                "score": score,
                "advice": advice,
                "audio_id": 0,
            }
        else:
            result = self.write_audio_to_gridfs(audio_data)
            document = {
                "user_id": user_id,
                "date": date,
                "project": project,
                "audio_id": audio_id,
                "audio_name": audio_name,
                "transcription": transcription,
                "score": score,
                "advice": advice,
                "audio_id": result,
            }

        result = self.collection.insert_one(document)
        if result.acknowledged:
            print("Success")
        else:
            print("Error adding data")
        return result.inserted_id

    def write_audio_to_gridfs(self, audio_data, filename="audio_file.mp3"):
        try:
            # audio_id = self.fs.put(audio_data, filename=filename)
            audio_id = '123'
            # pass
        except:
            audio_id = '123'
            # with open(audio_data, "rb") as audio_file:
            #     audio_id = self.fs.put(audio_file, filename=filename)
        return str(audio_id)

    def read_audio_from_gridfs(self, audio_id=None):
        if not audio_id:
            print("No data to fetch")
            return False
        elif audio_id:
            audio_data = self.fs.get(ObjectId(audio_id))
        return audio_data.read()

    def read(self, audio_data: str = None, audio_id: str = None):
        if not audio_data and not audio_id:
            print("No data to fetch")
            return False
        elif audio_data:
            document = self.collection.find_one({"audio_data": audio_data})
        elif audio_id:
            document = self.collection.find_one({"_id": ObjectId(audio_id)})
        return document

    def read_project(self, project_name, user_id):
        if user_id not in self.client.get_collection.distinct("user_id"):
            return False
        elif project_name not in self.client.get_collection.distinct("project"):
            return False
        query = {"user_id": user_id, "project": project_name}
        documents = list(self.client.get_collection().find(query))
        return documents

    def get_collection(self):
        return self.collection


# if __name__ == "__main__":
#     client = DataBaseClient("mongodb://127.0.0.1:27017")
#     client.write(
#         "test", "sample1",  9, "tessst", "bad talking", 8, 'be better', "/Users/rohan/Downloads/sample-3s.mp3",
#     )
#     client.read_project("sample1", "test")
#     # print(client.read_audio_from_gridfs("671d509b848f147a7a2de3f4"))
