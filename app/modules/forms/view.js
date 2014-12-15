define('newInterpreterView', [
  'router',
  'mediator',
  'authService'
], function (router, mediator, authService) {

  mediator.subscribe('data-interpreter', onGetDataDone)

  function onGetDataDone (obj) {

  }

  function getForm (id) {
    authService.getInterpreter(id)
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

  mediator.subscribe('data-service-order', onGetDataDone);

  function onGetDataDone (obj) {

  }

  function getForm (id) {
    authService.getServiceOrder(id);
    router.navigate('new-service-order').check();
  }
  
  return {
    getForm: getForm
  };
});