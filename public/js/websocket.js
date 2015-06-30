
  var strongSocket = function(url) {
    var self = this;
    self.url = url;
    self.WSType = window['MozWebSocket'] ? MozWebSocket : WebSocket
    self.ws = null;
    self.connect();
    $(window).on('unload', function() {
      self.destroy();
      self.ws = null;
    });
  };

  strongSocket.prototype = {

    connect: function() {
      var self = this;
      var fullUrl = self.url
      self.ws = new self.WSType(fullUrl)

      self.ws.onopen = function() {
        //alert("socket open!")
      };

      self.ws.onclose = function() {
        //alert("socket closed!")
      };

      self.ws.onmessage = function(e) {
        self.handle(e)
      };

    },

    send: function(msg) {
      this.ws.send(msg)
    },

    handle: function(msg) {
      //alert("message: " + msg)
      //implementation is instance-specific
    },

    destroy: function() {
      this.ws.close();
      this.ws = null;
    }
  };
