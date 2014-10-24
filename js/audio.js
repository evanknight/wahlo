	window.AudioContext = window.AudioContext || window.webkitAudioContext;

/// this is this buffer loader based on http://www.html5rocks.com/en/tutorials/webaudio/intro/
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;  

    request.onload = function () {
    
        // Asynchronously decode the audio file data in request.response - based on html5rocks
        loader.context.decodeAudioData(
        request.response,

        function (buffer) {
    
         
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
        },

        function (error) {
            console.error('decodeAudioData error', error);
        });
    }

    request.onerror = function (e) {
        alert('BufferLoader: XHR error');
        console.log(e);
    }

    request.send();
}

BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);

}

/// guitar audio files
var actx = new AudioContext(),
    blst,
    bLoader = new BufferLoader(
    actx, [
        'audio/LowE.wav',
        'audio/A.wav',
        'audio/D.wav',
        'audio/G.wav',
        'audio/B.wav',
        'audio/HighE.wav'],
    done),
    isReady = false;
    
/// begin loading the audio files
bLoader.load();
       
/// when files are loaded then fadeout loading and fadein press-letters
function done(bl) {
    blst = bl;							  /// buffer list
    isReady = true;						  /// enable keys
    $("#loading").fadeOut(1000);		  /// fade out loading text
    $('#press-letters').fadeIn(3000);	  /// fade in instructions
}

/// this sets up chain so the audio plays
function play(i) {
    var src = actx.createBufferSource();  /// buffer list
    src.buffer = blst[i];  				  /// set buffer from loader
    src.connect(actx.destination);  	  /// connect to speakers
    src.start(0);  					      /// play sample now
}

/// keydown baby, switch case playing the guitar audio files in order
$('html').bind("keydown", function (key) {
    if (!isReady) return;

   switch (parseInt(key.which, 10)) {
        /// Low E
        case 69:
            play(0);
            $('html').css('background', '#334D5C');
            $('#letter').text("E - low");
            break;
        
        /// A
        case 65:
            play(1);
            $('html').css('background', '#E24471');
            $('#letter').text("A");
            break;
        
        /// D
        case 68:
            play(2);
            $('html').css('background', '#F8A842');
            $('#letter').text("D");
            break;    
        
        /// G
        case 71:
            play(3);
            $('html').css('background', '#E27A3F');
            $('#letter').text("G");
            break;
    	
    	/// Low B
    	case 66:
            play(4);
            $('html').css('background', '#DF5A49');
            $('#letter').text("B");
            break;
    	
    	/// High E
    	case 51:
            play(5);
            $('html').css('background', '#1E2D36'); 
            $('#letter').text("E - high");           
            break;        
    }
});