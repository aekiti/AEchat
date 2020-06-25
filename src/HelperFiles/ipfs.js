 /* eslint-disable */
 /* eslint-disable */

 let initialize=null;
 (function webpackUniversalModuleDefinition(root, factory) {
   if (typeof exports === 'object' && typeof module === 'object')
     module.exports = factory();
   else if (typeof define === 'function' && define.amd)
     define("IPFS", [], factory);
   else if (typeof exports === 'object')
     exports["IPFS"] = factory();
   else
     root["IPFS"] = factory();
 })(this, function() {
   return /******/ (function(modules) { // webpackBootstrap
     /******/ // The module cache
     /******/
     var installedModules = {};
     /******/
     /******/ // The require function
     /******/
     function __webpack_require__(moduleId) {
       /******/
       /******/ // Check if module is in cache
       /******/
       if (installedModules[moduleId])
         /******/
         return installedModules[moduleId].exports;
       /******/
       /******/ // Create a new module (and put it into the cache)
       /******/
       var module = installedModules[moduleId] = {
         /******/
         i: moduleId,
         /******/
         l: false,
         /******/
         exports: {}
         /******/
       };
       /******/
       /******/ // Execute the module function
       /******/
       modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
       /******/
       /******/ // Flag the module as loaded
       /******/
       module.l = true;
       /******/
       /******/ // Return the exports of the module
       /******/
       return module.exports;
       /******/
     }
     /******/
     /******/
     /******/ // expose the modules object (__webpack_modules__)
     /******/
     __webpack_require__.m = modules;
     /******/
     /******/ // expose the module cache
     /******/
     __webpack_require__.c = installedModules;
     /******/
     /******/ // identity function for calling harmory imports with the correct context
     /******/
     __webpack_require__.i = function(value) {
       return value;
     };
     /******/
     /******/ // define getter function for harmory exports
     /******/
     __webpack_require__.d = function(exports, name, getter) {
       /******/
       Object.defineProperty(exports, name, {
         /******/
         configurable: false,
         /******/
         enumerable: true,
         /******/
         get: getter
         /******/
       });
       /******/
     };
     /******/
     /******/ // Object.prototype.hasOwnProperty.call
     /******/
     __webpack_require__.o = function(object, property) {
       return Object.prototype.hasOwnProperty.call(object, property);
     };
     /******/
     /******/ // __webpack_public_path__
     /******/
     __webpack_require__.p = "";
     /******/
     /******/ // Load entry module and return exports
     /******/
     return __webpack_require__(__webpack_require__.s = 1);
     /******/
   })
   /************************************************************************/
   /******/
   ([
     /* 0 */
     /***/
     function(module, exports) {

       "use strict";
       "use strict";

       var XMLHttpRequest = window.XMLHttpRequest; // eslint-disable-line

       module.exports = XMLHttpRequest;

       /***/
     },
     /* 1 */
     /***/
     function(module, exports, __webpack_require__) {

       "use strict";
       'use strict';

       var XMLHttpRequest = __webpack_require__(0);

       module.exports = IPFS;

       /**
        * The constructor object
        * @param {Object} `provider` the provider object
        * @return {Object} `ipfs` returns an IPFS instance
        * @throws if the `new` flag is not used
        */
      function IPFS(provider) {
         if (!(this instanceof IPFS)) {
           throw new Error('[ipfs-mini] IPFS instance must be instantiated with "new" flag (e.g. var ipfs = new IPFS("http://localhost:8545");).');
         }

         var self = this;
         self.setProvider(provider || {});
       }

       /**
        * Sets the provider of the IPFS instance
        * @param {Object} `provider` the provider object
        * @throws if the provider object is not an object
        */
       IPFS.prototype.setProvider = function setProvider(provider) {
         if (typeof provider !== 'object') {
           throw new Error('[ifpsjs] provider must be type Object, got \'' + typeof provider + '\'.');
         }
         var self = this;
         var data = self.provider = Object.assign({
           host: '127.0.0.1',
           pinning: true,
           port: '5001',
           protocol: 'http',
           base: '/api/v0'
         }, provider || {});
         self.requestBase = String(data.protocol + '://' + data.host + ':' + data.port + data.base);
       };

       /**
        * Sends an async data packet to an IPFS node
        * @param {Object} `opts` the options object
        * @param {Function} `cb` the provider callback
        * @callback returns an error if any, or the data from IPFS
        */
       IPFS.prototype.sendAsync = function sendAsync(opts, cb) {
         var self = this;
         var request = new XMLHttpRequest(); // eslint-disable-line
         var options = opts || {};
         var callback = cb || function emptyCallback() {};

         request.onreadystatechange = function() {
           if (request.readyState === 4 && request.timeout !== 1) {
             if (request.status !== 200) {
               callback(new Error('[ipfs-mini] status ' + request.status + ': ' + request.responseText), null);
             } else {
               try {
                 callback(null, options.jsonParse ? JSON.parse(request.responseText) : request.responseText);
               } catch (jsonError) {
                 callback(new Error('[ipfs-mini] while parsing data: \'' + String(request.responseText) + '\', error: ' + String(jsonError) + ' with provider: \'' + self.requestBase + '\'', null));
               }
             }
           }
         };

         var pinningURI = self.provider.pinning && opts.uri === '/add' ? '?pin=true' : '';

         if (options.payload) {
           request.open('POST', '' + self.requestBase + opts.uri + pinningURI);
         } else {
           request.open('GET', '' + self.requestBase + opts.uri + pinningURI);
         }

         if (options.accept) {
           request.setRequestHeader('accept', options.accept);
         }

         if (options.payload && options.boundary) {
           request.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + options.boundary);
           request.send(options.payload);
         } else {
           request.send();
         }
       };

       /**
        * creates a boundary that isn't part of the payload
        */
       function createBoundary(data) {
         while (true) {
           var boundary = '----IPFSMini' + Math.random() * 100000 + '.' + Math.random() * 100000;
           if (data.indexOf(boundary) === -1) {
             return boundary;
           }
         }
       }

       /**
        * Add an string or buffer to IPFS
        * @param {String|Buffer} `input` a single string or buffer
        * @param {Function} `callback` a callback, with (error, ipfsHash String)
        * @callback {String} `ipfsHash` returns an IPFS hash string
        */
       IPFS.prototype.add = function addData(input, callback) {
         var data = typeof input === 'object' && input.isBuffer ? input.toString('binary') : input;
         var boundary = createBoundary(data);
         var payload = '--' + boundary + '\r\nContent-Disposition: form-data; name="path"\r\nContent-Type: application/octet-stream\r\n\r\n' + data + '\r\n--' + boundary + '--';

         var addCallback = function addCallback(err, result) {
           return callback(err, !err ? result.Hash : null);
         };
         this.sendAsync({
           jsonParse: true,
           accept: 'application/json',
           uri: '/add',
           payload: payload,
           boundary: boundary
         }, addCallback);
       };

       /**
        * Add an JSON object to IPFS
        * @param {Object} `jsonData` a single JSON object
        * @param {Function} `callback` a callback, with (error, ipfsHash String)
        * @callback {String} `ipfsHash` returns an IPFS hash string
        */
       IPFS.prototype.addJSON = function addJson(jsonData, callback) {
         var self = this;
         self.add(JSON.stringify(jsonData), callback);
       };

       /**
        * Get an object stat `/object/stat` for an IPFS hash
        * @param {String} `ipfsHash` a single IPFS hash String
        * @param {Function} `callback` a callback, with (error, stats Object)
        * @callback {Object} `stats` returns the stats object for that IPFS hash
        */
       IPFS.prototype.stat = function cat(ipfsHash, callback) {
         var self = this;
         self.sendAsync({
           jsonParse: true,
           uri: '/object/stat/' + ipfsHash
         }, callback);
       };

       /**
        * Get the data from an IPFS hash
        * @param {String} `ipfsHash` a single IPFS hash String
        * @param {Function} `callback` a callback, with (error, stats Object)
        * @callback {String} `data` returns the output data
        */
       IPFS.prototype.cat = function cat(ipfsHash, callback) {
         var self = this;
         self.sendAsync({
           uri: '/cat/' + ipfsHash
         }, callback);
       };
initialize=()=> {
   return  new IPFS({
     host: 'ipfs.infura.io',
     protocol: 'https'
   });
 }

       /**
        * Get the data from an IPFS hash that is a JSON object
        * @param {String} `ipfsHash` a single IPFS hash String
        * @param {Function} `callback` a callback, with (error, json Object)
        * @callback {Object} `data` returns the output data JSON object
        */
       IPFS.prototype.catJSON = function cat(ipfsHash, callback) {
         var self = this;
         self.cat(ipfsHash, function(jsonError, jsonResult) {
           // eslint-disable-line
           if (jsonError) {
             return callback(jsonError, null);
           }

           try {
             callback(null, JSON.parse(jsonResult));
           } catch (jsonParseError) {
             callback(jsonParseError, null);
           }
         });
       };

       /***/
     }
     /******/
   ])
 });;
 //# sourceMappingURL=ipfs-mini.js.map


 export function base64ArrayBuffer(arrayBuffer) {
   let base64 = '';
   const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

   const bytes = new Uint8Array(arrayBuffer);
   const byteLength = bytes.byteLength;
   const byteRemainder = byteLength % 3;
   const mainLength = byteLength - byteRemainder;

   let a;
   let b;
   let c;
   let d;
   let chunk;

   // Main loop deals with bytes in chunks of 3
   for (let i = 0; i < mainLength; i += 3) {
     // Combine the three bytes into a single integer
     chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

     // Use bitmasks to extract 6-bit segments from the triplet
     a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
     b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
     c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
     d = chunk & 63; // 63       = 2^6 - 1

     // Convert the raw binary segments to the appropriate ASCII encoding
     base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
   }

   // Deal with the remaining bytes and padding
   if (byteRemainder === 1) {
     chunk = bytes[mainLength];

     a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

     // Set the 4 least significant bits to zero
     b = (chunk & 3) << 4; // 3   = 2^2 - 1

     base64 += `${encodings[a]}${encodings[b]}==`;
   } else if (byteRemainder === 2) {
     chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

     a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
     b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

     // Set the 2 least significant bits to zero
     c = (chunk & 15) << 2; // 15    = 2^4 - 1

     base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
   }

   return base64;
 }


 export const ipfs = initialize();

 function upload() {
   const reader = new FileReader();
   reader.onloadend = function() {


     const photo = document.getElementById("photo");
     const fileType = photo.files[0].type;

     const prefix = `data:${fileType};base64,`;
     const buf = buffer.Buffer(reader.result);
     const base64buf = prefix + base64ArrayBuffer(buf);
     // Convert data into buffer
     ipfs.add(base64buf, (err, result) => { // Upload buffer to IPFS
       if (err) {
         console.error(err)
         return
       }

       let url = `https://ipfs.io/ipfs/${result}`
       let hashBtn = document.getElementById("hash");
       hashBtn.innerHTML = url;
     })
   }
   const photo = document.getElementById("photo");
   reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
 }


 function download() {
   let hashBtn = document.getElementById("hash") || this;
   let url = hashBtn.innerHTML;
   if (!url) return;


   const req = new XMLHttpRequest();
   req.responseType = "text/html";

   req.onload = function(e) {
     var img = new Image();
     img.onload = function onload() {
       document.body.appendChild(img);
     };

     img.src = this.response;
   }

   req.open('GET', url, true);
   req.send();
 }



// default {ipfs:ipfs,base64ArrayBuffer:base64ArrayBuffer};