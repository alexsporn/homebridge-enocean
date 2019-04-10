// Generated by CoffeeScript 2.4.1
(function() {
    // Copyright (c) 2019 Alexander Sporn. All rights reserved.

  var Enocean, EnoceanJS, EventEmitter, SerialPort;

  ({EventEmitter} = require('events'));

  SerialPort = require('serialport');

  EnoceanJS = require('enocean-js');

  module.exports = Enocean = class Enocean extends EventEmitter {
    constructor(options) {
      super();
      this.options = options;
      this.port = new SerialPort(this.options.port, {
        baudRate: 57600
      });
      this.parser = this.port.pipe(new EnoceanJS.ESP3Parser());
      this.transformer = this.parser.pipe(new EnoceanJS.ESP3Transformer());
      this.port.on('open', () => {
        return console.log('opened port ' + this.options.port);
      });
      this.port.on('error', (error) => {
        return this.emit('error', error);
      });
      this.transformer.on('data', (data) => {
        var button, msg;
        msg = data.decode("f6-02-01");
        if (!((msg != null) && (msg.R2 != null))) {
          return;
        }
        switch (msg.R1.rawValue) {
          case 0:
            button = "AI";
            break;
          case 1:
            button = "A0";
            break;
          case 2:
            button = "BI";
            break;
          case 3:
            button = "B0";
            break;
          default:
            return;
        }
        switch (msg.EB.rawValue) {
          case 0:
            return this.emit('released', data.senderId, button);
          case 1:
            return this.emit('pressed', data.senderId, button);
        }
      });
    }

  };

}).call(this);
