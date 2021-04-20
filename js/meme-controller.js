'use strict'

function init() {
    renderImgs()
    initCanvas()
}

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



function onSaveBtn(ev){
    saveUserMeme(ev)
}

function onChangeFontFam(fontSelected){
    changeFontFam(fontSelected)
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

function onTextColor(ev){
    const selectedTextColor = document.querySelector('.text-color').value
    changeTextColor(ev, selectedTextColor)
}

function onStrokeColor(ev){
    const selectedStrokeColor = document.querySelector('.stroke-color').value
    changeStrokeColor(ev, selectedStrokeColor)
}

function onDeleteLine(ev){
    deleteLine(ev)
}

function onNewLine(ev){
    newLine(ev)
}

function onPressUp(ev){
    pressUp(ev)
}

function onLineMove(ev){
    lineMove(ev)
}

function onLinePressed(ev) {
    linePressed(ev)
}

function onLineSelect(ev){
    lineSelect(ev)
    const meme = getMemeGlobal()
    if(meme.selectedLineIdx !== -1){
        const elInput = document.querySelector('.line-input')
        elInput.value = meme.lines[meme.selectedLineIdx].txt
    }
}


function onIncreaseFont(ev){
    increaseFont(ev)
}

function onDecreaseFont(ev){
    decreaseFont(ev)
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

function onImgSelect(imgId){
    setCurrGMeme(imgId)
    resizeCanvas()
    renderCanvas()
    noneDisplayGalleries()
    const elEditor = document.querySelector('.meme-editor')
    elEditor.classList.remove('none-display')
    elEditor.classList.add('grid')
}

function noneDisplayGalleries(){
    const elGalleries = document.querySelectorAll('.gallery')
    elGalleries.forEach(gallery => {
        gallery.classList.remove('grid')
        gallery.classList.add('none-display')
    })
}


function onLineInput(lineTxt) {
    changeMemeLine(lineTxt)
}