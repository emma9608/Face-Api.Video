let faces = ['DeLavalleCristian', 'CardozoGustavo', 'OderaMaica', 'BritoIan', 'JimRhodes', 'DeLavalleMaria', 'TonyStark']



Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')

]).then(start)

const video = document.getElementById('video');

async function start() {
    console.log('inició start')
    const labeledFaceDescriptors = await loadLabeledImages()
    console.log('luego await')
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
        setInterval(async() => {
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
            })
        }, 150);
    });
}

async function loadLabeledImages() {
    console.log('inició load')
    const labels = faces
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }


            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })

    )

}