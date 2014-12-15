define('serviceOrdersView', [
  'mediator',
  'device',
  'router',
  'newServiceOrderView'
], function (mediator, device, router, newServiceOrderView) {

  var docFrag = document.createDocumentFragment();
  var rootNode = document.getElementById('view-service-orders');
  var serviceOrdersContainer = rootNode.getElementsByClassName('container-service-orders')[0];
  var inputFilter = rootNode.getElementsByClassName('input-filter')[0];

  rootNode.getElementsByClassName('btn-add')[0]
  .addEventListener(device.ptrup, function () {
    router.navigate('new-service-order').check();
  });

  inputFilter.addEventListener('keyup', filterData);
  serviceOrdersContainer.addEventListener(device.ptrup, onServiceOrderPress);

  mediator.subscribe('data-service-orders', onGetDataDone);

  function onServiceOrderPress (e) {
    if (e.target.classList.contains('btn-edit')) {
      newServiceOrderView.getForm(e.target.id)
    } else if (e.target.classList.contains('btn-delete')) {
      authService.deleteServiceOrder(e.target.id)
    }
  }

  function filterData (e) {
    var val = this.value;
    var nodes = serviceOrdersContainer.getElementsByClassName('row');
    var i = nodes.length;
    while (i-- > 0) {
      if (nodes[i].id.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        nodes[i].classList.add('state-hidden');
      } else {
        nodes[i].classList.remove('state-hidden');
      }
    }
  }

  function concatData (data) {
    return data.company + ' ' +
           data.interpreter + ' ' +
           data.client + ' ' +
           data.startTime + ' ' +
           data.endTime + ' ' +
           data.startDate + ' ' +
           data.endDate;
  }

  function serviceOrderTemplate (data) {
    return '<span class="text">' + data.company + '</span>' +
           '<span class="text">' + data.interpreter + '</span>' +
           '<span class="text">' + data.client + '</span>' +
           '<span class="text">' + data.startTime + '</span>' + 
           '<span class="text">' + data.endTime + '</span>' +
           '<span class="text">' + data.startDate + '</span>' +
           '<span class="text">' + data.endDate + '</span>' +
           '<span id="' + data.id + '" class="btn-delete icon-trash"></span>' +
           '<span id="' + data.id + '" class="btn-edit icon-edit"></span>';
  }

  function onGetDataDone (obj) {
    var serviceOrderNode;

    for (var i = 0, l = obj.length; i < l; i++) {
      serviceOrderNode = document.createElement('span');
      serviceOrderNode.className = 'row service-order ';
      serviceOrderNode.id = concatData(obj[i]);
      serviceOrderNode.innerHTML = serviceOrderTemplate(obj[i])
      docFrag.appendChild(serviceOrderNode);
    }

    serviceOrdersContainer.innerHTML = '';
    serviceOrdersContainer.appendChild(docFrag);
  }

  return {};
});