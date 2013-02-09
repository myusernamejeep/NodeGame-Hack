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
    Entity = require('./Entity').Entity;

exports.Link = Class(function(network, one, two) {

    this._nodeOne = one;
    this._nodeTwo = two;

    Entity(this, 'Link', network);

    this.setOwner(network.getNeutral());

}, Entity, {

    update: function(tick) {

        var player = this.getParent().getNeutral();
        if (this._nodeOne.isOwnedBy(this._nodeTwo.getOwner())) {
            player = this._nodeOne.getOwner();
        }

        if (!this.isOwnedBy(player)) {
            this.setOwner(player);
        }

    },

    getTargetForNode: function(node) {
        this.assert(node === this._nodeOne || node === this._nodeTwo, 'node is either side of the link');
        return this._nodeOne === node ? this._nodeTwo : this._nodeOne;
    },


    // Helpers ----------------------------------------------------------------
    toString: function() {
        return Entity.toString(this)
                + ' (' + this._nodeOne + ' ~ ' + this._nodeTwo + ')';
    }

});
