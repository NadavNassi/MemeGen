function loadFromStorage(key) {
    var str = localStorage.getItem(key)
    var val = JSON.parse(str);
    return val;
}

function saveToStorage(key, val) {
    var str = JSON.stringify(val)
    localStorage.setItem(key, str)
}