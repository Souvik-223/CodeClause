var WebCamManager = (function () {

        function WebCamManager(params) {

            this._testVideoMode = params.testVideoMode ? true : false;
            this._webcamParams = params.webcamParams;
            this._videoTag = params.videoTag ? params.videoTag : document.createElement('video');
            this._localMediaStream = null;
            this._onGetUserMediaCallback = null;
        }

        WebCamManager.prototype.getVideoTag = function () {
            var _this = this;
            return _this._videoTag;
        };


        WebCamManager.prototype.setOnGetUserMediaCallback = function (callbackFunc) {
            var _this = this;
            _this._onGetUserMediaCallback = callbackFunc;
        };

        WebCamManager.prototype.startCamera = function () {
            var _this = this;

            _this.doWebcamPolyfill();

            if (!_this.hasGetUserMedia() || _this._testVideoMode) {

                if (!_this._testVideoMode) {
                    console.error("camera not found");
                }

                _this._videoTag.src = "test_video.mp4";
                _this._videoTag.loop = true;
                _this._videoTag.play();
                if (_this._onGetUserMediaCallback) {
                    _this._onGetUserMediaCallback.bind(_this);
                    _this._onGetUserMediaCallback();
                }
            } else {


                navigator.getUserMedia(_this._webcamParams,

                    function (mediaStream) {

                        _this._localMediaStream = mediaStream;
                        //old syntax
                        //_this._videoTag.src = window.URL.createObjectURL(mediaStream);
                        _this._videoTag.srcObject = mediaStream;


                        _this._videoTag.play();

                        if (_this._onGetUserMediaCallback) {
                            _this._onGetUserMediaCallback.bind(_this);
                            _this._onGetUserMediaCallback();
                        }
                    },
                    function (e) {
                        console.error('Webcam not found', e);

                        _this._videoTag.src = "test_video.mp4";
                        _this._videoTag.loop = true;

                        _this._videoTag.play();

                        if (_this._onGetUserMediaCallback) {
                            _this._onGetUserMediaCallback.bind(_this);
                            _this._onGetUserMediaCallback();
                        }
                    });


            }
        };

        WebCamManager.prototype.stopCamera = function () {
            var _this = this;
            if (_this._localMediaStream) {
                _this._localMediaStream.getVideoTracks()[0].stop();
            }
            _this._videoTag.pause();
        };

        WebCamManager.prototype.doWebcamPolyfill = function () {
            var _this = this;
            window.URL = window.URL || window.webkitURL;
            //polyfill
            navigator.getUserMedia = navigator.getUserMedia
                || navigator.webkitGetUserMedia
                || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        };

        WebCamManager.prototype.hasGetUserMedia = function () {
            var _this = this;
            return (navigator.getUserMedia || navigator.webkitGetUserMedia
                || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        };

        return WebCamManager;
    }()
);