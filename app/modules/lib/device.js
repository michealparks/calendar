define('device', [],
function () {

  var hasTouch = window['ontouchstart'] !== undefined;
  var ptrup = (navigator['pointerEnabled'] !== undefined || 
               navigator['msPointerEnabled'] !== undefined) ? 'pointerup' : 
               hasTouch ? 'touchend' : 'mouseup';
  var ptrdown = (ptrup === 'pointerup') ? 'pointerdown' : (hasTouch) ? 'touchstart' : 'mousedown';
  var ptrmove = (ptrup === 'pointerup') ? 'pointermove' : (hasTouch) ? 'touchmove' : 'mousemove';
  var transform = document.body.style.transform !== undefined ? 'transform' : 'webkitTransform';
  var innerHeight = 0;
  var innerWidth = 0;
  var scrollY = 0;
  var touchstartX = 0;
  var touchstartY = 0;
  var orientation = '';
  var online = true;

  function onTouchStart (e) {
    touchstartX = e.touches[0].pageX;
    touchstartY = e.touches[0].pageY;
  }

  function onWindowResize () {
    innerHeight = window.innerHeight;
    innerWidth = window.innerWidth;
  }

  function onOrientationChange () {
    orientation = window.screen.orientation;
  }

  function getScrollY () {
    scrollY = window.scrollY;
  }

  function onWindowScroll () {
    window.requestAnimationFrame(getScrollY);
  }

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', onOrientationChange);
  window.addEventListener('scroll', onWindowScroll);

  onWindowResize();
  onOrientationChange();
  onWindowScroll();

  if (hasTouch) {
    window.addEventListener('touchstart', onTouchStart);
  }

  return {
    hasTouch: hasTouch,
    ptrup: ptrup,
    ptrdown: ptrdown,
    ptrmove: ptrmove,
    transform: transform,
    hasLocalStorage: (function () {
      if (! window['localStorage']) {
        return false;
      } else {
        try {
          window.localStorage.setItem('test', 'test');
          window.localStorage.removeItem('test');
          return true;
        } catch (error) {
          return false;
        }
      }
    })(),
    touchUnmoved: function (e) {
      if (hasTouch && e.changedTouches) {
        return (Math.abs(e.changedTouches[0].pageY - touchstartY) < 10 &&
                Math.abs(e.changedTouches[0].pageX - touchstartX) < 10);
      } else {
        return true;
      }
    },
    isOnline: function (newState) {
      if (newState !== undefined) {
        online = newState;
      } else {
        return online;
      }
    },
    narrowWidth: function () { return innerWidth <= 700; },
    orientation: function () { return orientation; },
    innerHeight: function () { return innerHeight; },
    innerWidth: function () { return innerWidth; },
    scrollY: function () { return scrollY; },
    scrollBottom: function () { return scrollY + innerHeight; }
  };

});
