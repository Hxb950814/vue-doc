var handlerOrientationChange = function () {
    var innerWidth = parent.window.innerWidth; // 兼容同域下的iframe
    var width = (innerWidth <= 320) ? 320 : ((innerWidth >= 750) ? 750 : innerWidth);
    var fontSize = 100 * (width / 750);
    document.documentElement.style.fontSize = fontSize + 'px';
};
handlerOrientationChange();
window.onresize = handlerOrientationChange;
