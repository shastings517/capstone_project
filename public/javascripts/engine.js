app.controller('TestApp', function($scope) {
    $scope.count = 1;
    $scope.countLove = 0;
    $scope.countHate = 0;
    $scope.countMiddle = 0;
    $scope.countPass = 0;
    $scope.twitts = [
        // {user: {screen_name: 'Test'}, text: 'Text twitt'}
    ];


    $scope.start = function(){


    var socket = io.connect();
    window.socket = socket;
    socket.on('newTwitt', function (item) {
        item.score = 0;
        console.log(item);
        $scope.twitts.push(item);
        if (item && !item.limit) {
            $scope.count++;
        }
        if (item.limit) {
            $scope.countPass += item.limit.track;
        }
        else if ((item.text.indexOf('love') != -1) && (item.text.indexOf('hate') != -1)) {
            $scope.countMiddle++;
            item.score++;
        }
        else if (item.text.indexOf('love') != -1) {
            $scope.countLove++;
            item.score++;
            item.color = '#57BB7E';
        }
        else {
            $scope.countHate++;
            item.score--;
            item.color = '#FF9B6D';
        }
        // console.log(JSON.stringify(item));
        if ($scope.twitts.length > 5)
            $scope.twitts.splice(0, 1);
        $scope.$apply();

    });
};
    $scope.stop = function(){
        socket.disconnect();
    };

});