'use strict'

function init() {
    renderImgs()
    initCanvas()
}

//////////////////// RENDERS FUNCTIONS ////////////////////////////

function renderImgs() {
    const elGallery = document.querySelector('.imgs-gallery')
    const imgs = getImgs()
    let strHtml = imgs.map((img) => {
        return `<img src="${img.url}" onclick="onImgSelect(${img.id})" />`
    }).join('\n')
    elGallery.innerHTML = strHtml
}

function renderUserMemes(){
    const elGallery = document.querySelector('.imgs-gallery')
    const userMemes = getUserMemes()
    if(userMemes.length){
        const strHtml = userMemes.map(meme => {
            return `<img src="${meme}" download="image.png" />`
        }).join('\n')
        elGallery.innerHTML = strHtml
    } else {
        const strHtml = '<h1> NO MEMES TO SHOW!</h1><h2>GO TO GALLERY AND CREATE A NEW ONE!</h2>'
        elGallery.classList.remove('grid')
        elGallery.innerHTML = strHtml
    }
}

function renderCanvas() {
    gCtx.beginPath()
    var img = new Image()
    img.src = `./imgs/${gMeme.selectedImgId}.jpg`;
    img.onload = () => {
        resizeCanvas(img.width, img.height)
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawTxt()
        if (gMeme.selectedLineIdx !== -1) drawRect(gMeme.lines[gMeme.selectedLineIdx].x, gMeme.lines[gMeme.selectedLineIdx].y, gMeme.lines[gMeme.selectedLineIdx])
        else resetInputVal()
    }
    gCtx.closePath()
}

////////////////////// GALLERY EVENTS ////////////////////

function onImgSelect(imgId){
    setCurrGMeme(imgId)
    resizeCanvas()
    renderCanvas()
    noneDisplayGalleries()
    const elEditor = document.querySelector('.meme-editor')
    elEditor.classList.remove('none-display')
    elEditor.classList.add('grid')
}


function onGallerySelected(selectedGallery) {
    resetMemeModel()
    noneDisplayGalleries()
    const elGallery = document.querySelector('.imgs-gallery')
    elGallery.classList.remove('none-display')
    elGallery.classList.add('grid')
    if(selectedGallery === 'gallery') renderImgs()
    else renderUserMemes()
}

function noneDisplayGalleries(){
    const elGalleries = document.querySelectorAll('.gallery')
    elGalleries.forEach(gallery => {
        gallery.classList.remove('grid')
        gallery.classList.add('none-display')
    })
}

////////////////////// MEME EDITORS EVENTS ////////////////////


// text events

function onIncreaseFont(ev){
    increaseFont(ev)
}

function onDecreaseFont(ev){
    decreaseFont(ev)
}

function onChangeFontFam(fontSelected){
    changeFontFam(fontSelected)
}

function onTextColor(ev){
    const selectedTextColor = document.querySelector('.text-color').value
    changeTextColor(ev, selectedTextColor)
}

function onStrokeColor(ev){
    const selectedStrokeColor = document.querySelector('.stroke-color').value
    changeStrokeColor(ev, selectedStrokeColor)
}


// line event

function onNewLine(ev){
    newLine(ev)
}

function onLineSelect(ev){
    lineSelect(ev)
    const meme = getMemeGlobal()
    if(meme.selectedLineIdx !== -1){
        const elInput = document.querySelector('.line-input')
        elInput.value = meme.lines[meme.selectedLineIdx].txt
    }
}

function onBtnToggleAlign(elBtn){
    const meme = getMemeGlobal()
    if(meme.selectedLineIdx !== -1){
        const elBtns = document.querySelectorAll('.align-btn')
        elBtns.forEach((btn) => {
            btn.classList.remove('active')
        })
        elBtn.classList.add('active')
        changeAlign(elBtn.dataset.align)
    }
}

function onDeleteLine(ev){
    deleteLine(ev)
}

function onLineInput(lineTxt) {
    changeMemeLine(lineTxt)
}

//btn events

function onSaveBtn(ev){
    saveUserMeme(ev)
}



////////////////////// TOUCH/MOUSE EVENTS ////////////////////

function onPressUp(ev){
    pressUp(ev)
}

function onLineMove(ev){
    lineMove(ev)
}

function onLinePressed(ev) {
    linePressed(ev)
}
