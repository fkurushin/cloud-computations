from vosk import Model, KaldiRecognizer
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
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

# Configure CORS 
origins = ["*"
    # "http://localhost",
    # "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

def load_binary(blob):
    with wave.open("tmp.wav", "wb") as wf:
        # inspected manually
        # _wave_params(nchannels=1, sampwidth=2, framerate=8000, nframes=56640, comptype='NONE', compname='not compressed')
        wf.setparams((1, 2, 8000, 56640,'NONE', 'not compressed'))
        wf.writeframes(blob)

# @app.post("/recognize")
# async def recognize(file: UploadFile = File(...)):
#     audio_file_path = f"{file.filename}"
#     with open(audio_file_path, "wb") as buffer:
#         buffer.write(await file.read())
#         load_binary(file.file.read())
#         transcription = recognize_speech(audio_file_path)
#         os.remove(audio_file_path)
#         return {
#             "transcription": transcription
#         }


@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    # Save the uploaded file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    with wave.open(file_path, "rb") as wf:
        print(wf.getparams())
    # Perform recognition logic here
    # ...

    return {"message": "Recognition completed successfully"}