var twitter = require('twitter');
var util = require('util');
var debug = require('debug')('explorer');

var io = require('socket.io');

exports.index = function (http) {
    io = io(http);
    return function (req, res) {
        res.render('index', {title: 'Express'});
        if (req.session.oauth) {
            InitStream(req.session);
        }
    };
};

var isActive = false;
var InitStream = function (session) {
    var twit = new twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: session.oauth.access_token,
        access_token_secret: session.oauth.access_token_secret
    });

    if (!isActive) {
        debug('init Stream');


        twit.stream(
            'statuses/filter.json',
            {track: "trump"}, 
            function (stream) {
                stream.on('data', function (data) {
                    // if (data.user) {
                    //     debug(data.user.screen_name + " : " + data.text);
                    // } else {
                    //     debug(data);
                    // }
                    io.sockets.emit('newTwitt', data);
                    // console.log(data);
                    // throw  new Exception('end');
                });
                stream.on('end', function (b) {
                    debug('end stream', arguments);
                    isActive = false;
                    InitStream(session);
                });
                stream.on('destroy', function (b) {
                    debug('destroy stream', b.toString());
                    isActive = false;
                    InitStream(session);
                });
            }
        );
        isActive = true;
    }
};