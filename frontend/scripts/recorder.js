let mediaRecorder;
let recordedChunks = [];

document.getElementById('start').addEventListener('click', () => {
   navigator.mediaDevices.getUserMedia({ audio: true })
       .then((stream) => {
           mediaRecorder = new MediaRecorder(stream);
           mediaRecorder.ondataavailable = (event) => {
               if (event.data.size > 0) {
                  recordedChunks.push(event.data);
               }
           };
           mediaRecorder.start();
           document.getElementById('stop').disabled = false;
       });
});

document.getElementById('stop').addEventListener('click', () => {
    mediaRecorder.stop();
    const blob = new Blob(recordedChunks, { type: 'audio/wav' });
  
    let formData = new FormData();
    formData.append("audio_file", blob, "decoder-test.wav");
    // INFO:     192.168.65.1:49457 - "POST /recognize HTTP/1.1" 500 Internal Server Error
    fetch('http://localhost:8080/recognize', {
       method: 'POST',
       body: formData
    }).then(response => {
       console.log(response);
    }).catch(error => {
       console.error(error);
    });
  
    document.getElementById('stop').disabled = true;
  });
  
