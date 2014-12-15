define('gregorian', [
  'gregorianBuilderService',
  'gregorianEventService'],
function (builderService, eventService) {

  function api (containerNode, objArray, onEventPress, onNewEventPress) {
    var calendar = eventService(builderService(objArray), onEventPress, onNewEventPress)
    containerNode.appendChild(calendar);
    containerNode.style.overflow = 'hidden';
    return calendar;
  }

  return api;
});