/*
    This file is part of Buffer.s
    Copyright 2017,2018 Benjamin Collins
    
    Permission is hereby granted, free of charge, to any person obtaining 
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, 
    distribute, sublicense, and/or sell copies of the Software, and to 
    permit persons to whom the Software is furnished to do so, subject to 
    the following conditions:
    
    The above copyright notice and this permission notice shall be included     
    in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    
*/

"use strict";

function Buffer(data) {

	this.data = data;
	this.length = data.length;

}

Buffer.prototype = {

	"constructor": Buffer,

	"readInt8": function (offset) {

		if (!(this.data[offset] & 0b10000000)) {
			return this.data[offset];
		} else if (this.data[offset] === 0x80) {
			return -128;
		} else {
			return (this.data[offset] & 0x7f) * -1;
		}

	},

	"readUInt8": function (offset) {

		return this.data[offset];

	},

	"readInt16LE": function (offset) {

		var int16_t = new Int16Array([0, 0]);

		for (var i = 0; i < 2; i++) {
			int16_t[1] = this.data[offset++];
			int16_t[0] |= (int16_t[1] << i * 8);
		}

		return int16_t[0];

	},

	"readUInt16LE": function (offset) {

		var uint16_t = new Uint16Array([0, 0]);

		for (var i = 0; i < 2; i++) {
			uint16_t[1] = this.data[offset++];
			uint16_t[0] |= (uint16_t[1] << i * 8);
		}

		return uint16_t[0];

	},

	"readInt16BE": function (offset) {

		var int16_t = new Int16Array([0, 0]);

		for (var i = 0; i < 2; i++) {
			int16_t[1] = this.data[offset++];
			int16_t[0] |= (int16_t[1] << (1 - i) * 8);
		}

		return int16_t[0];

	},

	"readUInt16BE": function (offset) {

		var uint16_t = new Uint16Array([0, 0]);

		for (var i = 0; i < 2; i++) {
			uint16_t[1] = this.data[offset++];
			uint16_t[0] |= (uint16_t[1] << (1 - i) * 8);
		}

		return uint16_t[0];

	},

	"readInt32LE": function (offset) {

		var int32_t = new Int32Array([0, 0]);

		for (var i = 0; i < 4; i++) {
			int32_t[1] = this.data[offset++];
			int32_t[0] |= (int32_t[1] << i * 8);
		}

		return int32_t[0];

	},

	"readUInt32LE": function (offset) {

		var uint32_t = new Uint32Array([0, 0]);

		for (var i = 0; i < 4; i++) {
			uint32_t[1] = this.data[offset++];
			uint32_t[0] |= (uint32_t[1] << i * 8);
		}

		return uint32_t[0];

	},

	"readInt32BE": function (offset) {

		var int32_t = new Int32Array([0, 0]);

		for (var i = 0; i < 4; i++) {
			int32_t[1] = this.data[offset++];
			int32_t[0] |= (int32_t[1] << (3 - i) * 8);
		}

		return int32_t[0];

	},

	"readUInt32BE": function (offset) {

		var uint32_t = new Uint32Array([0, 0]);

		for (var i = 0; i < 4; i++) {
			uint32_t[1] = this.data[offset++];
			uint32_t[0] |= (uint32_t[1] << (3 - i) * 8);
		}

		return uint32_t[0];

	},

	"readFloatLE": function (offset, fixed) {

		var uint32 = this.readUInt32LE(offset);

		var negative = uint32 >> 31;
		var exponent = (uint32 >> 23) & 0xFF;
		var mantissa = uint32 & 0x007fffff;

		if (exponent === 0 && mantissa === 0) {
			return negative ? -0 : 0;
		} else if (exponent === 0xff && mantissa === 0) {
			return negative ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
		} else if (exponent === 0xff && mantissa !== 0) {
			return Number.NaN;
		}

		negative = negative ? -1 : 1;
		exponent -= 127;
		exponent = Math.pow(2, exponent);

		var man = 1.0;
		var shift = 0;

		for (let i = 22; i >= 0; i--) {

			shift++;
			if (mantissa & (1 << i)) {
				man += 1 / (1 << shift);
			}

		}

		var float = negative * exponent * man;

		if (fixed) {
			float = float.toFixed(fixed);
		}

		return float;

	},

	"readFloatBE": function (offset, fixed) {

		var uint32 = this.readUInt32BE(offset);

		var negative = uint32 >> 31;
		var exponent = (uint32 >> 23) & 0xFF;
		var mantissa = uint32 & 0x007fffff;

		if (exponent === 0 && mantissa === 0) {
			return negative ? -0 : 0;
		} else if (exponent === 0xff && mantissa === 0) {
			return negative ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
		} else if (exponent === 0xff && mantissa !== 0) {
			return Number.NaN;
		}

		negative = negative ? -1 : 1;
		exponent -= 127;
		exponent = Math.pow(2, exponent);

		var man = 1.0;
		var shift = 0;

		for (let i = 22; i >= 0; i--) {

			shift++;
			if (mantissa & (1 << i)) {
				man += 1 / (1 << shift);
			}

		}

		var float = negative * exponent * man;

		if (fixed) {
			float = float.toFixed(fixed);
		}

		return float;

	},

	"toString": function (encoding, start, end) {

		start = start || 0;
		end = end || this.length;

		var index = 0;
		var array = new Array(end - start);

		for (var i = start; i < end; i++) {
			array[index++] = this.data[i];
		}

		var str = "";

		switch (encoding) {
		case "hex":

			for (var i = 0; i < array.length; i++) {
				var c = array[i].toString(16);
			}

			str += c.length < 2 ? "0" + c : c;

			break;
		case "ascii":

			for (var i = 0; i < array.length; i++) {

				str += String.fromCharCode(array[i]);

			}

			break;
		default:

			throw new Error("Format " + encoding + " not supported");

			break;
		}

		return str.replace(/\0/g, "");

	},

	"copy" : function(offset, length) {
		
		var array = new Uint8Array(length);
		for(let i = 0; i < length; i++,offset++) {
			array[i] = this.data[offset];
		}
		return array;

	}

}
