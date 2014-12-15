define('gregorianBuilderService', [], 
function () {
  var docFrag = document.createDocumentFragment();

  function timeAxisTemplate () {
    return '<div class="col-period">12:00am</div>' +
           '<div class="col-period">3:00am</div>' +
           '<div class="col-period">6:00am</div>' +
           '<div class="col-period">9:00am</div>' +
           '<div class="col-period">12:00pm</div>' +
           '<div class="col-period">3:00pm</div>' +
           '<div class="col-period">6:00pm</div>' +
           '<div class="col-period">9:00pm</div>';
  }

  function rowTemplate () {
    return '<div class="col-background"></div>' +
           '<div class="col-background"></div>' +
           '<div class="col-background"></div>' +
           '<div class="col-background"></div>' +
           '<div class="col-background"></div>' +
           '<div class="col-background"></div>' +
           '<div class="col-background"></div>' +
           '<div class="col-background"></div>';
  }

  function eventTemplate (data) {
    var startX = timeToPosition(data.start);
    var endX = timeToPosition(data.end);

    return '<div id="' + data.id + '" class="col-event"' + 
           'style="background-color:' + data.color + 
           ';left:' + startX + '%;' +
           ';width:' + (endX - startX) + '%;">' + data.name +
           '</div>';
  }

  function timeToPosition (time) {
    time.hour -= 0;
    time.minutes -= 0;

    // 180 minutes per time period. 
    // Width of each time period is 10% of the container.
    // Left offset is 20%
    return (10*((time.hour*60) + time.minutes)/180) + 20;
  }

  function buildTimeAxis () {
    var row = document.createElement('div');

    row.id = 'axis-time';
    row.innerHTML = timeAxisTemplate();

    return row;
  }

  function buildRow (obj) {
    var row = document.createElement('div');
    var name = document.createElement('div');

    name.className = 'col-name';
    name.textContent = obj.interpreter.name;
    name.style.borderColor = obj.interpreter.color;

    row.className = 'row';
    row.id = obj.interpreter.name;
    row.innerHTML = (rowTemplate() + buildEvents(obj.events));
    row.insertBefore(name, row.firstChild);

    return row;
  }

  function buildEvents (events) {
    var htmlString = '';
    for (var i = 0, l = events.length; i < l; i++) {
      htmlString += eventTemplate(events[i]);
    }

    return htmlString;
  }

  function main (objArray) {
    var root = document.createElement('div');
    var container = document.createElement('div');

    root.id = 'gregorian';
    container.id = 'container-row';

    for (var i = 0, l = objArray.length; i < l; i++) {
      docFrag.appendChild(buildRow(objArray[i]));
    }

    container.appendChild(docFrag);
    root.appendChild(buildTimeAxis());
    root.appendChild(container);

    return root;
  }

  return main;

});