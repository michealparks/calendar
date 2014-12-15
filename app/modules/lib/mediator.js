define('mediator', [], 
function () {

  var channels = {};

  function subscribe (channel, fn) {
    if (! channels[channel]) {
      channels[channel] = [];
    }

    channels[channel].push({ context : this, callback : fn });
    return this;
  };

  function publish (channel) {
    if (! channels[channel]) {
      return this;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    var subscription;
    var i = channels[channel].length;
    while (i-- > 0) {
      subscription = channels[channel][i];
      subscription.callback.apply(subscription.context, args);
    };
    return this;
  };

  return {
    publish : publish,
    subscribe : subscribe
  };

});