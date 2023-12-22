from vosk import Model, KaldiRecognizer
from fastapi import FastAPI, UploadFile, File
import os
import wave
from contextlib import asynccontextmanager


def load_all_models():
    global model
    global rec
    model = Model(lang="ru")
    # model = Model("/Users/fedorkurusin/Documents/cloud-computations/backend/vosk-model-ru-0.42")
    # model = Model("/Users/fedorkurusin/Documents/cloud-computations/backend/vosk-model-small-ru-0.22")
    rec = KaldiRecognizer(model, 16000)


def clear_all_models():
    pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_all_models()
    yield
    clear_all_models()


app = FastAPI(
    title="VOSK SERVER",
    description="VOSK SERVER FOR AUDIO TRANSCRIPTION APPLICATION",
    lifespan=lifespan)


@app.get("/health")
async def root():
    return {"message": "OK"}


def recognize_speech(audio_file_path):
    with wave.open(audio_file_path, "rb") as wf:
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                print(rec.Result())
            else:
                print(rec.PartialResult())
    return rec.FinalResult()


@app.post("/recognize")
async def recognize(audio_file: UploadFile = File(...)):
    audio_file_path = f"{audio_file.filename}"
    with open(audio_file_path, "wb") as buffer:
        buffer.write(await audio_file.read())
        transcription = recognize_speech(audio_file_path)
        os.remove(audio_file_path)
        return {
            "transcription": transcription
        }
