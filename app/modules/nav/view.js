define('navView', [
  'device',
  'router'], 
function (device, router) {

  var appRoot = document.getElementById('app-nir');
  var rootNode = document.getElementById('view-nav');

  rootNode.getElementsByClassName('logout')[0]
  .addEventListener(device.ptrup, onLogoutPress);

  void function init () {
    var navBtns = rootNode.getElementsByClassName('btn-nav');
    var i = navBtns.length;

    while (i-- > 0) {
      navBtns[i].addEventListener(device.ptrup, onNavBtnPress);
    }
  }();

  function onNavBtnPress () {
    router.navigate(this.classList[2]).check();
  }

  function onLogoutPress () {
    // todo logout

    appRoot.classList.remove('state-logged');
    router.navigate('login').check();
  }

});