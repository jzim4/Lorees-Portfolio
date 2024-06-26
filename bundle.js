(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// ./node_modules/.bin/browserify ./js/contentful.js -o bundle.js

//TODO: from getEntries(), organize and export

const contentful = require('contentful')
const script = require('./script.js')

const client = contentful.createClient({
  space: 'lthd2e0mgc79',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'RS2CtbxsRt34wepE8El7CHFuTzj-BNXbWg3WcxrssRc'
});

art=[];
aboutTheArtist=[];
exhibitionStatement=[];
exhibitionDisplay=[];
updateDate = "";

client.getEntries({
  limit: 1000
}).then(function (entries) {
  console.log(entries);
  entries.items.forEach(function (entry) {
    if (entry.sys.contentType.sys.id == "art") {
      art.push(entry.fields);
    }
    else if (entry.sys.contentType.sys.id == "aboutTheArtist") {
      aboutTheArtist.push(entry.fields);
    }
    else if (entry.sys.contentType.sys.id == "exhibitionStatement") {
      exhibitionStatement.push(entry.fields);
    }
    else if (entry.sys.contentType.sys.id == "exhibitionDisplay") {
      exhibitionDisplay.push(entry.fields);
    }
  });
  script(art, aboutTheArtist, exhibitionStatement, exhibitionDisplay);
});
},{"./script.js":2,"contentful":6}],2:[function(require,module,exports){
const contentful = require('contentful')
const snippets = require('./snippets.js')

function script(art, aboutTheArtist, exhibitionStatement, exhibitionDisplay) {

  var insertProperty = function (oldString, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    var string = oldString.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  var removeSpaces = function(stringBefore) {
    return stringBefore.replace(/ /g, "");
  }

  standAlone=[];
  exhibition2023=[];

  var sortArt = function() {
    for (i in art) {
      if (art[i].collection=="Stand-alone") {
        standAlone.push(art[i]);
      }
      else if (art[i].collection=="Final Exhibition March 2023") {
        exhibition2023.push(art[i]);
      }
    }
  }

  var makeBio = function() {
    bioUrl = aboutTheArtist[0].portrait.fields.file.url;
    document.querySelector('#bioImg').style.backgroundImage = "url(\"" + bioUrl + "\")";

    text = "<p class=\"indent\">" + aboutTheArtist[0].bio + "</p>";
    prepareToBody = insertProperty(text, "br", "<p/><p class=\"indent\">");
    document.querySelector('#bioText').innerHTML = prepareToBody;
  }

  var makeGallery = function() {
    html = snippets[0];
    htmlToDisplay = "";
    for (i in standAlone) {
      imgUrl = standAlone[i].images[0].fields.file.url;
      title = standAlone[i].title;
      id = removeSpaces(standAlone[i].title);
      prepareToBody = insertProperty(html, "imgUrl", imgUrl);
      prepareToBody1 = insertProperty(prepareToBody, "title", title);
      prepareToBody2 = insertProperty(prepareToBody1, "id", id);
      htmlToDisplay += prepareToBody2;
    }
    document.querySelector('#galleryArtContainer').innerHTML = htmlToDisplay;
  }

  var exhibition2023Statement = function() {
    text = "<p class=\"indent\">" + exhibitionStatement[0].statement + "</p>";
    prepareToBody = insertProperty(text, "br", "<p/><p class=\"indent\">");
    return prepareToBody;
  }

  var make2023Exhibition = function() {

    exhibitionDisplayArt = "";
    for (i in exhibitionDisplay[0].images) {
      exhibitionDisplayArt += "<img class=\"exhibitionImage px-3 py-3\" src=\"" + exhibitionDisplay[0].images[i].fields.file.url + "\">";
    }
    exhibitionDisplayArt += "";

    document.querySelector('#exhibition2023Display').innerHTML = exhibitionDisplayArt;

    document.querySelector('#exhibition2023Statement').innerHTML = exhibition2023Statement();

    html = snippets[0];
    htmlToDisplay = "";
    for (i in exhibition2023) {
      imgUrl = exhibition2023[i].images[0].fields.file.url;
      title = exhibition2023[i].title;
      id = removeSpaces(exhibition2023[i].title);
      prepareToBody = insertProperty(html, "imgUrl", imgUrl);
      prepareToBody1 = insertProperty(prepareToBody, "title", title);
      prepareToBody2 = insertProperty(prepareToBody1, "id", id);
      htmlToDisplay += prepareToBody2;
    }
    document.querySelector('#exhibition2023ArtContainer').innerHTML = htmlToDisplay;
  }


  var setIdContent = function() {
    var modal = document.getElementById('artIdPage')

    modal.addEventListener('show.bs.modal', event => {
      const id = event.relatedTarget.getAttribute('data-bs-chooseContent');

      var artToDisplay;
      for (i in art) {
        if (removeSpaces(art[i].title)==id) {
          artToDisplay = art[i];
        }
      }
      modal.querySelector('.modal-title').textContent = artToDisplay.title;
      
      artistStatement = insertProperty(artToDisplay.artistStatement, "br", "</p><p class=\"indent\">");
      modal.querySelector("#artistStatement").innerHTML =  "<div class=\"my-2 mx-auto\" id=\"idStatement\"><p class=\"indent\">" + artistStatement + "</p></div>";

      modal.querySelector("#idTitle").textContent = artToDisplay.title;
      modal.querySelector("#year").textContent = "Year: " + artToDisplay.year;
      modal.querySelector("#medium").textContent = "Medium: " + artToDisplay.medium;
      if (artToDisplay.size) {
        modal.querySelector("#size").textContent = "Size: " + artToDisplay.size;
      }

      prepareToBody ="<div class=\"row\" id=\"idPageArt\">";
      for (j in artToDisplay.images) {
        prepareToBody += "<img class=\"idImage px-2 py-2\" src=\"" + artToDisplay.images[j].fields.file.url + "\"></img>";
      }
      prepareToBody += "</div>";
      
      modal.querySelector("#idImagesContainer").innerHTML = prepareToBody;
    });
  }

  makeBio();
  sortArt();
  makeGallery();
  make2023Exhibition();
  setIdContent();
}

module.exports = script;
},{"./snippets.js":3,"contentful":6}],3:[function(require,module,exports){
photoCard = "<button data-bs-chooseContent=\"{{id}}\" data-bs-toggle=\"modal\" data-bs-target=\"#artIdPage\" class=\"card cardContainer my-1 mx-1 px-0 py-0\"><div class=\"card-img-top cardImg\" style=\"background-image: url({{imgUrl}})\"></div><div class=\"card-body\"><p class=\"card-text fs-6\">{{title}}</p></div>"

snippets = [photoCard]

module.exports = snippets;
},{}],4:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],5:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":4,"buffer":5,"ieee754":7}],6:[function(require,module,exports){
(function (process,global,Buffer){(function (){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.contentful=t():e.contentful=t()}(self,(function(){return function(){var e={343:function(e,t,r){"use strict";var n=r(897),o=r(179),i=o(n("String.prototype.indexOf"));e.exports=function(e,t){var r=n(e,!!t);return"function"==typeof r&&i(e,".prototype.")>-1?o(r):r}},179:function(e,t,r){"use strict";var n=r(499),o=r(897),i=r(973),a=o("%TypeError%"),s=o("%Function.prototype.apply%"),c=o("%Function.prototype.call%"),u=o("%Reflect.apply%",!0)||n.call(c,s),l=o("%Object.defineProperty%",!0),f=o("%Math.max%");if(l)try{l({},"a",{value:1})}catch(e){l=null}e.exports=function(e){if("function"!=typeof e)throw new a("a function is required");var t=u(n,c,arguments);return i(t,1+f(0,e.length-(arguments.length-1)),!0)};var p=function(){return u(n,s,arguments)};l?l(e.exports,"apply",{value:p}):e.exports.apply=p},20:function(e){"use strict";var t=String.prototype.replace,r=/%20/g,n="RFC3986";e.exports={default:n,formatters:{RFC1738:function(e){return t.call(e,r,"+")},RFC3986:function(e){return String(e)}},RFC1738:"RFC1738",RFC3986:n}},780:function(e,t,r){"use strict";var n=r(889),o=r(735),i=r(20);e.exports={formats:i,parse:o,stringify:n}},735:function(e,t,r){"use strict";var n=r(285),o=Object.prototype.hasOwnProperty,i=Array.isArray,a={allowDots:!1,allowPrototypes:!1,allowSparse:!1,arrayLimit:20,charset:"utf-8",charsetSentinel:!1,comma:!1,decoder:n.decode,delimiter:"&",depth:5,ignoreQueryPrefix:!1,interpretNumericEntities:!1,parameterLimit:1e3,parseArrays:!0,plainObjects:!1,strictNullHandling:!1},s=function(e){return e.replace(/&#(\d+);/g,(function(e,t){return String.fromCharCode(parseInt(t,10))}))},c=function(e,t){return e&&"string"==typeof e&&t.comma&&e.indexOf(",")>-1?e.split(","):e},u=function(e,t,r,n){if(e){var i=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,a=/(\[[^[\]]*])/g,s=r.depth>0&&/(\[[^[\]]*])/.exec(i),u=s?i.slice(0,s.index):i,l=[];if(u){if(!r.plainObjects&&o.call(Object.prototype,u)&&!r.allowPrototypes)return;l.push(u)}for(var f=0;r.depth>0&&null!==(s=a.exec(i))&&f<r.depth;){if(f+=1,!r.plainObjects&&o.call(Object.prototype,s[1].slice(1,-1))&&!r.allowPrototypes)return;l.push(s[1])}return s&&l.push("["+i.slice(s.index)+"]"),function(e,t,r,n){for(var o=n?t:c(t,r),i=e.length-1;i>=0;--i){var a,s=e[i];if("[]"===s&&r.parseArrays)a=[].concat(o);else{a=r.plainObjects?Object.create(null):{};var u="["===s.charAt(0)&&"]"===s.charAt(s.length-1)?s.slice(1,-1):s,l=parseInt(u,10);r.parseArrays||""!==u?!isNaN(l)&&s!==u&&String(l)===u&&l>=0&&r.parseArrays&&l<=r.arrayLimit?(a=[])[l]=o:"__proto__"!==u&&(a[u]=o):a={0:o}}o=a}return o}(l,t,r,n)}};e.exports=function(e,t){var r=function(e){if(!e)return a;if(null!==e.decoder&&void 0!==e.decoder&&"function"!=typeof e.decoder)throw new TypeError("Decoder has to be a function.");if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var t=void 0===e.charset?a.charset:e.charset;return{allowDots:void 0===e.allowDots?a.allowDots:!!e.allowDots,allowPrototypes:"boolean"==typeof e.allowPrototypes?e.allowPrototypes:a.allowPrototypes,allowSparse:"boolean"==typeof e.allowSparse?e.allowSparse:a.allowSparse,arrayLimit:"number"==typeof e.arrayLimit?e.arrayLimit:a.arrayLimit,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:a.charsetSentinel,comma:"boolean"==typeof e.comma?e.comma:a.comma,decoder:"function"==typeof e.decoder?e.decoder:a.decoder,delimiter:"string"==typeof e.delimiter||n.isRegExp(e.delimiter)?e.delimiter:a.delimiter,depth:"number"==typeof e.depth||!1===e.depth?+e.depth:a.depth,ignoreQueryPrefix:!0===e.ignoreQueryPrefix,interpretNumericEntities:"boolean"==typeof e.interpretNumericEntities?e.interpretNumericEntities:a.interpretNumericEntities,parameterLimit:"number"==typeof e.parameterLimit?e.parameterLimit:a.parameterLimit,parseArrays:!1!==e.parseArrays,plainObjects:"boolean"==typeof e.plainObjects?e.plainObjects:a.plainObjects,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:a.strictNullHandling}}(t);if(""===e||null==e)return r.plainObjects?Object.create(null):{};for(var l="string"==typeof e?function(e,t){var r,u={__proto__:null},l=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,f=t.parameterLimit===1/0?void 0:t.parameterLimit,p=l.split(t.delimiter,f),y=-1,d=t.charset;if(t.charsetSentinel)for(r=0;r<p.length;++r)0===p[r].indexOf("utf8=")&&("utf8=%E2%9C%93"===p[r]?d="utf-8":"utf8=%26%2310003%3B"===p[r]&&(d="iso-8859-1"),y=r,r=p.length);for(r=0;r<p.length;++r)if(r!==y){var h,m,g=p[r],b=g.indexOf("]="),v=-1===b?g.indexOf("="):b+1;-1===v?(h=t.decoder(g,a.decoder,d,"key"),m=t.strictNullHandling?null:""):(h=t.decoder(g.slice(0,v),a.decoder,d,"key"),m=n.maybeMap(c(g.slice(v+1),t),(function(e){return t.decoder(e,a.decoder,d,"value")}))),m&&t.interpretNumericEntities&&"iso-8859-1"===d&&(m=s(m)),g.indexOf("[]=")>-1&&(m=i(m)?[m]:m),o.call(u,h)?u[h]=n.combine(u[h],m):u[h]=m}return u}(e,r):e,f=r.plainObjects?Object.create(null):{},p=Object.keys(l),y=0;y<p.length;++y){var d=p[y],h=u(d,l[d],r,"string"==typeof e);f=n.merge(f,h,r)}return!0===r.allowSparse?f:n.compact(f)}},889:function(e,t,r){"use strict";var n=r(588),o=r(285),i=r(20),a=Object.prototype.hasOwnProperty,s={brackets:function(e){return e+"[]"},comma:"comma",indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},c=Array.isArray,u=Array.prototype.push,l=function(e,t){u.apply(e,c(t)?t:[t])},f=Date.prototype.toISOString,p=i.default,y={addQueryPrefix:!1,allowDots:!1,charset:"utf-8",charsetSentinel:!1,delimiter:"&",encode:!0,encoder:o.encode,encodeValuesOnly:!1,format:p,formatter:i.formatters[p],indices:!1,serializeDate:function(e){return f.call(e)},skipNulls:!1,strictNullHandling:!1},d={},h=function e(t,r,i,a,s,u,f,p,h,m,g,b,v,w,O,S){for(var j,A=t,E=S,x=0,P=!1;void 0!==(E=E.get(d))&&!P;){var k=E.get(t);if(x+=1,void 0!==k){if(k===x)throw new RangeError("Cyclic object value");P=!0}void 0===E.get(d)&&(x=0)}if("function"==typeof p?A=p(r,A):A instanceof Date?A=g(A):"comma"===i&&c(A)&&(A=o.maybeMap(A,(function(e){return e instanceof Date?g(e):e}))),null===A){if(s)return f&&!w?f(r,y.encoder,O,"key",b):r;A=""}if("string"==typeof(j=A)||"number"==typeof j||"boolean"==typeof j||"symbol"==typeof j||"bigint"==typeof j||o.isBuffer(A))return f?[v(w?r:f(r,y.encoder,O,"key",b))+"="+v(f(A,y.encoder,O,"value",b))]:[v(r)+"="+v(String(A))];var R,T=[];if(void 0===A)return T;if("comma"===i&&c(A))w&&f&&(A=o.maybeMap(A,f)),R=[{value:A.length>0?A.join(",")||null:void 0}];else if(c(p))R=p;else{var L=Object.keys(A);R=h?L.sort(h):L}for(var U=a&&c(A)&&1===A.length?r+"[]":r,N=0;N<R.length;++N){var _=R[N],F="object"==typeof _&&void 0!==_.value?_.value:A[_];if(!u||null!==F){var C=c(A)?"function"==typeof i?i(U,_):U:U+(m?"."+_:"["+_+"]");S.set(t,x);var B=n();B.set(d,S),l(T,e(F,C,i,a,s,u,"comma"===i&&w&&c(A)?null:f,p,h,m,g,b,v,w,O,B))}}return T};e.exports=function(e,t){var r,o=e,u=function(e){if(!e)return y;if(null!==e.encoder&&void 0!==e.encoder&&"function"!=typeof e.encoder)throw new TypeError("Encoder has to be a function.");var t=e.charset||y.charset;if(void 0!==e.charset&&"utf-8"!==e.charset&&"iso-8859-1"!==e.charset)throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");var r=i.default;if(void 0!==e.format){if(!a.call(i.formatters,e.format))throw new TypeError("Unknown format option provided.");r=e.format}var n=i.formatters[r],o=y.filter;return("function"==typeof e.filter||c(e.filter))&&(o=e.filter),{addQueryPrefix:"boolean"==typeof e.addQueryPrefix?e.addQueryPrefix:y.addQueryPrefix,allowDots:void 0===e.allowDots?y.allowDots:!!e.allowDots,charset:t,charsetSentinel:"boolean"==typeof e.charsetSentinel?e.charsetSentinel:y.charsetSentinel,delimiter:void 0===e.delimiter?y.delimiter:e.delimiter,encode:"boolean"==typeof e.encode?e.encode:y.encode,encoder:"function"==typeof e.encoder?e.encoder:y.encoder,encodeValuesOnly:"boolean"==typeof e.encodeValuesOnly?e.encodeValuesOnly:y.encodeValuesOnly,filter:o,format:r,formatter:n,serializeDate:"function"==typeof e.serializeDate?e.serializeDate:y.serializeDate,skipNulls:"boolean"==typeof e.skipNulls?e.skipNulls:y.skipNulls,sort:"function"==typeof e.sort?e.sort:null,strictNullHandling:"boolean"==typeof e.strictNullHandling?e.strictNullHandling:y.strictNullHandling}}(t);"function"==typeof u.filter?o=(0,u.filter)("",o):c(u.filter)&&(r=u.filter);var f,p=[];if("object"!=typeof o||null===o)return"";f=t&&t.arrayFormat in s?t.arrayFormat:t&&"indices"in t?t.indices?"indices":"repeat":"indices";var d=s[f];if(t&&"commaRoundTrip"in t&&"boolean"!=typeof t.commaRoundTrip)throw new TypeError("`commaRoundTrip` must be a boolean, or absent");var m="comma"===d&&t&&t.commaRoundTrip;r||(r=Object.keys(o)),u.sort&&r.sort(u.sort);for(var g=n(),b=0;b<r.length;++b){var v=r[b];u.skipNulls&&null===o[v]||l(p,h(o[v],v,d,m,u.strictNullHandling,u.skipNulls,u.encode?u.encoder:null,u.filter,u.sort,u.allowDots,u.serializeDate,u.format,u.formatter,u.encodeValuesOnly,u.charset,g))}var w=p.join(u.delimiter),O=!0===u.addQueryPrefix?"?":"";return u.charsetSentinel&&("iso-8859-1"===u.charset?O+="utf8=%26%2310003%3B&":O+="utf8=%E2%9C%93&"),w.length>0?O+w:""}},285:function(e,t,r){"use strict";var n=r(20),o=Object.prototype.hasOwnProperty,i=Array.isArray,a=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}(),s=function(e,t){for(var r=t&&t.plainObjects?Object.create(null):{},n=0;n<e.length;++n)void 0!==e[n]&&(r[n]=e[n]);return r};e.exports={arrayToObject:s,assign:function(e,t){return Object.keys(t).reduce((function(e,r){return e[r]=t[r],e}),e)},combine:function(e,t){return[].concat(e,t)},compact:function(e){for(var t=[{obj:{o:e},prop:"o"}],r=[],n=0;n<t.length;++n)for(var o=t[n],a=o.obj[o.prop],s=Object.keys(a),c=0;c<s.length;++c){var u=s[c],l=a[u];"object"==typeof l&&null!==l&&-1===r.indexOf(l)&&(t.push({obj:a,prop:u}),r.push(l))}return function(e){for(;e.length>1;){var t=e.pop(),r=t.obj[t.prop];if(i(r)){for(var n=[],o=0;o<r.length;++o)void 0!==r[o]&&n.push(r[o]);t.obj[t.prop]=n}}}(t),e},decode:function(e,t,r){var n=e.replace(/\+/g," ");if("iso-8859-1"===r)return n.replace(/%[0-9a-f]{2}/gi,unescape);try{return decodeURIComponent(n)}catch(e){return n}},encode:function(e,t,r,o,i){if(0===e.length)return e;var s=e;if("symbol"==typeof e?s=Symbol.prototype.toString.call(e):"string"!=typeof e&&(s=String(e)),"iso-8859-1"===r)return escape(s).replace(/%u[0-9a-f]{4}/gi,(function(e){return"%26%23"+parseInt(e.slice(2),16)+"%3B"}));for(var c="",u=0;u<s.length;++u){var l=s.charCodeAt(u);45===l||46===l||95===l||126===l||l>=48&&l<=57||l>=65&&l<=90||l>=97&&l<=122||i===n.RFC1738&&(40===l||41===l)?c+=s.charAt(u):l<128?c+=a[l]:l<2048?c+=a[192|l>>6]+a[128|63&l]:l<55296||l>=57344?c+=a[224|l>>12]+a[128|l>>6&63]+a[128|63&l]:(u+=1,l=65536+((1023&l)<<10|1023&s.charCodeAt(u)),c+=a[240|l>>18]+a[128|l>>12&63]+a[128|l>>6&63]+a[128|63&l])}return c},isBuffer:function(e){return!(!e||"object"!=typeof e||!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e)))},isRegExp:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},maybeMap:function(e,t){if(i(e)){for(var r=[],n=0;n<e.length;n+=1)r.push(t(e[n]));return r}return t(e)},merge:function e(t,r,n){if(!r)return t;if("object"!=typeof r){if(i(t))t.push(r);else{if(!t||"object"!=typeof t)return[t,r];(n&&(n.plainObjects||n.allowPrototypes)||!o.call(Object.prototype,r))&&(t[r]=!0)}return t}if(!t||"object"!=typeof t)return[t].concat(r);var a=t;return i(t)&&!i(r)&&(a=s(t,n)),i(t)&&i(r)?(r.forEach((function(r,i){if(o.call(t,i)){var a=t[i];a&&"object"==typeof a&&r&&"object"==typeof r?t[i]=e(a,r,n):t.push(r)}else t[i]=r})),t):Object.keys(r).reduce((function(t,i){var a=r[i];return o.call(t,i)?t[i]=e(t[i],a,n):t[i]=a,t}),a)}}},381:function(e,t,r){"use strict";var n=r(900)(),o=r(897),i=n&&o("%Object.defineProperty%",!0);if(i)try{i({},"a",{value:1})}catch(e){i=!1}var a=o("%SyntaxError%"),s=o("%TypeError%"),c=r(399);e.exports=function(e,t,r){if(!e||"object"!=typeof e&&"function"!=typeof e)throw new s("`obj` must be an object or a function`");if("string"!=typeof t&&"symbol"!=typeof t)throw new s("`property` must be a string or a symbol`");if(arguments.length>3&&"boolean"!=typeof arguments[3]&&null!==arguments[3])throw new s("`nonEnumerable`, if provided, must be a boolean or null");if(arguments.length>4&&"boolean"!=typeof arguments[4]&&null!==arguments[4])throw new s("`nonWritable`, if provided, must be a boolean or null");if(arguments.length>5&&"boolean"!=typeof arguments[5]&&null!==arguments[5])throw new s("`nonConfigurable`, if provided, must be a boolean or null");if(arguments.length>6&&"boolean"!=typeof arguments[6])throw new s("`loose`, if provided, must be a boolean");var n=arguments.length>3?arguments[3]:null,o=arguments.length>4?arguments[4]:null,u=arguments.length>5?arguments[5]:null,l=arguments.length>6&&arguments[6],f=!!c&&c(e,t);if(i)i(e,t,{configurable:null===u&&f?f.configurable:!u,enumerable:null===n&&f?f.enumerable:!n,value:r,writable:null===o&&f?f.writable:!o});else{if(!l&&(n||o||u))throw new a("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");e[t]=r}}},792:function(e,t,r){e.exports=function(){"use strict";var e=Function.prototype.toString,t=Object.create,n=Object.defineProperty,o=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,a=Object.getOwnPropertySymbols,s=Object.getPrototypeOf,c=Object.prototype,u=c.hasOwnProperty,l=c.propertyIsEnumerable,f="function"==typeof a,p="function"==typeof WeakMap,y=function(){if(p)return function(){return new WeakMap};var e=function(){function e(){this._keys=[],this._values=[]}return e.prototype.has=function(e){return!!~this._keys.indexOf(e)},e.prototype.get=function(e){return this._values[this._keys.indexOf(e)]},e.prototype.set=function(e,t){this._keys.push(e),this._values.push(t)},e}();return function(){return new e}}(),d=function(r,n){var o=r.__proto__||s(r);if(!o)return t(null);var i=o.constructor;if(i===n.Object)return o===n.Object.prototype?{}:t(o);if(~e.call(i).indexOf("[native code]"))try{return new i}catch(e){}return t(o)},h=function(e,t,r,n){var o=d(e,t);for(var i in n.set(e,o),e)u.call(e,i)&&(o[i]=r(e[i],n));if(f)for(var s=a(e),c=0,p=s.length,y=void 0;c<p;++c)y=s[c],l.call(e,y)&&(o[y]=r(e[y],n));return o},m=function(e,t,r,s){var c=d(e,t);s.set(e,c);for(var u=f?i(e).concat(a(e)):i(e),l=0,p=u.length,y=void 0,h=void 0;l<p;++l)if("callee"!==(y=u[l])&&"caller"!==y)if(h=o(e,y)){h.get||h.set||(h.value=r(e[y],s));try{n(c,y,h)}catch(e){c[y]=h.value}}else c[y]=r(e[y],s);return c},g=Array.isArray,b=Object.getPrototypeOf,v=function(){return"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==r.g?r.g:(console&&console.error&&console.error('Unable to locate global object, returning "this".'),this)}();function w(e,t){var r=!(!t||!t.isStrict),n=t&&t.realm||v,o=r?m:h,i=function(e,t){if(!e||"object"!=typeof e)return e;if(t.has(e))return t.get(e);var a,s,c,u=e.__proto__||b(e),l=u&&u.constructor;if(!l||l===n.Object)return o(e,n,i,t);if(g(e)){if(r)return m(e,n,i,t);a=new l,t.set(e,a);for(var f=0,p=e.length;f<p;++f)a[f]=i(e[f],t);return a}if(e instanceof n.Date)return new l(e.getTime());if(e instanceof n.RegExp)return(a=new l(e.source,e.flags||(s=e,c="",s.global&&(c+="g"),s.ignoreCase&&(c+="i"),s.multiline&&(c+="m"),s.unicode&&(c+="u"),s.sticky&&(c+="y"),c))).lastIndex=e.lastIndex,a;if(n.Map&&e instanceof n.Map)return a=new l,t.set(e,a),e.forEach((function(e,r){a.set(r,i(e,t))})),a;if(n.Set&&e instanceof n.Set)return a=new l,t.set(e,a),e.forEach((function(e){a.add(i(e,t))})),a;if(n.Blob&&e instanceof n.Blob)return e.slice(0,e.size,e.type);if(n.Buffer&&n.Buffer.isBuffer(e))return a=n.Buffer.allocUnsafe?n.Buffer.allocUnsafe(e.length):new l(e.length),t.set(e,a),e.copy(a),a;if(n.ArrayBuffer){if(n.ArrayBuffer.isView(e))return a=new l(e.buffer.slice(0)),t.set(e,a),a;if(e instanceof n.ArrayBuffer)return a=e.slice(0),t.set(e,a),a}return"function"==typeof e.then||e instanceof Error||n.WeakMap&&e instanceof n.WeakMap||n.WeakSet&&e instanceof n.WeakSet?e:o(e,n,i,t)};return i(e,y())}return w.default=w,w.strict=function(e,t){return w(e,{isStrict:!0,realm:t?t.realm:void 0})},w}()},845:function(e){"use strict";var t=Object.prototype.toString,r=Math.max,n=function(e,t){for(var r=[],n=0;n<e.length;n+=1)r[n]=e[n];for(var o=0;o<t.length;o+=1)r[o+e.length]=t[o];return r};e.exports=function(e){var o=this;if("function"!=typeof o||"[object Function]"!==t.apply(o))throw new TypeError("Function.prototype.bind called on incompatible "+o);for(var i,a=function(e,t){for(var r=[],n=1,o=0;n<e.length;n+=1,o+=1)r[o]=e[n];return r}(arguments),s=r(0,o.length-a.length),c=[],u=0;u<s;u++)c[u]="$"+u;if(i=Function("binder","return function ("+function(e,t){for(var r="",n=0;n<e.length;n+=1)r+=e[n],n+1<e.length&&(r+=",");return r}(c)+"){ return binder.apply(this,arguments); }")((function(){if(this instanceof i){var t=o.apply(this,n(a,arguments));return Object(t)===t?t:this}return o.apply(e,n(a,arguments))})),o.prototype){var l=function(){};l.prototype=o.prototype,i.prototype=new l,l.prototype=null}return i}},499:function(e,t,r){"use strict";var n=r(845);e.exports=Function.prototype.bind||n},897:function(e,t,r){"use strict";var n,o=SyntaxError,i=Function,a=TypeError,s=function(e){try{return i('"use strict"; return ('+e+").constructor;")()}catch(e){}},c=Object.getOwnPropertyDescriptor;if(c)try{c({},"")}catch(e){c=null}var u=function(){throw new a},l=c?function(){try{return u}catch(e){try{return c(arguments,"callee").get}catch(e){return u}}}():u,f=r(923)(),p=r(372)(),y=Object.getPrototypeOf||(p?function(e){return e.__proto__}:null),d={},h="undefined"!=typeof Uint8Array&&y?y(Uint8Array):n,m={"%AggregateError%":"undefined"==typeof AggregateError?n:AggregateError,"%Array%":Array,"%ArrayBuffer%":"undefined"==typeof ArrayBuffer?n:ArrayBuffer,"%ArrayIteratorPrototype%":f&&y?y([][Symbol.iterator]()):n,"%AsyncFromSyncIteratorPrototype%":n,"%AsyncFunction%":d,"%AsyncGenerator%":d,"%AsyncGeneratorFunction%":d,"%AsyncIteratorPrototype%":d,"%Atomics%":"undefined"==typeof Atomics?n:Atomics,"%BigInt%":"undefined"==typeof BigInt?n:BigInt,"%BigInt64Array%":"undefined"==typeof BigInt64Array?n:BigInt64Array,"%BigUint64Array%":"undefined"==typeof BigUint64Array?n:BigUint64Array,"%Boolean%":Boolean,"%DataView%":"undefined"==typeof DataView?n:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":"undefined"==typeof Float32Array?n:Float32Array,"%Float64Array%":"undefined"==typeof Float64Array?n:Float64Array,"%FinalizationRegistry%":"undefined"==typeof FinalizationRegistry?n:FinalizationRegistry,"%Function%":i,"%GeneratorFunction%":d,"%Int8Array%":"undefined"==typeof Int8Array?n:Int8Array,"%Int16Array%":"undefined"==typeof Int16Array?n:Int16Array,"%Int32Array%":"undefined"==typeof Int32Array?n:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":f&&y?y(y([][Symbol.iterator]())):n,"%JSON%":"object"==typeof JSON?JSON:n,"%Map%":"undefined"==typeof Map?n:Map,"%MapIteratorPrototype%":"undefined"!=typeof Map&&f&&y?y((new Map)[Symbol.iterator]()):n,"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":"undefined"==typeof Promise?n:Promise,"%Proxy%":"undefined"==typeof Proxy?n:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":"undefined"==typeof Reflect?n:Reflect,"%RegExp%":RegExp,"%Set%":"undefined"==typeof Set?n:Set,"%SetIteratorPrototype%":"undefined"!=typeof Set&&f&&y?y((new Set)[Symbol.iterator]()):n,"%SharedArrayBuffer%":"undefined"==typeof SharedArrayBuffer?n:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":f&&y?y(""[Symbol.iterator]()):n,"%Symbol%":f?Symbol:n,"%SyntaxError%":o,"%ThrowTypeError%":l,"%TypedArray%":h,"%TypeError%":a,"%Uint8Array%":"undefined"==typeof Uint8Array?n:Uint8Array,"%Uint8ClampedArray%":"undefined"==typeof Uint8ClampedArray?n:Uint8ClampedArray,"%Uint16Array%":"undefined"==typeof Uint16Array?n:Uint16Array,"%Uint32Array%":"undefined"==typeof Uint32Array?n:Uint32Array,"%URIError%":URIError,"%WeakMap%":"undefined"==typeof WeakMap?n:WeakMap,"%WeakRef%":"undefined"==typeof WeakRef?n:WeakRef,"%WeakSet%":"undefined"==typeof WeakSet?n:WeakSet};if(y)try{null.error}catch(e){var g=y(y(e));m["%Error.prototype%"]=g}var b=function e(t){var r;if("%AsyncFunction%"===t)r=s("async function () {}");else if("%GeneratorFunction%"===t)r=s("function* () {}");else if("%AsyncGeneratorFunction%"===t)r=s("async function* () {}");else if("%AsyncGenerator%"===t){var n=e("%AsyncGeneratorFunction%");n&&(r=n.prototype)}else if("%AsyncIteratorPrototype%"===t){var o=e("%AsyncGenerator%");o&&y&&(r=y(o.prototype))}return m[t]=r,r},v={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]},w=r(499),O=r(313),S=w.call(Function.call,Array.prototype.concat),j=w.call(Function.apply,Array.prototype.splice),A=w.call(Function.call,String.prototype.replace),E=w.call(Function.call,String.prototype.slice),x=w.call(Function.call,RegExp.prototype.exec),P=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,k=/\\(\\)?/g,R=function(e,t){var r,n=e;if(O(v,n)&&(n="%"+(r=v[n])[0]+"%"),O(m,n)){var i=m[n];if(i===d&&(i=b(n)),void 0===i&&!t)throw new a("intrinsic "+e+" exists, but is not available. Please file an issue!");return{alias:r,name:n,value:i}}throw new o("intrinsic "+e+" does not exist!")};e.exports=function(e,t){if("string"!=typeof e||0===e.length)throw new a("intrinsic name must be a non-empty string");if(arguments.length>1&&"boolean"!=typeof t)throw new a('"allowMissing" argument must be a boolean');if(null===x(/^%?[^%]*%?$/,e))throw new o("`%` may not be present anywhere but at the beginning and end of the intrinsic name");var r=function(e){var t=E(e,0,1),r=E(e,-1);if("%"===t&&"%"!==r)throw new o("invalid intrinsic syntax, expected closing `%`");if("%"===r&&"%"!==t)throw new o("invalid intrinsic syntax, expected opening `%`");var n=[];return A(e,P,(function(e,t,r,o){n[n.length]=r?A(o,k,"$1"):t||e})),n}(e),n=r.length>0?r[0]:"",i=R("%"+n+"%",t),s=i.name,u=i.value,l=!1,f=i.alias;f&&(n=f[0],j(r,S([0,1],f)));for(var p=1,y=!0;p<r.length;p+=1){var d=r[p],h=E(d,0,1),g=E(d,-1);if(('"'===h||"'"===h||"`"===h||'"'===g||"'"===g||"`"===g)&&h!==g)throw new o("property names with quotes must have matching quotes");if("constructor"!==d&&y||(l=!0),O(m,s="%"+(n+="."+d)+"%"))u=m[s];else if(null!=u){if(!(d in u)){if(!t)throw new a("base intrinsic for "+e+" exists, but the property is not available.");return}if(c&&p+1>=r.length){var b=c(u,d);u=(y=!!b)&&"get"in b&&!("originalValue"in b.get)?b.get:u[d]}else y=O(u,d),u=u[d];y&&!l&&(m[s]=u)}}return u}},399:function(e,t,r){"use strict";var n=r(897)("%Object.getOwnPropertyDescriptor%",!0);if(n)try{n([],"length")}catch(e){n=null}e.exports=n},900:function(e,t,r){"use strict";var n=r(897)("%Object.defineProperty%",!0),o=function(){if(n)try{return n({},"a",{value:1}),!0}catch(e){return!1}return!1};o.hasArrayLengthDefineBug=function(){if(!o())return null;try{return 1!==n([],"length",{value:1}).length}catch(e){return!0}},e.exports=o},372:function(e){"use strict";var t={foo:{}},r=Object;e.exports=function(){return{__proto__:t}.foo===t.foo&&!({__proto__:null}instanceof r)}},923:function(e,t,r){"use strict";var n="undefined"!=typeof Symbol&&Symbol,o=r(361);e.exports=function(){return"function"==typeof n&&"function"==typeof Symbol&&"symbol"==typeof n("foo")&&"symbol"==typeof Symbol("bar")&&o()}},361:function(e){"use strict";e.exports=function(){if("function"!=typeof Symbol||"function"!=typeof Object.getOwnPropertySymbols)return!1;if("symbol"==typeof Symbol.iterator)return!0;var e={},t=Symbol("test"),r=Object(t);if("string"==typeof t)return!1;if("[object Symbol]"!==Object.prototype.toString.call(t))return!1;if("[object Symbol]"!==Object.prototype.toString.call(r))return!1;for(t in e[t]=42,e)return!1;if("function"==typeof Object.keys&&0!==Object.keys(e).length)return!1;if("function"==typeof Object.getOwnPropertyNames&&0!==Object.getOwnPropertyNames(e).length)return!1;var n=Object.getOwnPropertySymbols(e);if(1!==n.length||n[0]!==t)return!1;if(!Object.prototype.propertyIsEnumerable.call(e,t))return!1;if("function"==typeof Object.getOwnPropertyDescriptor){var o=Object.getOwnPropertyDescriptor(e,t);if(42!==o.value||!0!==o.enumerable)return!1}return!0}},313:function(e,t,r){"use strict";var n=Function.prototype.call,o=Object.prototype.hasOwnProperty,i=r(499);e.exports=i.call(n,o)},78:function(e,t){function r(e,t){var r=[],n=[];return null==t&&(t=function(e,t){return r[0]===t?"[Circular ~]":"[Circular ~."+n.slice(0,r.indexOf(t)).join(".")+"]"}),function(o,i){if(r.length>0){var a=r.indexOf(this);~a?r.splice(a+1):r.push(this),~a?n.splice(a,1/0,o):n.push(o),~r.indexOf(i)&&(i=t.call(this,o,i))}else r.push(i);return null==e?i:e.call(this,o,i)}}(e.exports=function(e,t,n,o){return JSON.stringify(e,r(t,o),n)}).getSerialize=r},501:function(e){var t,r,n=Function.prototype,o=Object.prototype,i=n.toString,a=o.hasOwnProperty,s=i.call(Object),c=o.toString,u=(t=Object.getPrototypeOf,r=Object,function(e){return t(r(e))});e.exports=function(e){if(!function(e){return!!e&&"object"==typeof e}(e)||"[object Object]"!=c.call(e)||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e))return!1;var t=u(e);if(null===t)return!0;var r=a.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&i.call(r)==s}},567:function(e){var t=Object.prototype.toString,r=Array.isArray;e.exports=function(e){return"string"==typeof e||!r(e)&&function(e){return!!e&&"object"==typeof e}(e)&&"[object String]"==t.call(e)}},527:function(e,t,r){var n="function"==typeof Map&&Map.prototype,o=Object.getOwnPropertyDescriptor&&n?Object.getOwnPropertyDescriptor(Map.prototype,"size"):null,i=n&&o&&"function"==typeof o.get?o.get:null,a=n&&Map.prototype.forEach,s="function"==typeof Set&&Set.prototype,c=Object.getOwnPropertyDescriptor&&s?Object.getOwnPropertyDescriptor(Set.prototype,"size"):null,u=s&&c&&"function"==typeof c.get?c.get:null,l=s&&Set.prototype.forEach,f="function"==typeof WeakMap&&WeakMap.prototype?WeakMap.prototype.has:null,p="function"==typeof WeakSet&&WeakSet.prototype?WeakSet.prototype.has:null,y="function"==typeof WeakRef&&WeakRef.prototype?WeakRef.prototype.deref:null,d=Boolean.prototype.valueOf,h=Object.prototype.toString,m=Function.prototype.toString,g=String.prototype.match,b=String.prototype.slice,v=String.prototype.replace,w=String.prototype.toUpperCase,O=String.prototype.toLowerCase,S=RegExp.prototype.test,j=Array.prototype.concat,A=Array.prototype.join,E=Array.prototype.slice,x=Math.floor,P="function"==typeof BigInt?BigInt.prototype.valueOf:null,k=Object.getOwnPropertySymbols,R="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?Symbol.prototype.toString:null,T="function"==typeof Symbol&&"object"==typeof Symbol.iterator,L="function"==typeof Symbol&&Symbol.toStringTag&&(Symbol.toStringTag,1)?Symbol.toStringTag:null,U=Object.prototype.propertyIsEnumerable,N=("function"==typeof Reflect?Reflect.getPrototypeOf:Object.getPrototypeOf)||([].__proto__===Array.prototype?function(e){return e.__proto__}:null);function _(e,t){if(e===1/0||e===-1/0||e!=e||e&&e>-1e3&&e<1e3||S.call(/e/,t))return t;var r=/[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;if("number"==typeof e){var n=e<0?-x(-e):x(e);if(n!==e){var o=String(n),i=b.call(t,o.length+1);return v.call(o,r,"$&_")+"."+v.call(v.call(i,/([0-9]{3})/g,"$&_"),/_$/,"")}}return v.call(t,r,"$&_")}var F=r(966),C=F.custom,B=W(C)?C:null;function I(e,t,r){var n="double"===(r.quoteStyle||t)?'"':"'";return n+e+n}function D(e){return v.call(String(e),/"/g,"&quot;")}function M(e){return!("[object Array]"!==$(e)||L&&"object"==typeof e&&L in e)}function q(e){return!("[object RegExp]"!==$(e)||L&&"object"==typeof e&&L in e)}function W(e){if(T)return e&&"object"==typeof e&&e instanceof Symbol;if("symbol"==typeof e)return!0;if(!e||"object"!=typeof e||!R)return!1;try{return R.call(e),!0}catch(e){}return!1}e.exports=function e(t,n,o,s){var c=n||{};if(H(c,"quoteStyle")&&"single"!==c.quoteStyle&&"double"!==c.quoteStyle)throw new TypeError('option "quoteStyle" must be "single" or "double"');if(H(c,"maxStringLength")&&("number"==typeof c.maxStringLength?c.maxStringLength<0&&c.maxStringLength!==1/0:null!==c.maxStringLength))throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');var h=!H(c,"customInspect")||c.customInspect;if("boolean"!=typeof h&&"symbol"!==h)throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");if(H(c,"indent")&&null!==c.indent&&"\t"!==c.indent&&!(parseInt(c.indent,10)===c.indent&&c.indent>0))throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');if(H(c,"numericSeparator")&&"boolean"!=typeof c.numericSeparator)throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');var w=c.numericSeparator;if(void 0===t)return"undefined";if(null===t)return"null";if("boolean"==typeof t)return t?"true":"false";if("string"==typeof t)return J(t,c);if("number"==typeof t){if(0===t)return 1/0/t>0?"0":"-0";var S=String(t);return w?_(t,S):S}if("bigint"==typeof t){var x=String(t)+"n";return w?_(t,x):x}var k=void 0===c.depth?5:c.depth;if(void 0===o&&(o=0),o>=k&&k>0&&"object"==typeof t)return M(t)?"[Array]":"[Object]";var C,z=function(e,t){var r;if("\t"===e.indent)r="\t";else{if(!("number"==typeof e.indent&&e.indent>0))return null;r=A.call(Array(e.indent+1)," ")}return{base:r,prev:A.call(Array(t+1),r)}}(c,o);if(void 0===s)s=[];else if(G(s,t)>=0)return"[Circular]";function V(t,r,n){if(r&&(s=E.call(s)).push(r),n){var i={depth:c.depth};return H(c,"quoteStyle")&&(i.quoteStyle=c.quoteStyle),e(t,i,o+1,s)}return e(t,c,o+1,s)}if("function"==typeof t&&!q(t)){var ee=function(e){if(e.name)return e.name;var t=g.call(m.call(e),/^function\s*([\w$]+)/);return t?t[1]:null}(t),te=Y(t,V);return"[Function"+(ee?": "+ee:" (anonymous)")+"]"+(te.length>0?" { "+A.call(te,", ")+" }":"")}if(W(t)){var re=T?v.call(String(t),/^(Symbol\(.*\))_[^)]*$/,"$1"):R.call(t);return"object"!=typeof t||T?re:K(re)}if((C=t)&&"object"==typeof C&&("undefined"!=typeof HTMLElement&&C instanceof HTMLElement||"string"==typeof C.nodeName&&"function"==typeof C.getAttribute)){for(var ne="<"+O.call(String(t.nodeName)),oe=t.attributes||[],ie=0;ie<oe.length;ie++)ne+=" "+oe[ie].name+"="+I(D(oe[ie].value),"double",c);return ne+=">",t.childNodes&&t.childNodes.length&&(ne+="..."),ne+"</"+O.call(String(t.nodeName))+">"}if(M(t)){if(0===t.length)return"[]";var ae=Y(t,V);return z&&!function(e){for(var t=0;t<e.length;t++)if(G(e[t],"\n")>=0)return!1;return!0}(ae)?"["+Z(ae,z)+"]":"[ "+A.call(ae,", ")+" ]"}if(function(e){return!("[object Error]"!==$(e)||L&&"object"==typeof e&&L in e)}(t)){var se=Y(t,V);return"cause"in Error.prototype||!("cause"in t)||U.call(t,"cause")?0===se.length?"["+String(t)+"]":"{ ["+String(t)+"] "+A.call(se,", ")+" }":"{ ["+String(t)+"] "+A.call(j.call("[cause]: "+V(t.cause),se),", ")+" }"}if("object"==typeof t&&h){if(B&&"function"==typeof t[B]&&F)return F(t,{depth:k-o});if("symbol"!==h&&"function"==typeof t.inspect)return t.inspect()}if(function(e){if(!i||!e||"object"!=typeof e)return!1;try{i.call(e);try{u.call(e)}catch(e){return!0}return e instanceof Map}catch(e){}return!1}(t)){var ce=[];return a&&a.call(t,(function(e,r){ce.push(V(r,t,!0)+" => "+V(e,t))})),X("Map",i.call(t),ce,z)}if(function(e){if(!u||!e||"object"!=typeof e)return!1;try{u.call(e);try{i.call(e)}catch(e){return!0}return e instanceof Set}catch(e){}return!1}(t)){var ue=[];return l&&l.call(t,(function(e){ue.push(V(e,t))})),X("Set",u.call(t),ue,z)}if(function(e){if(!f||!e||"object"!=typeof e)return!1;try{f.call(e,f);try{p.call(e,p)}catch(e){return!0}return e instanceof WeakMap}catch(e){}return!1}(t))return Q("WeakMap");if(function(e){if(!p||!e||"object"!=typeof e)return!1;try{p.call(e,p);try{f.call(e,f)}catch(e){return!0}return e instanceof WeakSet}catch(e){}return!1}(t))return Q("WeakSet");if(function(e){if(!y||!e||"object"!=typeof e)return!1;try{return y.call(e),!0}catch(e){}return!1}(t))return Q("WeakRef");if(function(e){return!("[object Number]"!==$(e)||L&&"object"==typeof e&&L in e)}(t))return K(V(Number(t)));if(function(e){if(!e||"object"!=typeof e||!P)return!1;try{return P.call(e),!0}catch(e){}return!1}(t))return K(V(P.call(t)));if(function(e){return!("[object Boolean]"!==$(e)||L&&"object"==typeof e&&L in e)}(t))return K(d.call(t));if(function(e){return!("[object String]"!==$(e)||L&&"object"==typeof e&&L in e)}(t))return K(V(String(t)));if("undefined"!=typeof window&&t===window)return"{ [object Window] }";if(t===r.g)return"{ [object globalThis] }";if(!function(e){return!("[object Date]"!==$(e)||L&&"object"==typeof e&&L in e)}(t)&&!q(t)){var le=Y(t,V),fe=N?N(t)===Object.prototype:t instanceof Object||t.constructor===Object,pe=t instanceof Object?"":"null prototype",ye=!fe&&L&&Object(t)===t&&L in t?b.call($(t),8,-1):pe?"Object":"",de=(fe||"function"!=typeof t.constructor?"":t.constructor.name?t.constructor.name+" ":"")+(ye||pe?"["+A.call(j.call([],ye||[],pe||[]),": ")+"] ":"");return 0===le.length?de+"{}":z?de+"{"+Z(le,z)+"}":de+"{ "+A.call(le,", ")+" }"}return String(t)};var z=Object.prototype.hasOwnProperty||function(e){return e in this};function H(e,t){return z.call(e,t)}function $(e){return h.call(e)}function G(e,t){if(e.indexOf)return e.indexOf(t);for(var r=0,n=e.length;r<n;r++)if(e[r]===t)return r;return-1}function J(e,t){if(e.length>t.maxStringLength){var r=e.length-t.maxStringLength,n="... "+r+" more character"+(r>1?"s":"");return J(b.call(e,0,t.maxStringLength),t)+n}return I(v.call(v.call(e,/(['\\])/g,"\\$1"),/[\x00-\x1f]/g,V),"single",t)}function V(e){var t=e.charCodeAt(0),r={8:"b",9:"t",10:"n",12:"f",13:"r"}[t];return r?"\\"+r:"\\x"+(t<16?"0":"")+w.call(t.toString(16))}function K(e){return"Object("+e+")"}function Q(e){return e+" { ? }"}function X(e,t,r,n){return e+" ("+t+") {"+(n?Z(r,n):A.call(r,", "))+"}"}function Z(e,t){if(0===e.length)return"";var r="\n"+t.prev+t.base;return r+A.call(e,","+r)+"\n"+t.prev}function Y(e,t){var r=M(e),n=[];if(r){n.length=e.length;for(var o=0;o<e.length;o++)n[o]=H(e,o)?t(e[o],e):""}var i,a="function"==typeof k?k(e):[];if(T){i={};for(var s=0;s<a.length;s++)i["$"+a[s]]=a[s]}for(var c in e)H(e,c)&&(r&&String(Number(c))===c&&c<e.length||T&&i["$"+c]instanceof Symbol||(S.call(/[^\w$]/,c)?n.push(t(c,e)+": "+t(e[c],e)):n.push(c+": "+t(e[c],e))));if("function"==typeof k)for(var u=0;u<a.length;u++)U.call(e,a[u])&&n.push("["+t(a[u])+"]: "+t(e[a[u]],e));return n}},370:function(e){"use strict";class t extends Error{constructor(){super("Throttled function aborted"),this.name="AbortError"}}e.exports=({limit:e,interval:r,strict:n})=>{if(!Number.isFinite(e))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(r))throw new TypeError("Expected `interval` to be a finite number");const o=new Map;let i=0,a=0;const s=[],c=n?function(){const t=Date.now();if(s.length<e)return s.push(t),0;const n=s.shift()+r;return t>=n?(s.push(t),0):(s.push(n),n-t)}:function(){const t=Date.now();return t-i>r?(a=1,i=t,0):(a<e?a++:(i+=r,a=1),i-t)};return e=>{const r=function(...t){if(!r.isEnabled)return(async()=>e.apply(this,t))();let n;return new Promise(((r,i)=>{n=setTimeout((()=>{r(e.apply(this,t)),o.delete(n)}),c()),o.set(n,i)}))};return r.abort=()=>{for(const e of o.keys())clearTimeout(e),o.get(e)(new t);o.clear(),s.splice(0,s.length)},r.isEnabled=!0,r}},e.exports.AbortError=t},973:function(e,t,r){"use strict";var n=r(897),o=r(381),i=r(900)(),a=r(399),s=n("%TypeError%"),c=n("%Math.floor%");e.exports=function(e,t){if("function"!=typeof e)throw new s("`fn` is not a function");if("number"!=typeof t||t<0||t>4294967295||c(t)!==t)throw new s("`length` must be a positive 32-bit integer");var r=arguments.length>2&&!!arguments[2],n=!0,u=!0;if("length"in e&&a){var l=a(e,"length");l&&!l.configurable&&(n=!1),l&&!l.writable&&(u=!1)}return(n||u||!r)&&(i?o(e,"length",t,!0,!0):o(e,"length",t)),e}},588:function(e,t,r){"use strict";var n=r(897),o=r(343),i=r(527),a=n("%TypeError%"),s=n("%WeakMap%",!0),c=n("%Map%",!0),u=o("WeakMap.prototype.get",!0),l=o("WeakMap.prototype.set",!0),f=o("WeakMap.prototype.has",!0),p=o("Map.prototype.get",!0),y=o("Map.prototype.set",!0),d=o("Map.prototype.has",!0),h=function(e,t){for(var r,n=e;null!==(r=n.next);n=r)if(r.key===t)return n.next=r.next,r.next=e.next,e.next=r,r};e.exports=function(){var e,t,r,n={assert:function(e){if(!n.has(e))throw new a("Side channel does not contain "+i(e))},get:function(n){if(s&&n&&("object"==typeof n||"function"==typeof n)){if(e)return u(e,n)}else if(c){if(t)return p(t,n)}else if(r)return function(e,t){var r=h(e,t);return r&&r.value}(r,n)},has:function(n){if(s&&n&&("object"==typeof n||"function"==typeof n)){if(e)return f(e,n)}else if(c){if(t)return d(t,n)}else if(r)return function(e,t){return!!h(e,t)}(r,n);return!1},set:function(n,o){s&&n&&("object"==typeof n||"function"==typeof n)?(e||(e=new s),l(e,n,o)):c?(t||(t=new c),y(t,n,o)):(r||(r={key:{},next:null}),function(e,t,r){var n=h(e,t);n?n.value=r:e.next={key:t,next:e.next,value:r}}(r,n,o))}};return n}},966:function(){}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,{a:t}),t},r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return function(){"use strict";r.r(n),r.d(n,{createClient:function(){return Jt},createGlobalOptions:function(){return St}});var e={};function t(e,t){return function(){return e.apply(t,arguments)}}r.r(e),r.d(e,{hasBrowserEnv:function(){return re},hasStandardBrowserEnv:function(){return ne},hasStandardBrowserWebWorkerEnv:function(){return ie}});const{toString:o}=Object.prototype,{getPrototypeOf:i}=Object,a=(s=Object.create(null),e=>{const t=o.call(e);return s[t]||(s[t]=t.slice(8,-1).toLowerCase())});var s;const c=e=>(e=e.toLowerCase(),t=>a(t)===e),u=e=>t=>typeof t===e,{isArray:l}=Array,f=u("undefined"),p=c("ArrayBuffer"),y=u("string"),d=u("function"),h=u("number"),m=e=>null!==e&&"object"==typeof e,g=e=>{if("object"!==a(e))return!1;const t=i(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)},b=c("Date"),v=c("File"),w=c("Blob"),O=c("FileList"),S=c("URLSearchParams");function j(e,t,{allOwnKeys:r=!1}={}){if(null==e)return;let n,o;if("object"!=typeof e&&(e=[e]),l(e))for(n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else{const o=r?Object.getOwnPropertyNames(e):Object.keys(e),i=o.length;let a;for(n=0;n<i;n++)a=o[n],t.call(null,e[a],a,e)}}function A(e,t){t=t.toLowerCase();const r=Object.keys(e);let n,o=r.length;for(;o-- >0;)if(n=r[o],t===n.toLowerCase())return n;return null}const E="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:global,x=e=>!f(e)&&e!==E,P=(k="undefined"!=typeof Uint8Array&&i(Uint8Array),e=>k&&e instanceof k);var k;const R=c("HTMLFormElement"),T=(({hasOwnProperty:e})=>(t,r)=>e.call(t,r))(Object.prototype),L=c("RegExp"),U=(e,t)=>{const r=Object.getOwnPropertyDescriptors(e),n={};j(r,((r,o)=>{let i;!1!==(i=t(r,o,e))&&(n[o]=i||r)})),Object.defineProperties(e,n)},N="abcdefghijklmnopqrstuvwxyz",_="0123456789",F={DIGIT:_,ALPHA:N,ALPHA_DIGIT:N+N.toUpperCase()+_},C=c("AsyncFunction");var B={isArray:l,isArrayBuffer:p,isBuffer:function(e){return null!==e&&!f(e)&&null!==e.constructor&&!f(e.constructor)&&d(e.constructor.isBuffer)&&e.constructor.isBuffer(e)},isFormData:e=>{let t;return e&&("function"==typeof FormData&&e instanceof FormData||d(e.append)&&("formdata"===(t=a(e))||"object"===t&&d(e.toString)&&"[object FormData]"===e.toString()))},isArrayBufferView:function(e){let t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&p(e.buffer),t},isString:y,isNumber:h,isBoolean:e=>!0===e||!1===e,isObject:m,isPlainObject:g,isUndefined:f,isDate:b,isFile:v,isBlob:w,isRegExp:L,isFunction:d,isStream:e=>m(e)&&d(e.pipe),isURLSearchParams:S,isTypedArray:P,isFileList:O,forEach:j,merge:function e(){const{caseless:t}=x(this)&&this||{},r={},n=(n,o)=>{const i=t&&A(r,o)||o;g(r[i])&&g(n)?r[i]=e(r[i],n):g(n)?r[i]=e({},n):l(n)?r[i]=n.slice():r[i]=n};for(let e=0,t=arguments.length;e<t;e++)arguments[e]&&j(arguments[e],n);return r},extend:(e,r,n,{allOwnKeys:o}={})=>(j(r,((r,o)=>{n&&d(r)?e[o]=t(r,n):e[o]=r}),{allOwnKeys:o}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,r,n)=>{e.prototype=Object.create(t.prototype,n),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),r&&Object.assign(e.prototype,r)},toFlatObject:(e,t,r,n)=>{let o,a,s;const c={};if(t=t||{},null==e)return t;do{for(o=Object.getOwnPropertyNames(e),a=o.length;a-- >0;)s=o[a],n&&!n(s,e,t)||c[s]||(t[s]=e[s],c[s]=!0);e=!1!==r&&i(e)}while(e&&(!r||r(e,t))&&e!==Object.prototype);return t},kindOf:a,kindOfTest:c,endsWith:(e,t,r)=>{e=String(e),(void 0===r||r>e.length)&&(r=e.length),r-=t.length;const n=e.indexOf(t,r);return-1!==n&&n===r},toArray:e=>{if(!e)return null;if(l(e))return e;let t=e.length;if(!h(t))return null;const r=new Array(t);for(;t-- >0;)r[t]=e[t];return r},forEachEntry:(e,t)=>{const r=(e&&e[Symbol.iterator]).call(e);let n;for(;(n=r.next())&&!n.done;){const r=n.value;t.call(e,r[0],r[1])}},matchAll:(e,t)=>{let r;const n=[];for(;null!==(r=e.exec(t));)n.push(r);return n},isHTMLForm:R,hasOwnProperty:T,hasOwnProp:T,reduceDescriptors:U,freezeMethods:e=>{U(e,((t,r)=>{if(d(e)&&-1!==["arguments","caller","callee"].indexOf(r))return!1;const n=e[r];d(n)&&(t.enumerable=!1,"writable"in t?t.writable=!1:t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+r+"'")}))}))},toObjectSet:(e,t)=>{const r={},n=e=>{e.forEach((e=>{r[e]=!0}))};return l(e)?n(e):n(String(e).split(t)),r},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,(function(e,t,r){return t.toUpperCase()+r})),noop:()=>{},toFiniteNumber:(e,t)=>(e=+e,Number.isFinite(e)?e:t),findKey:A,global:E,isContextDefined:x,ALPHABET:F,generateString:(e=16,t=F.ALPHA_DIGIT)=>{let r="";const{length:n}=t;for(;e--;)r+=t[Math.random()*n|0];return r},isSpecCompliantForm:function(e){return!!(e&&d(e.append)&&"FormData"===e[Symbol.toStringTag]&&e[Symbol.iterator])},toJSONObject:e=>{const t=new Array(10),r=(e,n)=>{if(m(e)){if(t.indexOf(e)>=0)return;if(!("toJSON"in e)){t[n]=e;const o=l(e)?[]:{};return j(e,((e,t)=>{const i=r(e,n+1);!f(i)&&(o[t]=i)})),t[n]=void 0,o}}return e};return r(e,0)},isAsyncFn:C,isThenable:e=>e&&(m(e)||d(e))&&d(e.then)&&d(e.catch)};function I(e,t,r,n,o){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack,this.message=e,this.name="AxiosError",t&&(this.code=t),r&&(this.config=r),n&&(this.request=n),o&&(this.response=o)}B.inherits(I,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:B.toJSONObject(this.config),code:this.code,status:this.response&&this.response.status?this.response.status:null}}});const D=I.prototype,M={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach((e=>{M[e]={value:e}})),Object.defineProperties(I,M),Object.defineProperty(D,"isAxiosError",{value:!0}),I.from=(e,t,r,n,o,i)=>{const a=Object.create(D);return B.toFlatObject(e,a,(function(e){return e!==Error.prototype}),(e=>"isAxiosError"!==e)),I.call(a,e.message,t,r,n,o),a.cause=e,a.name=e.name,i&&Object.assign(a,i),a};var q=I;function W(e){return B.isPlainObject(e)||B.isArray(e)}function z(e){return B.endsWith(e,"[]")?e.slice(0,-2):e}function H(e,t,r){return e?e.concat(t).map((function(e,t){return e=z(e),!r&&t?"["+e+"]":e})).join(r?".":""):t}const $=B.toFlatObject(B,{},null,(function(e){return/^is[A-Z]/.test(e)}));var G=function(e,t,r){if(!B.isObject(e))throw new TypeError("target must be an object");t=t||new FormData;const n=(r=B.toFlatObject(r,{metaTokens:!0,dots:!1,indexes:!1},!1,(function(e,t){return!B.isUndefined(t[e])}))).metaTokens,o=r.visitor||u,i=r.dots,a=r.indexes,s=(r.Blob||"undefined"!=typeof Blob&&Blob)&&B.isSpecCompliantForm(t);if(!B.isFunction(o))throw new TypeError("visitor must be a function");function c(e){if(null===e)return"";if(B.isDate(e))return e.toISOString();if(!s&&B.isBlob(e))throw new q("Blob is not supported. Use a Buffer instead.");return B.isArrayBuffer(e)||B.isTypedArray(e)?s&&"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}function u(e,r,o){let s=e;if(e&&!o&&"object"==typeof e)if(B.endsWith(r,"{}"))r=n?r:r.slice(0,-2),e=JSON.stringify(e);else if(B.isArray(e)&&function(e){return B.isArray(e)&&!e.some(W)}(e)||(B.isFileList(e)||B.endsWith(r,"[]"))&&(s=B.toArray(e)))return r=z(r),s.forEach((function(e,n){!B.isUndefined(e)&&null!==e&&t.append(!0===a?H([r],n,i):null===a?r:r+"[]",c(e))})),!1;return!!W(e)||(t.append(H(o,r,i),c(e)),!1)}const l=[],f=Object.assign($,{defaultVisitor:u,convertValue:c,isVisitable:W});if(!B.isObject(e))throw new TypeError("data must be an object");return function e(r,n){if(!B.isUndefined(r)){if(-1!==l.indexOf(r))throw Error("Circular reference detected in "+n.join("."));l.push(r),B.forEach(r,(function(r,i){!0===(!(B.isUndefined(r)||null===r)&&o.call(t,r,B.isString(i)?i.trim():i,n,f))&&e(r,n?n.concat(i):[i])})),l.pop()}}(e),t};function J(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,(function(e){return t[e]}))}function V(e,t){this._pairs=[],e&&G(e,this,t)}const K=V.prototype;K.append=function(e,t){this._pairs.push([e,t])},K.toString=function(e){const t=e?function(t){return e.call(this,t,J)}:J;return this._pairs.map((function(e){return t(e[0])+"="+t(e[1])}),"").join("&")};var Q=V;function X(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function Z(e,t,r){if(!t)return e;const n=r&&r.encode||X,o=r&&r.serialize;let i;if(i=o?o(t,r):B.isURLSearchParams(t)?t.toString():new Q(t,r).toString(n),i){const t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+i}return e}var Y=class{constructor(){this.handlers=[]}use(e,t,r){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!r&&r.synchronous,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){B.forEach(this.handlers,(function(t){null!==t&&e(t)}))}},ee={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},te={isBrowser:!0,classes:{URLSearchParams:"undefined"!=typeof URLSearchParams?URLSearchParams:Q,FormData:"undefined"!=typeof FormData?FormData:null,Blob:"undefined"!=typeof Blob?Blob:null},protocols:["http","https","file","blob","url","data"]};const re="undefined"!=typeof window&&"undefined"!=typeof document,ne=(oe="undefined"!=typeof navigator&&navigator.product,re&&["ReactNative","NativeScript","NS"].indexOf(oe)<0);var oe;const ie="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts;var ae={...e,...te},se=function(e){function t(e,r,n,o){let i=e[o++];if("__proto__"===i)return!0;const a=Number.isFinite(+i),s=o>=e.length;return i=!i&&B.isArray(n)?n.length:i,s?(B.hasOwnProp(n,i)?n[i]=[n[i],r]:n[i]=r,!a):(n[i]&&B.isObject(n[i])||(n[i]=[]),t(e,r,n[i],o)&&B.isArray(n[i])&&(n[i]=function(e){const t={},r=Object.keys(e);let n;const o=r.length;let i;for(n=0;n<o;n++)i=r[n],t[i]=e[i];return t}(n[i])),!a)}if(B.isFormData(e)&&B.isFunction(e.entries)){const r={};return B.forEachEntry(e,((e,n)=>{t(function(e){return B.matchAll(/\w+|\[(\w*)]/g,e).map((e=>"[]"===e[0]?"":e[1]||e[0]))}(e),n,r,0)})),r}return null};const ce={transitional:ee,adapter:["xhr","http"],transformRequest:[function(e,t){const r=t.getContentType()||"",n=r.indexOf("application/json")>-1,o=B.isObject(e);if(o&&B.isHTMLForm(e)&&(e=new FormData(e)),B.isFormData(e))return n?JSON.stringify(se(e)):e;if(B.isArrayBuffer(e)||B.isBuffer(e)||B.isStream(e)||B.isFile(e)||B.isBlob(e))return e;if(B.isArrayBufferView(e))return e.buffer;if(B.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();let i;if(o){if(r.indexOf("application/x-www-form-urlencoded")>-1)return function(e,t){return G(e,new ae.classes.URLSearchParams,Object.assign({visitor:function(e,t,r,n){return ae.isNode&&B.isBuffer(e)?(this.append(t,e.toString("base64")),!1):n.defaultVisitor.apply(this,arguments)}},t))}(e,this.formSerializer).toString();if((i=B.isFileList(e))||r.indexOf("multipart/form-data")>-1){const t=this.env&&this.env.FormData;return G(i?{"files[]":e}:e,t&&new t,this.formSerializer)}}return o||n?(t.setContentType("application/json",!1),function(e,t,r){if(B.isString(e))try{return(0,JSON.parse)(e),B.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(0,JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){const t=this.transitional||ce.transitional,r=t&&t.forcedJSONParsing,n="json"===this.responseType;if(e&&B.isString(e)&&(r&&!this.responseType||n)){const r=!(t&&t.silentJSONParsing)&&n;try{return JSON.parse(e)}catch(e){if(r){if("SyntaxError"===e.name)throw q.from(e,q.ERR_BAD_RESPONSE,this,null,this.response);throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ae.classes.FormData,Blob:ae.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};B.forEach(["delete","get","head","post","put","patch"],(e=>{ce.headers[e]={}}));var ue=ce;const le=B.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),fe=Symbol("internals");function pe(e){return e&&String(e).trim().toLowerCase()}function ye(e){return!1===e||null==e?e:B.isArray(e)?e.map(ye):String(e)}function de(e,t,r,n,o){return B.isFunction(n)?n.call(this,t,r):(o&&(t=r),B.isString(t)?B.isString(n)?-1!==t.indexOf(n):B.isRegExp(n)?n.test(t):void 0:void 0)}class he{constructor(e){e&&this.set(e)}set(e,t,r){const n=this;function o(e,t,r){const o=pe(t);if(!o)throw new Error("header name must be a non-empty string");const i=B.findKey(n,o);(!i||void 0===n[i]||!0===r||void 0===r&&!1!==n[i])&&(n[i||t]=ye(e))}const i=(e,t)=>B.forEach(e,((e,r)=>o(e,r,t)));return B.isPlainObject(e)||e instanceof this.constructor?i(e,t):B.isString(e)&&(e=e.trim())&&!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())?i((e=>{const t={};let r,n,o;return e&&e.split("\n").forEach((function(e){o=e.indexOf(":"),r=e.substring(0,o).trim().toLowerCase(),n=e.substring(o+1).trim(),!r||t[r]&&le[r]||("set-cookie"===r?t[r]?t[r].push(n):t[r]=[n]:t[r]=t[r]?t[r]+", "+n:n)})),t})(e),t):null!=e&&o(t,e,r),this}get(e,t){if(e=pe(e)){const r=B.findKey(this,e);if(r){const e=this[r];if(!t)return e;if(!0===t)return function(e){const t=Object.create(null),r=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let n;for(;n=r.exec(e);)t[n[1]]=n[2];return t}(e);if(B.isFunction(t))return t.call(this,e,r);if(B.isRegExp(t))return t.exec(e);throw new TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=pe(e)){const r=B.findKey(this,e);return!(!r||void 0===this[r]||t&&!de(0,this[r],r,t))}return!1}delete(e,t){const r=this;let n=!1;function o(e){if(e=pe(e)){const o=B.findKey(r,e);!o||t&&!de(0,r[o],o,t)||(delete r[o],n=!0)}}return B.isArray(e)?e.forEach(o):o(e),n}clear(e){const t=Object.keys(this);let r=t.length,n=!1;for(;r--;){const o=t[r];e&&!de(0,this[o],o,e,!0)||(delete this[o],n=!0)}return n}normalize(e){const t=this,r={};return B.forEach(this,((n,o)=>{const i=B.findKey(r,o);if(i)return t[i]=ye(n),void delete t[o];const a=e?function(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,((e,t,r)=>t.toUpperCase()+r))}(o):String(o).trim();a!==o&&delete t[o],t[a]=ye(n),r[a]=!0})),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){const t=Object.create(null);return B.forEach(this,((r,n)=>{null!=r&&!1!==r&&(t[n]=e&&B.isArray(r)?r.join(", "):r)})),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map((([e,t])=>e+": "+t)).join("\n")}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){const r=new this(e);return t.forEach((e=>r.set(e))),r}static accessor(e){const t=(this[fe]=this[fe]={accessors:{}}).accessors,r=this.prototype;function n(e){const n=pe(e);t[n]||(function(e,t){const r=B.toCamelCase(" "+t);["get","set","has"].forEach((n=>{Object.defineProperty(e,n+r,{value:function(e,r,o){return this[n].call(this,t,e,r,o)},configurable:!0})}))}(r,e),t[n]=!0)}return B.isArray(e)?e.forEach(n):n(e),this}}he.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),B.reduceDescriptors(he.prototype,(({value:e},t)=>{let r=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[r]=e}}})),B.freezeMethods(he);var me=he;function ge(e,t){const r=this||ue,n=t||r,o=me.from(n.headers);let i=n.data;return B.forEach(e,(function(e){i=e.call(r,i,o.normalize(),t?t.status:void 0)})),o.normalize(),i}function be(e){return!(!e||!e.__CANCEL__)}function ve(e,t,r){q.call(this,null==e?"canceled":e,q.ERR_CANCELED,t,r),this.name="CanceledError"}B.inherits(ve,q,{__CANCEL__:!0});var we=ve,Oe=ae.hasStandardBrowserEnv?{write(e,t,r,n,o,i){const a=[e+"="+encodeURIComponent(t)];B.isNumber(r)&&a.push("expires="+new Date(r).toGMTString()),B.isString(n)&&a.push("path="+n),B.isString(o)&&a.push("domain="+o),!0===i&&a.push("secure"),document.cookie=a.join("; ")},read(e){const t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove(e){this.write(e,"",Date.now()-864e5)}}:{write(){},read(){return null},remove(){}};function Se(e,t){return e&&!/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)?function(e,t){return t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e}(e,t):t}var je=ae.hasStandardBrowserEnv?function(){const e=/(msie|trident)/i.test(navigator.userAgent),t=document.createElement("a");let r;function n(r){let n=r;return e&&(t.setAttribute("href",n),n=t.href),t.setAttribute("href",n),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:"/"===t.pathname.charAt(0)?t.pathname:"/"+t.pathname}}return r=n(window.location.href),function(e){const t=B.isString(e)?n(e):e;return t.protocol===r.protocol&&t.host===r.host}}():function(){return!0};function Ae(e,t){let r=0;const n=function(e,t){e=e||10;const r=new Array(e),n=new Array(e);let o,i=0,a=0;return t=void 0!==t?t:1e3,function(s){const c=Date.now(),u=n[a];o||(o=c),r[i]=s,n[i]=c;let l=a,f=0;for(;l!==i;)f+=r[l++],l%=e;if(i=(i+1)%e,i===a&&(a=(a+1)%e),c-o<t)return;const p=u&&c-u;return p?Math.round(1e3*f/p):void 0}}(50,250);return o=>{const i=o.loaded,a=o.lengthComputable?o.total:void 0,s=i-r,c=n(s);r=i;const u={loaded:i,total:a,progress:a?i/a:void 0,bytes:s,rate:c||void 0,estimated:c&&a&&i<=a?(a-i)/c:void 0,event:o};u[t?"download":"upload"]=!0,e(u)}}const Ee={http:null,xhr:"undefined"!=typeof XMLHttpRequest&&function(e){return new Promise((function(t,r){let n=e.data;const o=me.from(e.headers).normalize();let i,a,{responseType:s,withXSRFToken:c}=e;function u(){e.cancelToken&&e.cancelToken.unsubscribe(i),e.signal&&e.signal.removeEventListener("abort",i)}if(B.isFormData(n))if(ae.hasStandardBrowserEnv||ae.hasStandardBrowserWebWorkerEnv)o.setContentType(!1);else if(!1!==(a=o.getContentType())){const[e,...t]=a?a.split(";").map((e=>e.trim())).filter(Boolean):[];o.setContentType([e||"multipart/form-data",...t].join("; "))}let l=new XMLHttpRequest;if(e.auth){const t=e.auth.username||"",r=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";o.set("Authorization","Basic "+btoa(t+":"+r))}const f=Se(e.baseURL,e.url);function p(){if(!l)return;const n=me.from("getAllResponseHeaders"in l&&l.getAllResponseHeaders());!function(e,t,r){const n=r.config.validateStatus;r.status&&n&&!n(r.status)?t(new q("Request failed with status code "+r.status,[q.ERR_BAD_REQUEST,q.ERR_BAD_RESPONSE][Math.floor(r.status/100)-4],r.config,r.request,r)):e(r)}((function(e){t(e),u()}),(function(e){r(e),u()}),{data:s&&"text"!==s&&"json"!==s?l.response:l.responseText,status:l.status,statusText:l.statusText,headers:n,config:e,request:l}),l=null}if(l.open(e.method.toUpperCase(),Z(f,e.params,e.paramsSerializer),!0),l.timeout=e.timeout,"onloadend"in l?l.onloadend=p:l.onreadystatechange=function(){l&&4===l.readyState&&(0!==l.status||l.responseURL&&0===l.responseURL.indexOf("file:"))&&setTimeout(p)},l.onabort=function(){l&&(r(new q("Request aborted",q.ECONNABORTED,e,l)),l=null)},l.onerror=function(){r(new q("Network Error",q.ERR_NETWORK,e,l)),l=null},l.ontimeout=function(){let t=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded";const n=e.transitional||ee;e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),r(new q(t,n.clarifyTimeoutError?q.ETIMEDOUT:q.ECONNABORTED,e,l)),l=null},ae.hasStandardBrowserEnv&&(c&&B.isFunction(c)&&(c=c(e)),c||!1!==c&&je(f))){const t=e.xsrfHeaderName&&e.xsrfCookieName&&Oe.read(e.xsrfCookieName);t&&o.set(e.xsrfHeaderName,t)}void 0===n&&o.setContentType(null),"setRequestHeader"in l&&B.forEach(o.toJSON(),(function(e,t){l.setRequestHeader(t,e)})),B.isUndefined(e.withCredentials)||(l.withCredentials=!!e.withCredentials),s&&"json"!==s&&(l.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&l.addEventListener("progress",Ae(e.onDownloadProgress,!0)),"function"==typeof e.onUploadProgress&&l.upload&&l.upload.addEventListener("progress",Ae(e.onUploadProgress)),(e.cancelToken||e.signal)&&(i=t=>{l&&(r(!t||t.type?new we(null,e,l):t),l.abort(),l=null)},e.cancelToken&&e.cancelToken.subscribe(i),e.signal&&(e.signal.aborted?i():e.signal.addEventListener("abort",i)));const y=function(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}(f);y&&-1===ae.protocols.indexOf(y)?r(new q("Unsupported protocol "+y+":",q.ERR_BAD_REQUEST,e)):l.send(n||null)}))}};B.forEach(Ee,((e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch(e){}Object.defineProperty(e,"adapterName",{value:t})}}));const xe=e=>`- ${e}`,Pe=e=>B.isFunction(e)||null===e||!1===e;var ke=e=>{e=B.isArray(e)?e:[e];const{length:t}=e;let r,n;const o={};for(let i=0;i<t;i++){let t;if(r=e[i],n=r,!Pe(r)&&(n=Ee[(t=String(r)).toLowerCase()],void 0===n))throw new q(`Unknown adapter '${t}'`);if(n)break;o[t||"#"+i]=n}if(!n){const e=Object.entries(o).map((([e,t])=>`adapter ${e} `+(!1===t?"is not supported by the environment":"is not available in the build")));let r=t?e.length>1?"since :\n"+e.map(xe).join("\n"):" "+xe(e[0]):"as no adapter specified";throw new q("There is no suitable adapter to dispatch the request "+r,"ERR_NOT_SUPPORT")}return n};function Re(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new we(null,e)}function Te(e){return Re(e),e.headers=me.from(e.headers),e.data=ge.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1),ke(e.adapter||ue.adapter)(e).then((function(t){return Re(e),t.data=ge.call(e,e.transformResponse,t),t.headers=me.from(t.headers),t}),(function(t){return be(t)||(Re(e),t&&t.response&&(t.response.data=ge.call(e,e.transformResponse,t.response),t.response.headers=me.from(t.response.headers))),Promise.reject(t)}))}const Le=e=>e instanceof me?{...e}:e;function Ue(e,t){t=t||{};const r={};function n(e,t,r){return B.isPlainObject(e)&&B.isPlainObject(t)?B.merge.call({caseless:r},e,t):B.isPlainObject(t)?B.merge({},t):B.isArray(t)?t.slice():t}function o(e,t,r){return B.isUndefined(t)?B.isUndefined(e)?void 0:n(void 0,e,r):n(e,t,r)}function i(e,t){if(!B.isUndefined(t))return n(void 0,t)}function a(e,t){return B.isUndefined(t)?B.isUndefined(e)?void 0:n(void 0,e):n(void 0,t)}function s(r,o,i){return i in t?n(r,o):i in e?n(void 0,r):void 0}const c={url:i,method:i,data:i,baseURL:a,transformRequest:a,transformResponse:a,paramsSerializer:a,timeout:a,timeoutMessage:a,withCredentials:a,withXSRFToken:a,adapter:a,responseType:a,xsrfCookieName:a,xsrfHeaderName:a,onUploadProgress:a,onDownloadProgress:a,decompress:a,maxContentLength:a,maxBodyLength:a,beforeRedirect:a,transport:a,httpAgent:a,httpsAgent:a,cancelToken:a,socketPath:a,responseEncoding:a,validateStatus:s,headers:(e,t)=>o(Le(e),Le(t),!0)};return B.forEach(Object.keys(Object.assign({},e,t)),(function(n){const i=c[n]||o,a=i(e[n],t[n],n);B.isUndefined(a)&&i!==s||(r[n]=a)})),r}const Ne={};["object","boolean","number","function","string","symbol"].forEach(((e,t)=>{Ne[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}}));const _e={};Ne.transitional=function(e,t,r){function n(e,t){return"[Axios v1.6.8] Transitional option '"+e+"'"+t+(r?". "+r:"")}return(r,o,i)=>{if(!1===e)throw new q(n(o," has been removed"+(t?" in "+t:"")),q.ERR_DEPRECATED);return t&&!_e[o]&&(_e[o]=!0,console.warn(n(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(r,o,i)}};var Fe={assertOptions:function(e,t,r){if("object"!=typeof e)throw new q("options must be an object",q.ERR_BAD_OPTION_VALUE);const n=Object.keys(e);let o=n.length;for(;o-- >0;){const i=n[o],a=t[i];if(a){const t=e[i],r=void 0===t||a(t,i,e);if(!0!==r)throw new q("option "+i+" must be "+r,q.ERR_BAD_OPTION_VALUE)}else if(!0!==r)throw new q("Unknown option "+i,q.ERR_BAD_OPTION)}},validators:Ne};const Ce=Fe.validators;class Be{constructor(e){this.defaults=e,this.interceptors={request:new Y,response:new Y}}async request(e,t){try{return await this._request(e,t)}catch(e){if(e instanceof Error){let t;Error.captureStackTrace?Error.captureStackTrace(t={}):t=new Error;const r=t.stack?t.stack.replace(/^.+\n/,""):"";e.stack?r&&!String(e.stack).endsWith(r.replace(/^.+\n.+\n/,""))&&(e.stack+="\n"+r):e.stack=r}throw e}}_request(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},t=Ue(this.defaults,t);const{transitional:r,paramsSerializer:n,headers:o}=t;void 0!==r&&Fe.assertOptions(r,{silentJSONParsing:Ce.transitional(Ce.boolean),forcedJSONParsing:Ce.transitional(Ce.boolean),clarifyTimeoutError:Ce.transitional(Ce.boolean)},!1),null!=n&&(B.isFunction(n)?t.paramsSerializer={serialize:n}:Fe.assertOptions(n,{encode:Ce.function,serialize:Ce.function},!0)),t.method=(t.method||this.defaults.method||"get").toLowerCase();let i=o&&B.merge(o.common,o[t.method]);o&&B.forEach(["delete","get","head","post","put","patch","common"],(e=>{delete o[e]})),t.headers=me.concat(i,o);const a=[];let s=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(s=s&&e.synchronous,a.unshift(e.fulfilled,e.rejected))}));const c=[];let u;this.interceptors.response.forEach((function(e){c.push(e.fulfilled,e.rejected)}));let l,f=0;if(!s){const e=[Te.bind(this),void 0];for(e.unshift.apply(e,a),e.push.apply(e,c),l=e.length,u=Promise.resolve(t);f<l;)u=u.then(e[f++],e[f++]);return u}l=a.length;let p=t;for(f=0;f<l;){const e=a[f++],t=a[f++];try{p=e(p)}catch(e){t.call(this,e);break}}try{u=Te.call(this,p)}catch(e){return Promise.reject(e)}for(f=0,l=c.length;f<l;)u=u.then(c[f++],c[f++]);return u}getUri(e){return Z(Se((e=Ue(this.defaults,e)).baseURL,e.url),e.params,e.paramsSerializer)}}B.forEach(["delete","get","head","options"],(function(e){Be.prototype[e]=function(t,r){return this.request(Ue(r||{},{method:e,url:t,data:(r||{}).data}))}})),B.forEach(["post","put","patch"],(function(e){function t(t){return function(r,n,o){return this.request(Ue(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:r,data:n}))}}Be.prototype[e]=t(),Be.prototype[e+"Form"]=t(!0)}));var Ie=Be;class De{constructor(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");let t;this.promise=new Promise((function(e){t=e}));const r=this;this.promise.then((e=>{if(!r._listeners)return;let t=r._listeners.length;for(;t-- >0;)r._listeners[t](e);r._listeners=null})),this.promise.then=e=>{let t;const n=new Promise((e=>{r.subscribe(e),t=e})).then(e);return n.cancel=function(){r.unsubscribe(t)},n},e((function(e,n,o){r.reason||(r.reason=new we(e,n,o),t(r.reason))}))}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;const t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}static source(){let e;return{token:new De((function(t){e=t})),cancel:e}}}var Me=De;const qe={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(qe).forEach((([e,t])=>{qe[t]=e}));var We=qe;const ze=function e(r){const n=new Ie(r),o=t(Ie.prototype.request,n);return B.extend(o,Ie.prototype,n,{allOwnKeys:!0}),B.extend(o,n,null,{allOwnKeys:!0}),o.create=function(t){return e(Ue(r,t))},o}(ue);ze.Axios=Ie,ze.CanceledError=we,ze.CancelToken=Me,ze.isCancel=be,ze.VERSION="1.6.8",ze.toFormData=G,ze.AxiosError=q,ze.Cancel=ze.CanceledError,ze.all=function(e){return Promise.all(e)},ze.spread=function(e){return function(t){return e.apply(null,t)}},ze.isAxiosError=function(e){return B.isObject(e)&&!0===e.isAxiosError},ze.mergeConfig=Ue,ze.AxiosHeaders=me,ze.formToJSON=e=>se(B.isHTMLForm(e)?new FormData(e):e),ze.getAdapter=ke,ze.HttpStatusCode=We,ze.default=ze;var He=ze,$e=r(792),Ge=r.n($e),Je=r(780),Ve=r.n(Je),Ke=r(567),Qe=r.n(Ke),Xe=r(370),Ze=r.n(Xe),Ye=r(501),et=r.n(Ye);function tt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function rt(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?tt(Object(r),!0).forEach((function(t){var n,o,i;n=e,o=t,i=r[t],(o=function(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}(o))in n?Object.defineProperty(n,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):n[o]=i})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):tt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function nt(e){return nt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},nt(e)}function ot(){ot=function(e,t){return new r(e,void 0,t)};var e=RegExp.prototype,t=new WeakMap;function r(e,n,o){var i=new RegExp(e,n);return t.set(i,o||t.get(e)),it(i,r.prototype)}function n(e,r){var n=t.get(r);return Object.keys(n).reduce((function(t,r){var o=n[r];if("number"==typeof o)t[r]=e[o];else{for(var i=0;void 0===e[o[i]]&&i+1<o.length;)i++;t[r]=e[o[i]]}return t}),Object.create(null))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&it(e,t)}(r,RegExp),r.prototype.exec=function(t){var r=e.exec.call(this,t);if(r){r.groups=n(r,this);var o=r.indices;o&&(o.groups=n(o,this))}return r},r.prototype[Symbol.replace]=function(r,o){if("string"==typeof o){var i=t.get(this);return e[Symbol.replace].call(this,r,o.replace(/\$<([^>]+)>/g,(function(e,t){var r=i[t];return"$"+(Array.isArray(r)?r.join("$"):r)})))}if("function"==typeof o){var a=this;return e[Symbol.replace].call(this,r,(function(){var e=arguments;return"object"!=typeof e[e.length-1]&&(e=[].slice.call(e)).push(n(e,a)),o.apply(this,e)}))}return e[Symbol.replace].call(this,r,o)},ot.apply(this,arguments)}function it(e,t){return it=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},it(e,t)}function at(e,t){if(e){if("string"==typeof e)return st(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?st(e,t):void 0}}function st(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function ct(){}var ut=function(e){return new Promise((function(t){setTimeout(t,e)}))},lt=function(e){return Math.pow(Math.SQRT2,e)},ft=ot(/(\d+)(%)/,{value:1});function pt(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:7,r=t;if(ft.test(e)){var n,o=null===(n=e.match(ft))||void 0===n?void 0:n.groups;if(o&&o.value){var i=parseInt(o.value)/100;r=Math.round(t*i)}}return Math.min(30,Math.max(1,r))}function yt(e,t){return t("info","Throttle request to ".concat(e,"/s")),Ze()({limit:e,interval:1e3,strict:!1})}var dt=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"auto",r=e.defaults.logHandler,n=void 0===r?ct:r,o=Qe()(t)?pt(t):pt("auto",t),i=yt(o,n),a=!1,s=e.interceptors.request.use((function(e){return i((function(){return e}))()}),(function(e){return Promise.reject(e)})),c=e.interceptors.response.use((function(r){if(!a&&Qe()(t)&&("auto"===t||ft.test(t))&&r.headers&&r.headers["x-contentful-ratelimit-second-limit"]){var c=parseInt(r.headers["x-contentful-ratelimit-second-limit"]),u=pt(t,c);u!==o&&(s&&e.interceptors.request.eject(s),o=u,i=yt(u,n),s=e.interceptors.request.use((function(e){return i((function(){return e}))()}),(function(e){return Promise.reject(e)}))),a=!0}return r}),(function(e){return Promise.reject(e)}));return function(){e.interceptors.request.eject(s),e.interceptors.response.eject(c)}},ht=/^(?!\w+:\/\/)([^\s:]+\.?[^\s:]+)(?::(\d+))?(?!:)$/;function mt(e,t){var r=rt(rt({},{insecure:!1,retryOnError:!0,logHandler:function(e,t){if("error"===e&&t){var r=[t.name,t.message].filter((function(e){return e})).join(" - ");return console.error("[error] ".concat(r)),void console.error(t)}console.log("[".concat(e,"] ").concat(t))},headers:{},httpAgent:!1,httpsAgent:!1,timeout:3e4,throttle:0,basePath:"",adapter:void 0,maxContentLength:1073741824,maxBodyLength:1073741824}),t);if(!r.accessToken){var n=new TypeError("Expected parameter accessToken");throw r.logHandler("error",n),n}var o,i,a=r.insecure?"http":"https",s=r.space?"".concat(r.space,"/"):"",c=r.defaultHostname,u=r.insecure?80:443;if(r.host&&ht.test(r.host)){var l=r.host.split(":");if(2===l.length){var f=(i=2,function(e){if(Array.isArray(e))return e}(o=l)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i,a,s=[],c=!0,u=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=i.call(r)).done)&&(s.push(n.value),s.length!==t);c=!0);}catch(e){u=!0,o=e}finally{try{if(!c&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(u)throw o}}return s}}(o,i)||at(o,i)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}());c=f[0],u=f[1]}else c=l[0]}r.basePath&&(r.basePath="/".concat(r.basePath.split("/").filter(Boolean).join("/")));var p=t.baseURL||"".concat(a,"://").concat(c,":").concat(u).concat(r.basePath,"/spaces/").concat(s);r.headers.Authorization||"function"==typeof r.accessToken||(r.headers.Authorization="Bearer "+r.accessToken);var y={baseURL:p,headers:r.headers,httpAgent:r.httpAgent,httpsAgent:r.httpsAgent,proxy:r.proxy,timeout:r.timeout,adapter:r.adapter,maxContentLength:r.maxContentLength,maxBodyLength:r.maxBodyLength,paramsSerializer:{serialize:function(e){return Ve().stringify(e)}},logHandler:r.logHandler,responseLogger:r.responseLogger,requestLogger:r.requestLogger,retryOnError:r.retryOnError},d=e.create(y);return d.httpClientParams=t,d.cloneWithNewParams=function(r){return mt(e,rt(rt({},Ge()(t)),r))},r.onBeforeRequest&&d.interceptors.request.use(r.onBeforeRequest),"function"==typeof r.accessToken&&function(e,t){e.interceptors.request.use((function(e){return t().then((function(t){return e.headers.set("Authorization","Bearer ".concat(t)),e}))}))}(d,r.accessToken),r.throttle&&dt(d,r.throttle),function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5,r=e.defaults,n=r.responseLogger,o=void 0===n?ct:n,i=r.requestLogger,a=void 0===i?ct:i;e.interceptors.request.use((function(e){return a(e),e}),(function(e){return a(e),Promise.reject(e)})),e.interceptors.response.use((function(e){return o(e),e}),(function(r){var n=r.response,i=r.config;if(o(r),!i||!e.defaults.retryOnError)return Promise.reject(r);var a=i.attempts||1;if(a>t)return r.attempts=i.attempts,Promise.reject(r);var s=null,c=lt(a);return n?n.status>=500&&n.status<600?s="Server ".concat(n.status):429===n.status&&(s="Rate limit",n.headers&&r.response.headers["x-contentful-ratelimit-reset"]&&(c=n.headers["x-contentful-ratelimit-reset"])):s="Connection",s?(c=Math.floor(1e3*c+200*Math.random()+500),e.defaults.logHandler("warning","".concat(s," error occurred. Waiting for ").concat(c," ms before retrying...")),i.attempts=a+1,delete i.httpAgent,delete i.httpsAgent,ut(c).then((function(){return e(i)}))):Promise.reject(r)}))}(d,r.retryLimit),r.onError&&d.interceptors.response.use((function(e){return e}),r.onError),d}function gt(e){var t=e.query,r={};return delete t.resolveLinks,r.params=Ge()(t),r}function bt(e){var t,r=function(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=at(e))){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==r.return||r.return()}finally{if(s)throw i}}}}(Object.getOwnPropertyNames(e));try{for(r.s();!(t=r.n()).done;){var n=e[t.value];n&&"object"===nt(n)&&bt(n)}}catch(e){r.e(e)}finally{r.f()}return Object.freeze(e)}function vt(){var e=window;if(!e)return null;var t=e.navigator.userAgent,r=e.navigator.platform;return-1!==["Macintosh","MacIntel","MacPPC","Mac68K"].indexOf(r)?"macOS":-1!==["iPhone","iPad","iPod"].indexOf(r)?"iOS":-1!==["Win32","Win64","Windows","WinCE"].indexOf(r)?"Windows":/Android/.test(t)?"Android":/Linux/.test(r)?"Linux":null}function wt(e){return Object.defineProperty(e,"toPlainObject",{enumerable:!1,configurable:!1,writable:!1,value:function(){return Ge()(this)}})}function Ot(e){var t,r=e.config,n=e.response;if(r&&r.headers&&r.headers.Authorization){var o="...".concat(r.headers.Authorization.toString().substr(-5));r.headers.Authorization="Bearer ".concat(o)}if(!et()(n)||!et()(r))throw e;var i,a=null==n?void 0:n.data,s={status:null==n?void 0:n.status,statusText:null==n?void 0:n.statusText,message:"",details:{}};r&&et()(r)&&(s.request={url:r.url,headers:r.headers,method:r.method,payloadData:r.data}),a&&"object"===nt(a)&&("requestId"in a&&(s.requestId=a.requestId||"UNKNOWN"),"message"in a&&(s.message=a.message||""),"details"in a&&(s.details=a.details||{}),t=null===(i=a.sys)||void 0===i?void 0:i.id);var c=new Error;c.name=t&&"Unknown"!==t?t:"".concat(null==n?void 0:n.status," ").concat(null==n?void 0:n.statusText);try{c.message=JSON.stringify(s,null,"  ")}catch(e){var u;c.message=null!==(u=null==s?void 0:s.message)&&void 0!==u?u:""}throw c}function St(e){return function(t){return Object.assign({},e,t)}}var jt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function At(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}var Et={},xt=function(e,t){var r=t.entryId,n=t.linkType,o=t.spaceId,i=t.environmentId;return o&&i?e.get(o+"!"+i+"!"+n+"!"+r):e.get(n+"!"+r)},Pt=function(e,t){var r=t.sys,n=r.type,o=r.linkType;if("ResourceLink"===n){var i=function(e){var t=/.*:spaces\/([^/]+)(?:\/environments\/([^/]+))?\/entries\/([^/]+)$/;if(t.test(e)){var r=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{!n&&s.return&&s.return()}finally{if(o)throw i}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}(e.match(t),4),n=(r[0],r[1]),o=r[2];return{spaceId:n,environmentId:void 0===o?"master":o,entryId:r[3]}}}(t.sys.urn),a=i.spaceId,s=i.environmentId,c=i.entryId,u=o.split(":")[1];return xt(e,{linkType:u,entryId:c,spaceId:a,environmentId:s})||Et}var l=t.sys.id;return xt(e,{linkType:o,entryId:l})||Et},kt=function e(t,r,n,o){if(r(t))return n(t);if(t&&"object"===(void 0===t?"undefined":jt(t))){for(var i in t)t.hasOwnProperty(i)&&(t[i]=e(t[i],r,n,o));o&&(t=function(e){if(Array.isArray(e))return e.filter((function(e){return e!==Et}));for(var t in e)e[t]===Et&&delete e[t];return e}(t))}return t},Rt=function(e,t){if(t=t||{},!e.items)return[];var r=Ge()(e),n=Object.keys(r.includes||{}).reduce((function(t,r){return[].concat(At(t),At(e.includes[r]))}),[]),o=[].concat(At(r.items),At(n)).filter((function(e){return Boolean(e.sys)})),i=new Map(o.reduce((function(e,t){var r,n=(r=t.sys,r.space&&r.environment?[r.type+"!"+r.id,r.space.sys.id+"!"+r.environment.sys.id+"!"+r.type+"!"+r.id]:[r.type+"!"+r.id]).map((function(e){return[e,t]}));return e.push.apply(e,At(n)),e}),[]));return o.forEach((function(e){var r=function(e,t){return Array.isArray(t)?Object.keys(e).filter((function(e){return-1!==t.indexOf(e)})).reduce((function(t,r){return t[r]=e[r],t}),{}):e}(e,t.itemEntryPoints);Object.assign(e,kt(r,(function(e){return(t=e)&&t.sys&&"Link"===t.sys.type||function(e){return e&&e.sys&&"ResourceLink"===e.sys.type}(e);var t}),(function(e){return function(e,t,r){var n=Pt(e,t);return n===Et?r?n:t:n}(i,e,t.removeUnresolved)}),t.removeUnresolved))})),r.items},Tt=r(78),Lt=r.n(Tt);function Ut(e){return Object.defineProperty(e,"stringifySafe",{enumerable:!1,configurable:!1,writable:!1,value:function(e=null,t=""){return Lt()(this,e,t,((e,t)=>({sys:{type:"Link",linkType:"Entry",id:t.sys.id,circular:!0}})))}})}async function Nt(e,t,r){if(!t||!t.initial&&!t.nextSyncToken&&!t.nextPageToken)throw new Error("Please provide one of `initial`, `nextSyncToken` or `nextPageToken` parameters for syncing");if(t.content_type&&!t.type)t.type="Entry";else if(t.content_type&&t.type&&"Entry"!==t.type)throw new Error("When using the `content_type` filter your `type` parameter cannot be different from `Entry`.");const{withoutLinkResolution:n,withoutUnresolvableLinks:o,paginate:i}={withoutLinkResolution:!1,withoutUnresolvableLinks:!1,paginate:!0,...r},a=await _t(e,[],t,{paginate:i});n||(a.items=Rt(a,{removeUnresolved:o,itemEntryPoints:["fields"]}));const s=function(e){const t=e=>(t,r)=>(r.sys.type===e&&t.push(wt(r)),t);return{entries:e.reduce(t("Entry"),[]),assets:e.reduce(t("Asset"),[]),deletedEntries:e.reduce(t("DeletedEntry"),[]),deletedAssets:e.reduce(t("DeletedAsset"),[])}}(a.items);return a.nextSyncToken&&(s.nextSyncToken=a.nextSyncToken),a.nextPageToken&&(s.nextPageToken=a.nextPageToken),bt((c=Ut(wt(s))).sys||{}),c;var c}async function _t(e,t,r,{paginate:n}){const o=(i=r).nextPageToken?{sync_token:i.nextPageToken}:i.nextSyncToken?{sync_token:i.nextSyncToken}:i.sync_token?{sync_token:i.sync_token}:i;var i;const a=(await e.get("sync",gt({query:o}))).data||{};return t=t.concat(a.items||[]),a.nextPageUrl?n?(delete o.initial,o.sync_token=Ft(a.nextPageUrl),_t(e,t,o,{paginate:n})):{items:t,nextPageToken:Ft(a.nextPageUrl)}:a.nextSyncUrl?{items:t,nextSyncToken:Ft(a.nextSyncUrl)}:{items:[]}}function Ft(e){const t=e.split("?");return t.length>0?t[1].replace("sync_token=",""):""}function Ct(e){const t={};let r=!1;for(const n in e)Array.isArray(e[n])&&(t[n]=e[n].join(","),r=!0);return r?{...e,...t}:e}function Bt(e){if(!e.select)return e;const t=Array.isArray(e.select)?e.select:e.select.split(",").map((e=>e.trim())),r=new Set(t);return r.has("sys")?e:(r.add("sys.id"),r.add("sys.type"),{...e,select:[...r].join(",")})}function It(e,{resolveLinks:t,removeUnresolved:r}){const n=Ut(e);return t&&(n.items=Rt(n,{removeUnresolved:r,itemEntryPoints:["fields"]})),n}class Dt extends Error{constructor(e,t){super(`Invalid "${e}" provided, `+t),this.name="ValidationError"}}function Mt(e,t){t?function(e){if(e.locale)throw new Dt("locale","The `locale` parameter is not allowed")}(e):function(e){if("*"===e.locale)throw new Dt("locale","The use of locale='*' is no longer supported.To fetch an entry in all existing locales, \n      use client.withAllLocales instead of the locale='*' parameter.")}(e)}function qt(e){if("resolveLinks"in e)throw new Dt("resolveLinks","The use of the 'resolveLinks' parameter is no longer supported. By default, links are resolved. \n      If you do not want to resolve links, use client.withoutLinkResolution.")}function Wt(e){if("removeUnresolved"in e)throw new Dt("removeUnresolved","The use of the 'removeUnresolved' parameter is no longer supported. By default, unresolved links are kept as link objects.\n      If you do not want to include unresolved links, use client.withoutUnresolvableLinks.")}function zt(e){for(const t in e){const r=e[t];if("object"==typeof r&&null!==r&&!Array.isArray(r))throw new Error(`Objects are not supported as value for the "${t}" query parameter.`)}}class Ht extends Error{sys;details;constructor(e,t,r){super("The resource could not be found."),this.sys={type:"Error",id:"NotFound"},this.details={type:"Entry",id:e,environment:t,space:r}}}function $t({http:e,getGlobalOptions:t},r){const n=(e="unknown")=>new Ht(e,t().environment,t().space),o=e=>{let r="space"===e?t().spaceBaseUrl:t().environmentBaseUrl;if(!r)throw new Error("Please define baseUrl for "+e);return r.endsWith("/")||(r+="/"),r};async function i({context:t,path:r,config:n}){const i=o(t);try{return(await e.get(i+r,n)).data}catch(e){Ot(e)}}async function a(e,t){const{withoutLinkResolution:r,withoutUnresolvableLinks:n}=t;try{return It(await i({context:"environment",path:"entries",config:gt({query:Ct(Bt(e))})}),{resolveLinks:!r??!0,removeUnresolved:n??!1})}catch(e){Ot(e)}}return{version:"10.8.6",getSpace:async function(){return i({context:"space",path:""})},getContentType:async function(e){return i({context:"environment",path:`content_types/${e}`})},getContentTypes:async function(e={}){return i({context:"environment",path:"content_types",config:gt({query:e})})},getAsset:async function(e,t={}){return async function(e,t,r={withAllLocales:!1,withoutLinkResolution:!1,withoutUnresolvableLinks:!1}){const{withAllLocales:n}=r;Mt(t,n),zt(t);return async function(e,t){try{return i({context:"environment",path:`assets/${e}`,config:gt({query:Bt(t)})})}catch(e){Ot(e)}}(e,n?{...t,locale:"*"}:t)}(e,t,r)},getAssets:async function(e={}){return async function(e,t={withAllLocales:!1,withoutLinkResolution:!1,withoutUnresolvableLinks:!1}){const{withAllLocales:r}=t;Mt(e,r),zt(e);return async function(e){try{return i({context:"environment",path:"assets",config:gt({query:Ct(Bt(e))})})}catch(e){Ot(e)}}(r?{...e,locale:"*"}:e)}(e,r)},getTag:async function(e){return i({context:"environment",path:`tags/${e}`})},getTags:async function(e={}){return zt(e),i({context:"environment",path:"tags",config:gt({query:Ct(Bt(e))})})},getLocales:async function(e={}){return zt(e),i({context:"environment",path:"locales",config:gt({query:Bt(e)})})},parseEntries:function(e){return function(e,t={withAllLocales:!1,withoutLinkResolution:!1,withoutUnresolvableLinks:!1}){return function(e,t){const{withoutLinkResolution:r,withoutUnresolvableLinks:n}=t;return It(e,{resolveLinks:!r??!0,removeUnresolved:n??!1})}(e,t)}(e,r)},sync:async function(n,o={paginate:!0}){return async function(r,n,o={withAllLocales:!1,withoutLinkResolution:!1,withoutUnresolvableLinks:!1}){qt(r),Wt(r);const i={...n,...o};return function(e){e.defaults.baseURL=t().environmentBaseUrl}(e),Nt(e,r,i)}(n,o,r)},getEntry:async function(e,t={}){return async function(e,t,r={withAllLocales:!1,withoutLinkResolution:!1,withoutUnresolvableLinks:!1}){const{withAllLocales:o}=r;return Mt(t,o),qt(t),Wt(t),zt(t),async function(e,t,r){if(!e)throw n(e);try{const o=await a({"sys.id":e,...t},r);if(o.items.length>0)return o.items[0];throw n(e)}catch(e){Ot(e)}}(e,o?{...t,locale:"*"}:t,r)}(e,t,r)},getEntries:async function(e={}){return async function(e,t={withAllLocales:!1,withoutLinkResolution:!1,withoutUnresolvableLinks:!1}){const{withAllLocales:r}=t;return Mt(e,r),qt(e),Wt(e),zt(e),a(r?{...e,locale:"*"}:e,t)}(e,r)},createAssetKey:async function(t){try{const e=Math.floor(Date.now()/1e3);!function(e,t,r){if(r=r||{},"number"!=typeof t)throw new Dt(e,`only numeric values are allowed for timestamps, provided type was "${typeof t}"`);if(r.maximum&&t>r.maximum)throw new Dt(e,`value (${t}) cannot be further in the future than expected maximum (${r.maximum})`);if(r.now&&t<r.now)throw new Dt(e,`value (${t}) cannot be in the past, current time was ${r.now}`)}("expiresAt",t,{maximum:e+172800,now:e})}catch(e){Ot(e)}return async function({context:t,path:r,data:n,config:i}){const a=o(t);try{return(await e.post(a+r,n,i)).data}catch(e){Ot(e)}}({context:"environment",path:"asset_keys",data:{expiresAt:t}})}}}const Gt=({http:e,getGlobalOptions:t})=>{function r(n){return function({http:e,getGlobalOptions:t},r,n){const o=$t({http:e,getGlobalOptions:t},r);return Object.defineProperty(o,"withAllLocales",{get:()=>n({...r,withAllLocales:!0})}),Object.defineProperty(o,"withoutLinkResolution",{get:()=>n({...r,withoutLinkResolution:!0})}),Object.defineProperty(o,"withoutUnresolvableLinks",{get:()=>n({...r,withoutUnresolvableLinks:!0})}),Object.create(o)}({http:e,getGlobalOptions:t},n,r)}return{...$t({http:e,getGlobalOptions:t},{withoutLinkResolution:!1,withAllLocales:!1,withoutUnresolvableLinks:!1}),get withAllLocales(){return r({withAllLocales:!0,withoutLinkResolution:!1,withoutUnresolvableLinks:!1})},get withoutLinkResolution(){return r({withAllLocales:!1,withoutLinkResolution:!0,withoutUnresolvableLinks:!1})},get withoutUnresolvableLinks(){return r({withAllLocales:!1,withoutLinkResolution:!1,withoutUnresolvableLinks:!0})}}};function Jt(e){if(!e.accessToken)throw new TypeError("Expected parameter accessToken");if(!e.space)throw new TypeError("Expected parameter space");qt(e),Wt(e);const t={resolveLinks:!0,removeUnresolved:!1,defaultHostname:"cdn.contentful.com",environment:"master",...e},r=function(e,t,r,n){var o=[];t&&o.push("app ".concat(t)),r&&o.push("integration ".concat(r)),n&&o.push("feature "+n),o.push("sdk ".concat(e));var i=null;try{"undefined"!=typeof window&&"navigator"in window&&"product"in window.navigator&&"ReactNative"===window.navigator.product?(i=vt(),o.push("platform ReactNative")):"undefined"==typeof process||process.browser?(i=vt(),o.push("platform browser")):(i=function(){var e=process.platform||"linux",t=process.version||"0.0.0",r={android:"Android",aix:"Linux",darwin:"macOS",freebsd:"Linux",linux:"Linux",openbsd:"Linux",sunos:"Linux",win32:"Windows"};return e in r?"".concat(r[e]||"Linux","/").concat(t):null}(),o.push("platform node.js/".concat(process.versions&&process.versions.node?"v".concat(process.versions.node):process.version)))}catch(e){i=null}return i&&o.push("os ".concat(i)),"".concat(o.filter((function(e){return""!==e})).join("; "),";")}("contentful.js/10.8.6",t.application,t.integration);t.headers={...t.headers,"Content-Type":"application/vnd.contentful.delivery.v1+json","X-Contentful-User-Agent":r};const n=mt(He,t);if(!n.defaults.baseURL)throw new Error("Please define a baseURL");const o=St({space:t.space,environment:t.environment,spaceBaseUrl:n.defaults.baseURL,environmentBaseUrl:`${n.defaults.baseURL}environments/${t.environment}`});return n.defaults.baseURL=o({}).environmentBaseUrl,Gt({http:n,getGlobalOptions:o})}}(),n}()}));
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"_process":8,"buffer":5}],7:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
