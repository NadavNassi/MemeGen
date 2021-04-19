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

function onGallerySelect() {
    const elGallery = document.querySelector('.imgs-gallery')
    const elEditor = document.querySelector('.meme-editor')
    elGallery.style.display = 'grid'
    elEditor.style.display = 'none'
}

function onImgSelect(imgId){
    const selectedImg = getImg(imgId)
    drawImg(selectedImg)
    drawTxt()
    const elGallery = document.querySelector('.imgs-gallery')
    const elEditor = document.querySelector('.meme-editor')
    elGallery.style.display = 'none'
    elEditor.style.display = 'grid'
}

function onLineInput(lineTxt) {
    console.log('lineTxt', lineTxt)
}