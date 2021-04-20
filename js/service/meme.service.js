'use strict'

const gImgs = []
const gUserMemes = []

////////////// INITIATIONS //////////////

_loadUserMemes()
_createImgsArr()

function _createImgsArr() {
    for (let i = 0; i < 18; i++) {
        const img = {
            id: i + 1,
            url: `./meme-imgs/${i + 1}.jpg`
        }
        gImgs.push(img);
    }
};

///////////// GETTERS & SETTERS /////////////

function getImg(imgId){
    setCurrGMeme(imgId)
    return gImgs.find((img) => {
        return img.id === imgId
    })
}

function getImgs() {
    return gImgs
}

function getUserMemes(){
    return gUserMemes
}

///////////// STORAGE ////////////////

function _loadUserMemes() {
    const userMemes = loadFromStorage(STORAGE_KEY)
    if (userMemes) {
        userMemes.forEach(meme => {
            gUserMemes.push(meme)
        })
    }
}