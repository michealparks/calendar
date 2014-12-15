define('authService', [
  'mediator'
], function (mediator) {

  function login (data) {

  }

  function onLoginDone (obj) {

  }

  function checkLogged (done) {
    // todo
    done(true)
  }

  function getInterpreters () {
    // todo
    onGetInterpretersDone(window.testJSON);
  }

  function onGetInterpretersDone (obj) {
    mediator.publish('data-interpreters', obj);
  }

  function getServiceOrders () {
    // todo
    onGetServiceOrdersDone(window.testOrders);
  }

  function onGetServiceOrdersDone (obj) {
    mediator.publish('data-service-orders', obj);
  }

  function getInterpreter (id) {
    // todo
    onGetInterpreterDone(window.testInterpreter);
  }

  function onGetInterpreterDone (obj) {
    mediator.publish('data-interpreter', obj);
  }

  function getServiceOrder (id) {
    // todo
    onGetServiceOrderDone(window.testServiceOrder);
  }

  function onGetServiceOrderDone (obj) {
    mediator.publish('data-service-order');
  }

  function deleteInterpreter (id) {
    // todo
  }

  function onDeleteInterpreterDone (id) {

  }

  function deleteServiceOrder (id) {
    // todo
  }

  function onDeleteServiceOrderDone (id) {

  }

  return {
    login: login,
    checkLogged: checkLogged,
    getInterpreters: getInterpreters,
    getServiceOrders: getServiceOrders,
    getInterpreter: getInterpreter,
    getServiceOrder: getServiceOrder,
    deleteInterpreter: deleteInterpreter,
    deleteServiceOrder: deleteServiceOrder
  };

});