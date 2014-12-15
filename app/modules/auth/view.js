define('authView', [
  'device',
  'router'
], function (device, router) {

  var appRoot = document.getElementById('app-nir');
  var rootNode = document.getElementById('view-auth');

  rootNode.getElementsByClassName('btn-submit')[0]
  .addEventListener(device.ptrup, onSubmitPress);

  function onSubmitPress () {
    var inputs = rootNode.getElementsByTagName('input');

    // TODO login

    appRoot.classList.add('state-logged');
    router.navigate('calendar').check();
  }

});



