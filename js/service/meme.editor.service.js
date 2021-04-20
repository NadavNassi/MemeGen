'use strict'
const STORAGE_KEY = 'memesDB'

let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat falafel',
            size: '40',
            font: 'impact',
            align: 'center',
            color: 'white',
            stroke: 'black',
            x: 250,
            y: 40
        }
    ]
}


let gCanvas;
let gCtx;

let gIsMovingLine = false

function initCanvas() {
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    
    addNewEventListeners()
}

function addNewEventListeners() {
    var hammertime = new Hammer(gCanvas);
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on('panstart', onLinePressed)
    hammertime.on('pan', onLineMove)
    hammertime.on('panend', onPressUp)
    hammertime.on('tap', onLineSelect)
    const hammerIncreaseFont = new Hammer(document.querySelector('.increase-font'))
    hammerIncreaseFont.on('tap', onIncreaseFont)
    const hammerDecreaseFont = new Hammer(document.querySelector('.decrease-font'))
    hammerDecreaseFont.on('tap', onDecreaseFont)
    const hammerNewLine = new Hammer(document.querySelector('.new-line-btn'))
    hammerNewLine.on('tap', onNewLine)
    const hammerDeleteLine = new Hammer(document.querySelector('.delete-line-btn'))
    hammerDeleteLine.on('tap', onDeleteLine)
    const hammerSaveBtn = new Hammer(document.querySelector('.save-btn'))
    hammerSaveBtn.on('tap', onSaveBtn)
    document.querySelector('.stroke-color').addEventListener('change', onStrokeColor)
    document.querySelector('.text-color').addEventListener('change', onTextColor)
}



function resizeCanvas(width, height){
    gCanvas.width = width
    gCanvas.height = height
}

function saveUserMeme(ev) {
    ev.preventDefault()
    const memeSrc = getDataUrl()  
    gUserMemes.push(memeSrc)
    saveToStorage(STORAGE_KEY, gUserMemes)
    onGallerySelected('user-gallery')
}

function getDataUrl(){
    return gCanvas.toDataURL()
}


function changeFontFam(fontSelected) {
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].font = fontSelected
        renderCanvas()
    }
}

function changeAlign(selectedAlign) {
    gMeme.lines[gMeme.selectedLineIdx].align = selectedAlign
    renderCanvas()
}

function changeTextColor(ev, selectedTextColor) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].color = selectedTextColor
        renderCanvas()
    }
}

function changeStrokeColor(ev, selectedStrokeColor) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].stroke = selectedStrokeColor
        renderCanvas()
    }
}

function getMemeGlobal() {
    return gMeme
}

function deleteLine(ev) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
        renderCanvas()
    }
}

function newLine(ev) {
    ev.preventDefault()
    const newMemeLine = createNewLine()
    gMeme.lines.push(newMemeLine)
    renderCanvas()
}

function linePressed(ev) {
    ev.preventDefault()
    lineSelect(ev)
    if (gMeme.selectedLineIdx !== -1) {
        gIsMovingLine = true
    }
}

function lineMove(ev) {
    ev.preventDefault()
    if (gIsMovingLine) {
        gMeme.lines[gMeme.selectedLineIdx].x = ev.changedPointers[0].offsetX
        gMeme.lines[gMeme.selectedLineIdx].y = ev.changedPointers[0].offsetY
        renderCanvas()
    }
}

function pressUp(ev) {
    ev.preventDefault()
    gIsMovingLine = false
}

function lineSelect(ev) {
    ev.preventDefault()
    gMeme.selectedLineIdx = gMeme.lines.findIndex((line) => {
        return (
            ev.changedPointers[0].offsetY < line.y &&
            ev.changedPointers[0].offsetY > line.y - line.size
        )
    })
    renderCanvas()
}

function drawRect(x, y, line) {
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(1, y - parseInt(line.size) + 1, gCanvas.width - 1, 50)
    gCtx.closePath()
}

function createNewLine() {
    return {
        txt: 'I never eat falafel',
        size: '40',
        font: 'impact',
        align: 'center',
        color: 'white',
        stroke: 'black',
        x: gCanvas.width / 2,
        y: gCanvas.height / 2
    }
}



function resetMemeModel() {
    gMeme = {
        selectedImgId: 0,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'I never eat falafel',
                size: '40',
                align: 'center',
                font: 'impact',
                color: 'white',
                stroke: 'black',
                x: 250,
                y: 40
            }
        ]
    }
    resetInputVal()
}

function resetInputVal() {
    document.querySelector('.line-input').value = ''
}

function setCurrGMeme(imgId) {
    gMeme.selectedImgId = imgId
}

function renderCanvas() {
    gCtx.beginPath()
    var img = new Image()
    img.src = `../../meme-imgs/${gMeme.selectedImgId}.jpg`;
    img.onload = () => {
        resizeCanvas(img.width, img.height)
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawTxt()
        if (gMeme.selectedLineIdx !== -1) drawRect(gMeme.lines[gMeme.selectedLineIdx].x, gMeme.lines[gMeme.selectedLineIdx].y, gMeme.lines[gMeme.selectedLineIdx])
        else resetInputVal()
    }
    gCtx.closePath()
}

function drawTxt() {
    gCtx.beginPath()
    gMeme.lines.forEach(line => {
        gCtx.lineWidth = 2
        gCtx.strokeStyle = line.stroke
        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.textAlign = line.align
        gCtx.fillText(line.txt, line.x, line.y)
        gCtx.strokeText(line.txt, line.x, line.y)
    })
    gCtx.closePath()
}

function changeMemeLine(lineTxt) {
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].txt = lineTxt
        renderCanvas()
    }
}

function increaseFont(ev) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].size++
        renderCanvas()
    }
}

function decreaseFont(ev) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].size--
        renderCanvas()
    }
}
