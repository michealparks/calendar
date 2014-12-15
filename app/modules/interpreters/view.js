define('interpretersView', [
  'mediator',
  'device',
  'router', 
  'authService', 
  'newInterpreterView'
], function (mediator, device, router, authService, newInterpreterView) {

  var docFrag = document.createDocumentFragment();
  var rootNode = document.getElementById('view-interpreters');
  var interpretersContainer = rootNode.getElementsByClassName('container-interpreters')[0];
  var inputFilter = rootNode.getElementsByClassName('input-filter')[0];

  rootNode.getElementsByClassName('btn-add')[0]
  .addEventListener(device.ptrup, function () {
    router.navigate('new-interpreter').check();
  });

  inputFilter.addEventListener('keyup', filterData);
  interpretersContainer.addEventListener(device.ptrup, onInterpeterPress);

  mediator.subscribe('data-interpreters', onGetDataDone);

  function onInterpeterPress (e) {
    if (e.target.classList.contains('btn-edit')) {
      newInterpreterView.getForm(e.target.id)
    } else if (e.target.classList.contains('btn-delete')) {
      authService.deleteInterpreter(e.target.id)
    }
  }

  function filterData (e) {
    var val = this.value;
    var nodes = interpretersContainer.getElementsByClassName('row');
    var i = nodes.length;
    while (i-- > 0) {
      if (nodes[i].id.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        nodes[i].classList.add('state-hidden');
      } else {
        nodes[i].classList.remove('state-hidden');
      }
    }
  }

  function interpreterTemplate (data) {
    var name = data.name.split(' ');
    return '<span class="color" style="background-color:' + data.color + '"></span>' +
           '<span class="text">' + name[0] + '</span>' + 
           '<span class="text">' + name[1] + '</span>' +
           '<span id="' + data.id + '" class="btn-delete icon-trash"></span>' +
           '<span id="' + data.id + '" class="btn-edit icon-edit"></span>';
  }

  function onGetDataDone (obj) {
    var interpreterNode;

    for (var i = 0, l = obj.length; i < l; i++) {
      interpreterNode = document.createElement('div');
      interpreterNode.className = 'row interpreter ';
      interpreterNode.id = obj[i].interpreter.name;
      interpreterNode.innerHTML = interpreterTemplate(obj[i].interpreter)
      docFrag.appendChild(interpreterNode);
    }

    interpretersContainer.innerHTML = '';
    interpretersContainer.appendChild(docFrag);
  }

});