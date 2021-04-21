'use strict'
const STORAGE_KEY = 'memesDB'

let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: -1,
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

let gStartPos
let gElCanvas
let gCtx
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
let gIsMovingLine = false

////////////// INIT AND ADD LISTINERS ////////////////

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addNewEventListeners()
}

function addNewEventListeners() {
    addCanvasListiners()
    addColorsListiners()
}

function addCanvasListiners() {
    addTouceListiners()
    addMouseListiners()
}

function addMouseListiners() {
    gElCanvas.addEventListener('mousemove', onLineMove)
    gElCanvas.addEventListener('mousedown', onLinePressed)
    gElCanvas.addEventListener('mouseup', onPressUp)
}

function addTouceListiners() {
    gElCanvas.addEventListener('touchmove', onLineMove)
    gElCanvas.addEventListener('touchstart', onLinePressed)
    gElCanvas.addEventListener('touchend', onPressUp)
}

function addColorsListiners() {
    document.querySelector('.stroke-color').addEventListener('change', onStrokeColor)
    document.querySelector('.text-color').addEventListener('change', onTextColor)
}

//////////////// RESIZE & DRAWING ///////////////////

function resizeCanvas(width, height) {
    gElCanvas.width = width
    gElCanvas.height = height
}

function drawRect(x, y, line) {
    const lengthOfTxt = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt)
    const halfLength = lengthOfTxt.width / 2
    const height = lengthOfTxt.fontBoundingBoxAscent + lengthOfTxt.fontBoundingBoxDescent
    const width = lengthOfTxt.width
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(x - halfLength - 5, y - parseInt(line.size) + 1, width + 10, height)
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

function resetMemeModel() {
    gMeme = {
        selectedImgId: 0,
        selectedLineIdx: -1,
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
    document.querySelector('.text-color').value = '#ffffff'
    document.querySelector('.stroke-color').value = '#000000'
}

//////////////// SAVE EVENTS //////////

function saveUserMeme(ev) {
    ev.preventDefault()
    gMeme.selectedLineIdx = -1
    renderCanvas()
    setTimeout(() => {
        const memeSrc = getDataUrl()
        gUserMemes.push(memeSrc)
        saveToStorage(STORAGE_KEY, gUserMemes)
        onGallerySelected('user-gallery')
    }, 1)
}


///////////// EDIT EVENTS /////////////////


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

function deleteLine(ev) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
        if(!gMeme.lines.length) gMeme.selectedLineIdx = -1
        renderCanvas()
    }
}


function newLine(ev) {
    ev.preventDefault()
    const newMemeLine = createNewLine()
    gMeme.lines.push(newMemeLine)
    renderCanvas()
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

function createNewLine() {
    return {
        txt: 'I never eat falafel',
        size: '40',
        font: 'impact',
        align: 'center',
        color: 'white',
        stroke: 'black',
        x: gElCanvas.width / 2,
        y: gElCanvas.height / 2
    }
}



///////////////////// TOUCH & MOUSE EVENTS /////////////////

function linePressed(ev) {
    ev.preventDefault()
    const pos = getNewPos(ev)
    lineSelect(ev)
    if (gMeme.selectedLineIdx !== -1) {
        gStartPos = pos
        gIsMovingLine = true
        document.body.style.cursor = 'grabbing'
    }
}

function lineMove(ev) {
    ev.preventDefault()
    if (gIsMovingLine) {
        const pos = getNewPos(ev)
        gMeme.lines[gMeme.selectedLineIdx].x = pos.x
        gMeme.lines[gMeme.selectedLineIdx].y = pos.y
        renderCanvas()
    }
}

function pressUp(ev) {
    ev.preventDefault()
    document.body.style.cursor = 'auto'
    gIsMovingLine = false
}

function lineSelect(ev) {
    const pos = getNewPos(ev)
    const elTxtInput = document.querySelector('.line-input')
    gMeme.selectedLineIdx = gMeme.lines.findIndex((line) => {
        const lengthOfTxt = gCtx.measureText(line.txt)
        const halfLength = lengthOfTxt.width / 2
        const height = lengthOfTxt.fontBoundingBoxAscent + lengthOfTxt.fontBoundingBoxDescent
        return (
            pos.y < line.y &&
            pos.y > line.y - height &&
            pos.x > line.x - halfLength &&
            pos.x < line.x + halfLength
        )
    })
    if (gMeme.selectedLineIdx !== -1) {
        elTxtInput.disabled = false
        elTxtInput.value = gMeme.lines[gMeme.selectedLineIdx].txt
    } else {
        elTxtInput.disabled = true
    }
    renderCanvas()
}



///////////////// GETTERS & SETTERS //////////

function getCanvas() {
    return gElCanvas
}

function getNewPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft ,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop - 90
        }
    }
    return pos
}

function getMemeGlobal() {
    return gMeme
}

function setCurrGMeme(imgId) {
    gMeme.selectedImgId = imgId
}

function getDataUrl() {
    return gElCanvas.toDataURL()
}




