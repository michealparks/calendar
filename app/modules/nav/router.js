/** absurd.js pushstate router */

define('router', [],
function () {

  var routes = [];
  var mode;
  var root = '/';

  function config (options) {
    mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
    root = options && options.root ? '/' + clearSlashes(options.root) + '/' : '/';
    return this;
  }

  function getFragment () {
    var fragment = '';
    if (mode === 'history') {
      fragment = clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = root != '/' ? fragment.replace(root, '') : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return clearSlashes(fragment);
  }

  function clearSlashes (path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  function add (re, handler) {
    if (typeof re == 'function') {
      handler = re;
      re = '';
    }
    routes.push({ re: re, handler: handler});
    return this;
  }

  function remove (param) {
    for (var i = 0, r; i < routes.length, r = routes[i]; i++) {
      if (r.handler === param || r.re === param) {
        routes.splice(i, 1); 
        return this;
      }
    }
    return this;
  }

  function flush () {
    routes = [];
    mode = null;
    root = '/';
    return this;
  }

  function check (f) {
    var fragment = f || getFragment();
    for (var i = 0; i < routes.length; i++) {
        var match = fragment.match(routes[i].re);
        if (match) {
          match.shift();
          routes[i].handler.apply({}, match);
          return this;
        }           
    }
    return this;
  }

  function navigate (path) {
    path = path ? path : '';
    if(mode === 'history') {
      history.pushState(null, null, root + clearSlashes(path));
    } else {
      window.location.href.match(/#(.*)$/);
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  }

  return {
    config: config,
    add: add,
    remove: remove,
    flush: flush,
    check: check,
    navigate: navigate
  };

});