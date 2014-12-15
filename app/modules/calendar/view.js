define('calendarView', [
  'mediator',
  'gregorian'
], function (mediator, gregorian) {

  var rootNode = document.getElementById('view-calendar');
  var calenderContainer = rootNode.getElementsByClassName('container-calendar')[0];
  var inputFilter = rootNode.getElementsByClassName('input-filter')[0];

  inputFilter.addEventListener('keyup', filterData);

  mediator.subscribe('data-interpreters', onGetDataDone);

  function filterData (e) {
    var val = this.value;
    var nodes = calenderContainer.getElementsByClassName('row');
    var i = nodes.length;
    while (i-- > 0) {
      if (nodes[i].id.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        nodes[i].classList.add('state-hidden');
      } else {
        nodes[i].classList.remove('state-hidden');
      }
    }
  }

  function onEventPress (id) {
    authService.getServiceOrder(id);
  }

  function onNewEventPress (id) {
    router.navigate('new-service-order').check();
  }

  function onGetDataDone (obj) {
    calenderContainer.innerHTML = '';
    gregorian(
      calenderContainer,
      obj,
      onEventPress,
      onNewEventPress
    );
  }


});