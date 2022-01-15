(function () {
  'use strict';

  let W = window;
  let D = document;
  // let H = document.head;
  let B = document.body;
  let C = window.console;
  let M;
  let SH;
  let T;
  let Canvas;
  let Controls;
  let Logo;
  let FgColor = ['#000000', '#ffffff'];
  let FgColorBW = ['black', 'white'];
  let BgColor = { 'R': 51, 'G': 102, 'B': 152 };

  ////

  function keyDown(e) {
    if (
      e.keyCode === 107 ||
      e.keyCode === 109 ||
      e.keyCode === 187 ||
      e.keyCode === 188 ||
      e.keyCode === 189 ||
      e.keyCode === 190 ||
      e.keyCode === 229
    ) {
      e.preventDefault();
    }
  }

  function toHex(decimal) {
    let v = decimal.toString(16);
    return v;
  }

  function downloadImage() {
    // C.group('Download');
    let downloadA = D.createElement('a');
    downloadA.download = 'haiku' +
      '_' + Canvas.width + 'x' + Canvas.height +
      '_' + Controls.Opacity.value +
      '_' + FgColorBW[Controls.FgColor.value] +
      '-' + Controls.BgColor.value.replace('#', '') +
      '.png';
    downloadA.href = Canvas.toDataURL();
    downloadA.dispatchEvent(
      new MouseEvent('click', { view: window, bubbles: true, cancelable: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, buttons: 1, })
    );
    SH.textContent = 'Downloading…';
    setTimeout(() => { SH.textContent = 'Click on the image to download'; }, 600);
    // C.groupEnd();
  }

  function paintCanvas() {
    // C.group('Paint');
    Canvas.Ctx = Canvas.getContext('2d', { alpha: false });
    Canvas.Ctx.fillStyle = Controls.BgColor.value;
    Canvas.Ctx.fillRect(0, 0, Canvas.width, Canvas.height);
    //
    Logo.firstElementChild.style.opacity = Controls.Opacity.value + '%';
    Logo.firstElementChild.firstElementChild.setAttribute('fill', FgColor[Controls.FgColor.value]);
    Logo.Image = new Image();
    Logo.Image.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(Logo));
    Logo.Image.onload = function () {
      Canvas.Ctx.drawImage(Logo.Image, 0, 0, Canvas.width, Canvas.height);
    };
    // C.groupEnd();
  }

  function changedWidth() {
    // C.group('Width');
    let ar = Logo.aspectRatio;
    let w = Math.round(Controls.Width.value);
    let h = (Math.round(w / ar) * ar) / ar;
    w = (h * ar);
    Canvas.width = w; // = Controls.Width.value
    Canvas.height = Controls.Height.value = h;
    // C.groupEnd();
    paintCanvas();
  }

  function changedHeight() {
    // C.group('Height');
    let ar = Logo.aspectRatio;
    let h = Math.round(Controls.Height.value);
    let w = h * ar;
    Canvas.width = Controls.Width.value = w;
    Canvas.height = h; // = Controls.Height.value
    // C.groupEnd();
    paintCanvas();
  }

  function prepairControls() {
    // C.group('Controls');
    Controls = T[1].content.firstElementChild;
    Controls.WH = Controls.children[0].querySelectorAll('input');
    Controls.Height = Controls.WH[1];
    Controls.Width = Controls.WH[0];
    Controls.FgColor = Controls.WH[2];
    Controls.Opacity = Controls.WH[3];
    delete Controls.WH;

    Controls.Height.min = Controls.Height.step = 1;
    // Controls.Height.max = 400;
    Controls.Height.value = Canvas.height;
    Controls.Height.parentElement.title += ' (in steps of ' + Controls.Height.step + ')';

    Controls.Width.min = Controls.Height.min * Logo.aspectRatio;
    // Controls.Width.max = Controls.Height.max * Logo.aspectRatio;
    Controls.Width.step = Logo.aspectRatio;
    Controls.Width.value = Canvas.width;
    Controls.Width.parentElement.title += ' (in steps of ' + Controls.Width.step + ')';

    Controls.BgColor = Controls.lastElementChild.lastElementChild.lastElementChild;
    Controls.BgColor.value = '#' + toHex(BgColor.R) + toHex(BgColor.G) + toHex(BgColor.B);

    Controls.Height.addEventListener('keydown', keyDown);
    Controls.Height.addEventListener('change', changedHeight);
    Controls.Height.addEventListener('input', changedHeight);

    Controls.Width.addEventListener('keydown', keyDown);
    Controls.Width.addEventListener('change', changedWidth);
    Controls.Width.addEventListener('input', changedWidth);

    Controls.BgColor.addEventListener('keydown', keyDown);
    Controls.BgColor.addEventListener('change', paintCanvas);
    Controls.BgColor.addEventListener('input', paintCanvas);

    Controls.Opacity.addEventListener('change', paintCanvas);

    Controls.FgColor.addEventListener('change', paintCanvas);

    M.prepend(Controls);
    // C.groupEnd();
    return true;
  }

  function prepairCanvas() {
    // C.group('Canvas');
    Canvas = D.createElement('canvas');
    M.firstElementChild.append(Canvas);
    let initW = 300;
    Canvas.width = initW;
    Canvas.height = initW / Logo.aspectRatio;
    Canvas.addEventListener('click', downloadImage); // 
    // C.groupEnd();
    return true;
  }

  function prepairLogo() {
    // C.group('Logo');
    Logo = T[0].content.firstElementChild;
    Logo.aspectRatio = Logo.width.baseVal.value / Logo.height.baseVal.value;
    // C.groupEnd();
    return true;
  }

  ////

  function init() {
    M = B.querySelector('main');
    T = B.querySelectorAll('template');
    SH = B.firstElementChild.lastElementChild;
    if (prepairLogo()) {
      if (prepairCanvas()) {
        if (prepairControls()) {
          paintCanvas();
        }
      }
    }
  }

  W.addEventListener('load', init);

}());