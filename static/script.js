let faces = ['DelavalleCristian', 'CardozoGustavo', 'OderaMaica', 'BritoIan', 'JimRhodes', 'DeLavalleMaria', 'TonyStark']
Promise.all([

    faceapi.nets.tinyFaceDetector.loadFromUri('static/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('static/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('static/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('static/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('static/models')
]).then(start)
const video = document.getElementById('video');
async function start() {
    console.log('inició start')
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    video: true
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.log(err)
    )

    console.log('inició startvideo')
    video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        console.log('inició play')
        document.body.append(canvas);
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);
        const timeValue = setInterval(async() => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors();
            const dist = faceapi.euclideanDistance([0, 0], [0, 10])
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            results.forEach((result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
                const dist = faceapi.euclideanDistance([0, 0], [0, 10])
                    // esto es lo que tenés que mandar -- console.log(result.toString())
                const nombre = result.toString().substring(0, result.toString().length - 7);
                if (nombre !== 'unknown') {
                    var url = 'http://localhost:5500/sendphotos';
                    var data = { username: result.toString() };

                    fetch(url, {
                            method: 'POST', // or 'PUT'
                            body: JSON.stringify(data), // data can be `string` or {object}!
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(res => res.json())
                        .catch(error => console.error('Error:', error))
                        .then(response => console.log('Success:', response));
                    clearInterval(timeValue)
                    return
                }




            })
        }, 4000);
    });
}


async function loadLabeledImages() {
    console.log('inició load')
    const labels = faces
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/emma9608/Face-Api.Video/master/static/labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }


            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })

    )

}