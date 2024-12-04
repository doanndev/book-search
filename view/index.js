const searchIcon = document.querySelector('.search-button');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const searchInput = document.getElementById('searchInput');
const results = document.getElementById('results');
const transcription = document.querySelector('#transcription')
const record = document.getElementById('record');
const stopRecord = document.getElementById('stopRecord')


let rec;
let audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        rec = new MediaRecorder(stream);
        rec.ondataavailable = e => {
            audioChunks.push(e.data);
            if (rec.state === "inactive") {
                const blob = new Blob(audioChunks, { type: 'audio/webm' }); // Record as webm
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const audioData = event.target.result;
                    // Send data to the server
                    sendData(audioData);
                };
                reader.readAsArrayBuffer(blob);
            }
        };
    });

async function sendData(audioData) {
    const formData = new FormData();
    formData.append("audio", new Blob([audioData], { type: 'audio/webm' }), "audio.webm");
    console.log(formData);
    let script=""
    fetch("http://127.0.0.1:8000/transcription/", {
        method: "POST",
        mode: "cors",
        body: formData,
        headers: {
            "X-CSRFToken": "{{ csrf_token }}"
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("transcription").innerText = data.transcript;
            console.log("Transcription: ", data.transcript);
            if (data.transcript != 'Could not understand the audio.') {
              searchInput.value = `${data.transcript}`
              search()
            }
            
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('record').onclick = () => {
    document.getElementById('record').disabled = true;
    record.style.display = 'none'
    stopRecord.style.display  = 'block'
    document.getElementById('stopRecord').disabled = false;
    audioChunks = [];
    rec.start();
};

document.getElementById('stopRecord').onclick = () => {
    document.getElementById('record').disabled = false;
    record.style.display = 'block'
    stopRecord.style.display  = 'none'
    document.getElementById('stopRecord').disabled = true;
    rec.stop();
};
searchIcon.addEventListener('click', () => {
    overlay.style.display = 'block';
    modal.style.display = 'block';
  });



  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    modal.style.display = 'none';
    searchInput.value = '';
    results.innerHTML = '';
    transcription.innerHTML = '';
  });


  searchInput.addEventListener('input', async () => {
    search()
  });


  async function search() {
    const res = await fetch(`http://localhost:3001/api/search?query=${searchInput.value}`)
    const data = await res.json()
    console.log(data);
    
    if (data) {
        let content = ''
            data.forEach(item => {
                content += `
                <li> 
                <h3> <span class="strong-text">title:</span> ${item.title} </h3>
                <h5> <span class="strong-text">author:</span> ${item.author} </h5>
                <p> <span class="strong-text">description:</span> ${item.description} </p>
                </li>
                `
            });
            results.innerHTML = content;
    } else {
      results.innerHTML = '';
    }
  }