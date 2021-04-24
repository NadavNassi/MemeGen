'use strict'

function init() {
    renderImgs()
    initCanvas()
    if(!gUserMemes.length){
        onToggleIntroModal()
    }
}


//////////////////// RENDERS FUNCTIONS ////////////////////////////

function renderImgs() {
    const elGallery = document.querySelector('.imgs-gallery')
    const imgs = getImgs()
    let strHtml = imgs.map((img) => {
        return `<img class="gallery-img" src="${img.url}" onclick="onImgSelect(${img.id})" />`
    }).join('\n')
    elGallery.innerHTML = strHtml
}

function onToggleIntroModal(){
    document.body.classList.toggle('intro-open')
}

function renderUserMemes(){
    const elGallery = document.querySelector('.imgs-gallery')
    const userMemes = getUserMemes()
    if(userMemes.length){
        const strHtml = userMemes.map(meme => {
            return `<div class="user-meme-img">
            <img class="user-img" src="${meme.memeSrc}" onclick="onImgSelect${meme.memeData}" />
            <p><a class="clean-text" href="${meme.memeSrc}" download="image.png">Download now!</a></p>
            </div>`
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
    const canvas = getCanvas()
    var img = new Image()
    const meme = getMemeGlobal()
    img.src = `./imgs/${meme.selectedImgId}.jpg`;
    if(!isEditMeme())setCurrMemeLine()
    img.onload = () => {
        resizeCanvas(img)
        gCtx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawTxt()
        if (meme.selectedLineIdx !== -1) drawRect(meme.lines[meme.selectedLineIdx].x, meme.lines[meme.selectedLineIdx].y, meme.lines[meme.selectedLineIdx])
        else resetInputVal()
    }
    gCtx.closePath()
}

////////////////////// GALLERY EVENTS ////////////////////

function onToggleMenu(){
    if(window.innerWidth < BREAK_POINT) document.body.classList.toggle('menu-open')
}

function onToggleModal(){
    document.body.classList.toggle('modal-open')
}

function onImgSelect(selectedData){
    setCurrGMeme(selectedData)
    renderCanvas(selectedData)
    noneDisplayGalleries()
    const elEditor = document.querySelector('.meme-editor')
    const meme = getMemeGlobal()
    meme.editMeme = true
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
    const meme = getMemeGlobal()
    meme.editMeme = false
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

function resetInputVal() {
    document.querySelector('.line-input').value = ''
    document.querySelector('.text-color').value = '#ffffff'
    document.querySelector('.stroke-color').value = '#000000'
}

function onNewLine(ev, line){
    newLine(ev, line)
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

function onRotate(ev, rotate) {
    ev.preventDefault()
    rotateLine(rotate)
    
}

//share events

function onSaveBtn(ev){
    onToggleModal()
    saveUserMeme(ev)
    onGallerySelected('gallery')
}

function onFbShare(elA){
    console.dir(elA)
    elA.parentNode.removeChild(elA)
}

// drawing events

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


