const startScreen =
    document.getElementById("startScreen");

const cameraScreen =
    document.getElementById("cameraScreen");

const resultScreen =
    document.getElementById("resultScreen");


const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const printButton =
    document.getElementById("printButton");

const switchCameraButton =
    document.getElementById(
        "switchCameraButton"
    );


const camera =
    document.getElementById("camera");

const countdown =
    document.getElementById("countdown");

const flash =
    document.getElementById("flash");

const status =
    document.getElementById("status");

const result =
    document.getElementById("result");

const selectedStyle =
    document.getElementById(
        "selectedStyle"
    );


/* CAMERA */

let cameraStream;

let facingMode = "user";


/* PHOTOS */

let photos = [];

let photoStrip;


/* TEMPLATE */

let selectedTemplate =
    "classic";


/* -------------------------
   TEMPLATE SELECTION
------------------------- */

const templateButtons =
    document.querySelectorAll(
        ".template-button"
    );


templateButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            templateButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            selectedTemplate =
                button.dataset.template;


            if (
                selectedTemplate ===
                "classic"
            ) {

                selectedStyle.textContent =
                    "Selected: Classic 🤍";

            }


            if (
                selectedTemplate ===
                "party"
            ) {

                selectedStyle.textContent =
                    "Selected: Party 🎉";

            }


            if (
                selectedTemplate ===
                "elegant"
            ) {

                selectedStyle.textContent =
                    "Selected: Elegant ✨";

            }

        }
    );

});


/* -------------------------
   START BOOTH
------------------------- */

startButton.addEventListener(
    "click",
    startCamera
);


async function startCamera() {

    try {

        photos = [];

        result.innerHTML = "";


        startScreen.classList.remove(
            "active"
        );

        resultScreen.classList.remove(
            "active"
        );

        cameraScreen.classList.add(
            "active"
        );


        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode:
                            facingMode
                    },

                    audio: false

                });


        camera.srcObject =
            cameraStream;


        await camera.play();


        status.textContent =
            "Get ready!";


        await wait(1000);


        await takePhotoSequence();


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        alert(
            "We couldn't access your camera. Please allow camera access."
        );


        cameraScreen.classList.remove(
            "active"
        );

        startScreen.classList.add(
            "active"
        );

    }

}


/* -------------------------
   SWITCH CAMERA
------------------------- */

switchCameraButton.addEventListener(
    "click",
    switchCamera
);


async function switchCamera() {

    facingMode =
        facingMode === "user"
            ? "environment"
            : "user";


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

    }


    try {

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode:
                            facingMode
                    },

                    audio: false

                });


        camera.srcObject =
            cameraStream;


        await camera.play();


    } catch (error) {

        console.error(
            "Camera switch failed:",
            error
        );

    }

}


/* -------------------------
   TAKE 4 PHOTOS
------------------------- */

async function takePhotoSequence() {

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        status.textContent =
            `Photo ${i + 1} of 4`;


        await countdownTimer();


        const photo =
            capturePhoto();


        photos.push(photo);


        await wait(1500);

    }


    finishSession();

}


/* -------------------------
   COUNTDOWN
------------------------- */

function countdownTimer() {

    return new Promise(resolve => {

        let number = 3;


        countdown.textContent =
            number;


        const timer =
            setInterval(() => {

                number--;


                if (number > 0) {

                    countdown.textContent =
                        number;

                } else {

                    clearInterval(
                        timer
                    );


                    countdown.textContent =
                        "";


                    resolve();

                }

            }, 1000);

    });

}


/* -------------------------
   CAPTURE PHOTO
------------------------- */

function capturePhoto() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        camera.videoWidth;

    canvas.height =
        camera.videoHeight;


    const context =
        canvas.getContext(
            "2d"
        );


    /* Mirror selfie camera */

    if (
        facingMode === "user"
    ) {

        context.translate(
            canvas.width,
            0
        );

        context.scale(
            -1,
            1
        );

    }


    context.drawImage(
        camera,
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* FLASH */

    flash.style.opacity =
        "1";


    setTimeout(() => {

        flash.style.opacity =
            "0";

    }, 200);


    return canvas.toDataURL(
        "image/jpeg",
        0.95
    );

}


/* -------------------------
   FINISH SESSION
------------------------- */

function finishSession() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

    }


    status.textContent =
        "🎉 Your photo strip is ready!";


    createPhotoStrip();

}


/* -------------------------
   CREATE PHOTO STRIP
------------------------- */

