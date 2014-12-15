define('newInterpreterView', [
  'router',
  'mediator',
  'authService'
], function (router, mediator, authService) {

  var rootNode = document.getElementById('view-new-interpreter');

  mediator
    .subscribe('data-interpreter', onGetDataDone)

  function onGetDataDone (obj) {

  }

  function getForm (id) {
    authService.getInterpreter(id);

    router.navigate('new-interpreter').check();
  }
  
  return {
    getForm: getForm
  };
});

define('newServiceOrderView', [
  'router',
  'mediator',
  'authService'
], function (router, mediator, authService) {

  var rootNode = document.getElementById('view-new-service-order');

  mediator
    .subscribe('navigate-new-service-order', onNavigate)
    .subscribe('data-service-order', onGetDataDone);

  function onNavigate (arriving) {
    if (arriving) {
      rootNode.classList.remove('state-existing');
    } else {

    }
  }

  function onGetDataDone (obj) {
    rootNode.classList.add('state-existing');
  }

  function getForm (id) {
    authService.getServiceOrder(id);
    router.navigate('new-service-order').check();
  }
  
  return {
    getForm: getForm
  };
});