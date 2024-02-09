const record = document.querySelector(".record");
const stopButton = document.querySelector(".stop");
const soundClips = document.querySelector(".sound-clips");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    // Navigator Интерфейc представляет состояние и особенности пользовательского агента. 
    // Он позволяет скриптам запрашивать их и самостоятельно регистрироваться для выполнения 
    // некоторых действий.
    navigator.mediaDevices
        .getUserMedia(
            // if only audio needed
            {
                audio: true,
            },
        )
    
        // success callback
        // Callback - это функция, которая передается в качестве аргумента в другую 
        // функцию и вызывается после выполнения определенных действий. В данном случае, 
        // `then()` и `catch()` являются методами объекта `Promise`, которые принимают функции
        //  обратного вызова в качестве аргументов.
        // pass стрелочную функцию 
        // https://developer.mozilla.org/ru/docs/Web/API/MediaDevices/getUserMedia
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            
            // visualize(stream);
            
            record.onclick = () => {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                record.style.background = "red";
                record.style.color = "black";
            };
            
            let chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            stopButton.onclick = () => {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
                record.style.background = "";
                record.style.color = "";
              };
            
            mediaRecorder.onstop = (e) => {
            console.log("recorder stopped");
            console.log("recorder stopped");

            const clipName = prompt("Enter a name for your sound clip");

            const clipContainer = document.createElement("article");
            const clipLabel = document.createElement("p");
            const audio = document.createElement("audio");
            const deleteButton = document.createElement("button");

            clipContainer.classList.add("clip");
            audio.setAttribute("controls", "");
            deleteButton.innerHTML = "Delete";
            clipLabel.innerHTML = clipName;

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API#basic_app_setup
            
            const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            
            const formData = new FormData();
            const blob_ = new Blob(chunks, { type : 'audio/wav' });
            chunks = [];
            formData.append('file', blob_, 'test.wav');

            fetch('http://localhost:8080/recognize', {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            }).then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
            });
            
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;

            deleteButton.onclick = (e) => {
                let evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            };
            };
            

        })

        // error callback
        .catch((err)  => {
            console.error(`The following getUserMedia error occurred: ${err}`);
        });
} else {
    console.log("getUserMEdia not supported on your browser!");
}
  


// i wrote js frontend and python backend, when i send request to a back i ve got error:

// [Error] Preflight response is not successful. Status code: 405
// [Error] Fetch API cannot load http://localhost:8080/recognize due to access control checks.
// [Error] Failed to load resource: Preflight response is not successful. Status code: 405 (recognize, line 0)