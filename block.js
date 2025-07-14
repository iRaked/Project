// credit: Louis Lazaris
window.addEventListener('contextmenu', function (e) {
  console.log('context menu disabled');
  e.preventDefault();
}, false);

document.addEventListener('mouseup', function (e) {
  if (e.button === 2) {
    console.log('right-click enabled');
  }
}, false);
// https://jsbin.com/diyihu/edit?html,css,js,console,output