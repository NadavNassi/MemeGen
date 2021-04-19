'use strict'

const gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            txt:'I never eat falafel',
            size: '40',
            align: 'left',
            color: 'red'
        }
    ]
}

let gCanvas;
let gCtx;

function initCanvas(){
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
}

function setSelectedImg(imgId){
    gMeme.selectedImgId = imgId
}

function drawImg(selectedImg) {
    gCtx.beginPath()
    var img = new Image()
    img.src = selectedImg.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
    gCtx.closePath()
}

function drawTxt() {
    gCtx.beginPath()
    gCtx.lineWidth = 10
    gCtx.strokeStyle = 'red'
    gCtx.fillStyle = 'white'
    gCtx.font = `${gMeme.lines[0].size}px impact`
    gCtx.textAlign = 'center'
    gCtx.fillText('safa sdas asdf dsfaed rfaed asd', 250, 250)
    gCtx.strokeText('safa sdas asdf dsfaed rfaed asd', 250, 250)
    gCtx.closePath()
}