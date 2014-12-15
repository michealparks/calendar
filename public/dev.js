void function () {

var names = ['Janny Joplin', 'Billert Harbort', 'Weasel Bransmack', 'Doobet Barbart', 'Cliven Dobmack'];
var colors = ['#1ABC9C','#2ECC71','#3498DB','#9B59B6','#F1C40F', '#E67E22', '#E74C3C'];
var eventTitles = [
  'Kissing a moose', 
  'Supporting terrorism overseas by feeding rabits genetically modified ducks',
  'Teaching deaf children to access psychokinetic powers',
  'Eating a sandwich naked',
  'Burping',
  'Trying on discounted underwear in an H&M dressing room',
  'Stepping in on your parents plotting to sacrifice you so that the sun will rise tomorrow',
  'Accepting death'
];

window.testOrders = (function () {
  var array = [];
  var i = 500;
  while (i-- > 0) {
    array.push({
      'id': '9999',
      'company': 'Valve Regional Game Center',
      'interpreter': 'Frank from Donnie Darko',
      'client': 'A terrified child',
      'startTime': '5:00pm',
      'endTime': '10:00pm',
      'startDate': '12/14/2014',
      'endDate': '12/15/2014'
    })
  }

  return array;
})();

window.testJSON = [];

function makeRandomInt (limit) {
  return Math.floor(Math.random()*limit);
}

function makeEvents () {
  var n = Math.floor(Math.random()*3);
  var events = [];

  while (n-- > 0) {
    var t2 = makeRandomInt(23);
    var t1 = makeRandomInt(t2);
    events.push({
      'id': makeRandomInt(1000)+1000,
      'name': eventTitles[Math.floor(Math.random()*8)],
      'color': colors[Math.floor(Math.random()*7)],
      'start': {'hour': t1, 'minutes': makeRandomInt(59)},
      'end': {'hour': t2, 'minutes': makeRandomInt(59)}
    });
  }

  return events;
}

for (var i = 0; i < 499; i++) {
  window.testJSON.push({
    'interpreter': {
      'name': names[Math.floor(Math.random()*5)],
      'color': colors[Math.floor(Math.random()*7)]
    },
    'events': makeEvents()
  });
}

}();