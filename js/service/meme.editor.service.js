'use strict'

let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            txt:'I never eat falafel',
            size: '40',
            align: 'left',
            color: 'white',
            x: 250,
            y: 40
        }
    ]
}

let gCanvas;
let gCtx;

function initCanvas(){
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    const hammerLineUp = new Hammer(document.querySelector('.line-up-btn'));
    hammerLineUp.on('tap', onMoveLineUp)
    const hammerLineDown = new Hammer(document.querySelector('.line-down-btn'));
    hammerLineDown.on('tap', onMoveLineDown)
    const hammerIncreaseFont = new Hammer(document.querySelector('.increase-font'))
    hammerIncreaseFont.on('tap', onIncreaseFont)
    const hammerDecreaseFont = new Hammer(document.querySelector('.decrease-font'))
    hammerDecreaseFont.on('tap', onDecreaseFont)
}

function moveLineUp(ev){
    ev.preventDefault()
    gMeme.lines[0].y--
    renderCanvas()
}

function moveLineDown(){
    gMeme.lines[0].y++
    renderCanvas()
}

function resetMemeModel(){
    gMeme = {
        selectedImgId: 0,
        selectedLineIdx: 0,
        lines: [
            {
                txt:'I never eat falafel',
                size: '40',
                align: 'left',
                color: 'white',
                x: 250,
                y: 40
            }
        ]
    }
    resetInputVal()
}

function  resetInputVal(){
    document.querySelector('.line-input').value = ''
}

function setCurrGMeme(imgId){
    gMeme.selectedImgId = imgId
}

function renderCanvas() {
    gCtx.beginPath()
    var img = new Image()
    img.src = `../../meme-imgs/${gMeme.selectedImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawTxt()
    }
    gCtx.closePath()
}

function drawTxt() {
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = gMeme.lines[0].color
    gCtx.font = `${gMeme.lines[0].size}px impact`
    gCtx.textAlign = 'center'
    gCtx.fillText(gMeme.lines[0].txt, gMeme.lines[0].x, gMeme.lines[0].y)
    gCtx.strokeText(gMeme.lines[0].txt, gMeme.lines[0].x, gMeme.lines[0].y)
    gCtx.closePath()
}

function changeMemeLine(lineTxt){
    gMeme.lines[0].txt = lineTxt
    renderCanvas()
}

function increaseFont(ev) {
    gMeme.lines[0].size++
    renderCanvas()
}

function decreaseFont(ev){
    gMeme.lines[0].size--
    renderCanvas()
}