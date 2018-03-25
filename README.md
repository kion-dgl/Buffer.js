# Buffer.js
A ecmascript implementation of the nodejs buffer object to be used in the browser. Right now only read functions are implemented, but more functionality maybe added over time.

```
      var reader = new FileReader();
      
      reader.onload = function (e) {

				var array_buffer = e.target.result;
				var uint8array = new Uint8Array(array_buffer);
        var buffer = new Buffer(uint8array);

			}

			reader.readAsArrayBuffer(file);

```


buf.readFloatBE(offset)
buf.readFloatLE(offset)
buf.readInt8(offset)
buf.readInt16BE(offset)
buf.readInt16LE(offset)
buf.readInt32BE(offset)
buf.readInt32LE(offset)
buf.readUInt8(offset)
buf.readUInt16BE(offset)
buf.readUInt16LE(offset)
buf.readUInt32BE(offset)
buf.readUInt32LE(offset)
