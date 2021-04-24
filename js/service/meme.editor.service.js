'use strict'
const STORAGE_KEY = 'memesDB'

//////////////DO NOT TOUCH!!!!/////////////
const BREAK_POINT = 740
///////////////////////////////////////////

let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    editMeme: false,
    lines: [
        {
            txt: 'I never eat falafel',
            size: '40',
            align: 'center',
            font: 'impact',
            color: 'white',
            stroke: 'black',
            rotate: 0,
            x: 250,
            y: 40
        }
    ]
};

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

//////////////// RESIZE ///////////////////

function resizeCanvas(img) {
    const width = (window.innerWidth < BREAK_POINT) ? 250 : img.width
    const height = (window.innerWidth < BREAK_POINT) ? 250 : img.height
    gElCanvas.width = width
    gElCanvas.height = height

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



//////////////// SAVE EVENTS //////////

function saveUserMeme(ev) {
    ev.preventDefault()
    const memeToSave = (window.innerWidth < BREAK_POINT) ? refactorMemeToSave() : gMeme;
    memeToSave.selectedLineIdx = -1
    renderCanvas(gMeme.selectedLineIdx)
    setTimeout(() => {
        const memeSrc = getDataUrl()
        gUserMemes.push({ memeSrc: memeSrc, memeData: memeToSave })
        saveToStorage(STORAGE_KEY, gUserMemes)
    }, 1)
}

function refactorMemeToSave() {
    const memesGraphic = gMeme.lines.map(line => {
        line.size = 40
        line.x *= 2
        line.y *= 2
    })
}

///////////// EDIT EVENTS /////////////////


function changeFontFam(fontSelected) {
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].font = fontSelected
        renderCanvas(gMeme.selectedLineIdx)
    }
}

function changeAlign(selectedAlign) {
    gMeme.lines[gMeme.selectedLineIdx].align = selectedAlign
    renderCanvas(gMeme.selectedLineIdx)
}

function changeTextColor(ev, selectedTextColor) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].color = selectedTextColor
        renderCanvas(gMeme.selectedLineIdx)
    }
}

function changeStrokeColor(ev, selectedStrokeColor) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].stroke = selectedStrokeColor
        renderCanvas(gMeme.selectedLineIdx)
    }
}

function deleteLine(ev) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
        if (!gMeme.lines.length) gMeme.selectedLineIdx = -1
        renderCanvas(gMeme.selectedLineIdx)
    }
}


function newLine(ev, line) {
    ev.preventDefault()
    const newMemeLine = createNewLine(line)
    gMeme.lines.push(newMemeLine)
    renderCanvas(gMeme.selectedLineIdx)
}

function changeMemeLine(lineTxt) {
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].txt = lineTxt
        renderCanvas(gMeme.selectedLineIdx)
    }
}

function increaseFont(ev) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].size++
        renderCanvas(gMeme.selectedLineIdx)
    }
}

function decreaseFont(ev) {
    ev.preventDefault()
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].size--
        renderCanvas(gMeme.selectedLineIdx)
    }
}

function createNewLine(line = 'I never eat falafel') {
    return {
        txt: line,
        size: (window.innerWidth < 740) ? '20' : '40',
        font: 'impact',
        align: 'center',
        color: 'white',
        stroke: 'black',
        rotate: 0,
        x: gElCanvas.width / 2,
        y: gElCanvas.height / 2,
    }
}

function rotateLine(rotate) {
    if (gMeme.selectedLineIdx !== -1) {
        gMeme.lines[gMeme.selectedLineIdx].rotate = rotate
        renderCanvas()
    }
}



///////////////////// TOUCH & MOUSE EVENTS /////////////////

function linePressed(ev) {
    ev.preventDefault()
    const pos = getNewPos(ev)
    lineSelect(ev)
    if (gMeme.selectedLineIdx !== -1) {
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
    gMeme.selectedLineIdx = gMeme.lines.findIndex(line => {
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
    renderCanvas(gMeme.selectedLineIdx)
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
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - 75 - ev.target.clientTop
            //OFFSET TOP ALWAYS 0, SO I REPLACED IT WITH STATIC INT
            // y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function getMemeGlobal() {
    return gMeme
}

function setCurrGMeme(memeData) {
    if (typeof memeData === 'object') {
        gMeme = memeData
        console.log('gMeme', gMeme)
    } else {
        gMeme.selectedImgId = memeData
    }
}

function isEditMeme() {
    return gMeme.editMeme
}

function setCurrMemeLine(img) {
    gMeme.lines[gMeme.selectedLineIdx] =
    {
        txt: 'I never eat falafel',
        size: (window.innerWidth < 740) ? '20' : '40',
        font: 'impact',
        align: 'center',
        color: 'white',
        stroke: 'black',
        x: (window.innerWidth < 740) ? 125 : 250,
        y: (window.innerWidth < 740) ? 20 : 40,
    }
}



function getDataUrl() {
    return gElCanvas.toDataURL()
}
