define('gregorianEventService', [], function () {

  var hasTouch = window.ontouchstart !== void 0;
  var ptrup = navigator.pointerEnabled !== void 0 || navigator.msPointerEnabled !== void 0 ? 'pointerup' : (hasTouch) ? 'touchend' : 'mouseup';

  function mapIndexToTime (i) {
    return (i-1)*3;
  }

  function main (calendarNode, onEventPress, onNewEventPress) {

    calendarNode.addEventListener(ptrup, function (e) {
      var node = e.target;
      var id = node.id - 0;
      var i = 0;

      if (node.className === 'col-event' && id !== 0) {

        onEventPress && onEventPress(id);

      } else if (node.className === 'col-background') {

        while( (node = node.previousSibling) !== null ) { i++; }
        onNewEventPress && onNewEventPress(mapIndexToTime(i));

      }
    });

    return calendarNode;
  }

  return main;
})