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
            stroke: 'black',
            x: 250,
            y: 40
        },
        {
            txt:'I never eat falafel3',
            size: '40',
            align: 'left',
            color: 'white',
            stroke: 'black',
            x: 250,
            y: 250
        }
    ]
}


let gCanvas;
let gCtx;

function initCanvas(){
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    const hammerCanvas = new Hammer(gCanvas)
    hammerCanvas.on('tap', onLineSelect)
    const hammerLineUp = new Hammer(document.querySelector('.line-up-btn'));
    hammerLineUp.on('tap', onMoveLineUp)
    const hammerLineDown = new Hammer(document.querySelector('.line-down-btn'));
    hammerLineDown.on('tap', onMoveLineDown)
    const hammerIncreaseFont = new Hammer(document.querySelector('.increase-font'))
    hammerIncreaseFont.on('tap', onIncreaseFont)
    const hammerDecreaseFont = new Hammer(document.querySelector('.decrease-font'))
    hammerDecreaseFont.on('tap', onDecreaseFont)
}

function lineSelect(ev){
    ev.preventDefault()
    resetInputVal()
    gMeme.lines.forEach(line => {
        line.stroke = 'black'
    })
    gMeme.selectedLineIdx = gMeme.lines.findIndex( (line) => {
        return (
            ev.changedPointers[0].offsetY < line.y &&
            ev.changedPointers[0].offsetY > line.y - line.size
            )
        })
        if(gMeme.selectedLineIdx !== -1) {
            gMeme.lines[gMeme.selectedLineIdx].stroke = 'red'
        } else {
            gMeme.lines.forEach(line => {
                line.stroke = 'black'
            })
        }
        renderCanvas()
}

function moveLineUp(ev){
    ev.preventDefault()
    gMeme.lines[gMeme.selectedLineIdx].y--
    renderCanvas()
}

function moveLineDown(){
    gMeme.lines[gMeme.selectedLineIdx].y++
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
    gMeme.lines.forEach(line => {
        gCtx.lineWidth = 2
        gCtx.strokeStyle = line.stroke
        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px impact`
        gCtx.textAlign = 'center'
        gCtx.fillText(line.txt, line.x, line.y)
        gCtx.strokeText(line.txt, line.x, line.y)
    })
    gCtx.closePath()
}

function changeMemeLine(lineTxt){
    gMeme.lines[gMeme.selectedLineIdx].txt = lineTxt
    renderCanvas()
}

function increaseFont(ev) {
    gMeme.lines[gMeme.selectedLineIdx].size++
    renderCanvas()
}

function decreaseFont(ev){
    gMeme.lines[gMeme.selectedLineIdx].size--
    renderCanvas()
}