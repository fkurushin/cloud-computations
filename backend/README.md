```shell
curl -X POST "http://localhost:8000/recognize" 
-H "accept: application/json" 
-H "Content-Type: multipart/form-data" 
-F "audio_file=@/path/to/your/audio/file.wav"
```
