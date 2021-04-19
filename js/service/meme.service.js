'use strict'

const gImgs = []
_createImgsArr()

function _createImgsArr() {
    for (let i = 0; i < 18; i++) {
        const img = {
            id: i + 1,
            url: `/meme-imgs/${i + 1}.jpg`
        }
        gImgs.push(img);
    }
};

function getImg(imgId){
    setSelectedImg(imgId)
    return gImgs.find((img) => {
        return img.id === imgId
    })
}

function getImgs() {
    return gImgs
}