/**
  * Copyright (c) 2013 Ivo Wetzel.
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  * THE SOFTWARE.
  */
var Class = require('../lib/Class').Class,
    List = require('../lib/List').List,
    utils = require('../lib/utils').utils;

exports.Client = Class(function(port, host, local) {

    utils.assert(typeof host === 'string', 'host is a string');
    utils.assert(typeof port === 'number' && !isNaN(port), 'port is a number');

    this._port = port;
    this._host = host;
    this._isLocal = !!local;

    var client = require(this._isLocal ? './lib/Server' : './lib/lithium');
    this._interface = new client.Client();

}, {

    // Actions ----------------------------------------------------------------
    start: function() {
        this._interface.on('connection', this.onConnection, this);
        this._interface.on('message', this.onMessage, this);
        this._interface.on('close', this.onClose, this);
        this._interface.connect(this._port, this._host);
    },

    stop: function() {
        this._interface.close();
    },


    // Event Handlers ---------------------------------------------------------
    onConnection: function() {
        this.log('Connected');
        this._interface.send('Hello world');
    },

    onMessage: function(msg) {
        this.log('Message:', msg);
    },

    onClose: function(byRemote, reason, code) {

        if (this._interface.wasConnected()) {
            this.log('Disconnected ', byRemote, reason, code);

        } else {
            this.log('Connection Failed', reason, code);
        }

    },


    // Helpers ----------------------------------------------------------------
    log: function() {
        utils.log.apply(this, arguments);
    },

    assert: function(assertion, msg) {
        utils.assert(assertion, msg);
    },

    toString: function() {
        return 'LocalClient ' + this._host + ':' + this._port;
    }

});

