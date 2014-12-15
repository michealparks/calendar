define('nirApp', [
  'router',
  'mediator',
  'authView',
  'authService',
  'calendarView',
  'interpretersView',
  'serviceOrdersView',
  'newInterpreterView',
  'newServiceOrderView',
], function (
  router,
  mediator,
  authView,
  authService,
  calendarView,
  interpretersView,
  serviceOrdersView,
  newInterpreterView,
  newServiceOrderView) {

  var rootNode = document.getElementById('app-nir');
  var curView;
  var correctPaths = /login|calendar|interpreters|service-orders|new-interpreter|new-service-order/;
  
  router
    .config({mode: 'history'})
    .add(onNavigation)
    .navigate(getPath())
    .check();

  window.onpopstate = function () {
    console.log(getPath())
    router.navigate(getPath()).check();
  }

  authService.checkLogged(function (isLogged) {
    if (isLogged) {
      rootNode.classList.add('state-logged');
    } else {
      router.navigate('login').check();
    }
  });

  rootNode.classList.remove('state-loading');

  function onNavigation () {
    var nextView = getPath();

    if (! correctPaths.test(nextView)) {
      return router.navigate('calendar').check();
    }

    if (/calendar|interpreters/.test(nextView) && 
        ! /calendar|interpreters/.test(curView)) {
      authService.getInterpreters();
    } 

    if (/service-orders/.test(nextView)) {
      authService.getServiceOrders();
    }

    // 2nd param specifies "arriving or not"
    mediator  
      .publish('navigate-' + nextView, true)
      .publish('navigate-' + curView, false)

    rootNode.classList.remove('state-view-' + curView);
    rootNode.classList.add('state-view-' + nextView);

    curView = nextView;
  }

  function getPath () {
    return window.location.pathname.slice(1);
  }

});