async function createPhotoStrip() {

    const imageWidth = 600;

    const imageHeight = 450;

    const padding = 30;

    const gap = 20;

    const footerHeight = 150;


    const stripWidth =
        imageWidth +
        padding * 2;


    const stripHeight =
        padding +
        (imageHeight * 4) +
        (gap * 3) +
        footerHeight +
        padding;


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        stripWidth;

    canvas.height =
        stripHeight;


    const context =
        canvas.getContext(
            "2d"
        );


    /* BACKGROUND */

    if (
        selectedTemplate ===
        "classic"
    ) {

        context.fillStyle =
            "#ffffff";

    }


    if (
        selectedTemplate ===
        "party"
    ) {

        context.fillStyle =
            "#171717";

    }


    if (
        selectedTemplate ===
        "elegant"
    ) {

        context.fillStyle =
            "#f4eee4";

    }


    context.fillRect(
        0,
        0,
        stripWidth,
        stripHeight
    );


    /* PHOTOS */

    for (
        let i = 0;
        i < photos.length;
        i++
    ) {

        const image =
            await loadImage(
                photos[i]
            );


        const y =
            padding +
            i *
            (
                imageHeight +
                gap
            );


        context.drawImage(
            image,
            padding,
            y,
            imageWidth,
            imageHeight
        );


        /* PHOTO BORDER */

        if (
            selectedTemplate ===
            "classic"
        ) {

            context.strokeStyle =
                "#222222";

            context.lineWidth =
                6;

        }


        if (
            selectedTemplate ===
            "party"
        ) {

            context.strokeStyle =
                "#ffffff";

            context.lineWidth =
                4;

        }


        if (
            selectedTemplate ===
            "elegant"
        ) {

            context.strokeStyle =
                "#b59b6a";

            context.lineWidth =
                5;

        }


        context.strokeRect(
            padding,
            y,
            imageWidth,
            imageHeight
        );

    }


    /* PARTY DECORATIONS */

    if (
        selectedTemplate ===
        "party"
    ) {

        const dots = [

            [35, 20],
            [570, 20],
            [25, stripHeight - 25],
            [575, stripHeight - 25],
            [300, stripHeight - 35]

        ];


        dots.forEach(
            ([x, y], index) => {

                const colours = [

                    "#ff4d6d",
                    "#ffd166",
                    "#06d6a0",
                    "#4dabf7",
                    "#c77dff"

                ];


                context.fillStyle =
                    colours[index];


                context.beginPath();


                context.arc(
                    x,
                    y,
                    12,
                    0,
                    Math.PI * 2
                );


                context.fill();

            }
        );

    }


    /* FOOTER */

    if (
        selectedTemplate ===
        "party"
    ) {

        context.fillStyle =
            "#ffffff";

    } else {

        context.fillStyle =
            "#222222";

    }


    context.textAlign =
        "center";


    /* TITLE FONT */

    if (
        selectedTemplate ===
        "classic"
    ) {

        context.font =
            "bold 42px Arial";

    }


    if (
        selectedTemplate ===
        "party"
    ) {

        context.font =
            "bold 44px Arial";

    }


    if (
        selectedTemplate ===
        "elegant"
    ) {

        context.font =
            "italic bold 42px Georgia";

    }


    context.fillText(
        "Ronah’s Booth",
        stripWidth / 2,
        stripHeight - 65
    );


    /* DATE */

    context.font =
        "20px Arial";


    const date =
        new Date()
            .toLocaleDateString();


    context.fillText(
        date,
        stripWidth / 2,
        stripHeight - 30
    );


    /* ELEGANT BORDER */

    if (
        selectedTemplate ===
        "elegant"
    ) {

        context.strokeStyle =
            "#b59b6a";

        context.lineWidth =
            12;


        context.strokeRect(
            8,
            8,
            stripWidth - 16,
            stripHeight - 16
        );

    }


    /* CLASSIC BORDER */

    if (
        selectedTemplate ===
        "classic"
    ) {

        context.strokeStyle =
            "#222222";

        context.lineWidth =
            8;


        context.strokeRect(
            8,
            8,
            stripWidth - 16,
            stripHeight - 16
        );

    }


    /* PARTY BORDER */

    if (
        selectedTemplate ===
        "party"
    ) {

        context.strokeStyle =
            "#ffffff";

        context.lineWidth =
            8;


        context.setLineDash([
            15,
            10
        ]);


        context.strokeRect(
            8,
            8,
            stripWidth - 16,
            stripHeight - 16
        );


        context.setLineDash([]);

    }


    /* SAVE STRIP */

    photoStrip =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );


    /* SHOW STRIP */

    result.innerHTML = "";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        photoStrip;


    result.appendChild(
        image
    );


    cameraScreen.classList.remove(
        "active"
    );

    resultScreen.classList.add(
        "active"
    );

}


/* -------------------------
   LOAD IMAGE
------------------------- */

function loadImage(src) {

    return new Promise(resolve => {

        const image =
            new Image();


        image.onload =
            () => resolve(image);


        image.src =
            src;

    });

}


/* -------------------------
   PRINT
------------------------- */

printButton.addEventListener(
    "click",
    printPhotoStrip
);


function printPhotoStrip() {

    const printWindow =
        window.open("");


    printWindow.document.write(`

        <html>

        <head>

            <title>
                Ronah’s Booth
            </title>

            <style>

                body {

                    margin: 0;

                    display: flex;

                    justify-content: center;

                }

                img {

                    width: 4in;

                }

            </style>

        </head>

        <body>

            <img
                src="${photoStrip}"
            >

        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.onload = () => {

        printWindow.focus();

        printWindow.print();

    };

}


/* -------------------------
   TAKE ANOTHER
------------------------- */

restartButton.addEventListener(
    "click",
    () => {

        resultScreen.classList.remove(
            "active"
        );

        startScreen.classList.add(
            "active"
        );

    }
);


/* -------------------------
   WAIT
------------------------- */

function wait(milliseconds) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}