app.controller('FudzController', ['$scope', '$location', '$window', 'SocketService', function($scope, $location, $window, SocketService) {
  $scope.move = '';
  $scope.addrEntered = false;
  $scope.sharelink = window.location.href;

  $scope.penguinstyle = {'top': '50%', 'margin-left': '0px'};

  $scope.onTextClick = function ($event) {
    $event.target.select();
  };

  $scope.calculatePenguin = function() {
    var mtop = 50 - $scope.move.u + $scope.move.d;
    console.log(mtop);
    var mright = ($scope.move.r - $scope.move.l) * 2;
    $scope.penguinstyle = {
      'top': mtop + '%',
      'margin-left': mright + '%'
    }
  }

  var roomURL = $location.path().split('/').pop();

  SocketService.on('connect', function() {
    SocketService.emit('join', { room: roomURL});
  });

  SocketService.on('move', function(data) {
    $scope.move = data;
    $scope.calculatePenguin();
  });

  SocketService.on('join data', function(data) {
    $scope.move = data;
    $scope.addrEntered = true;
    $scope.calculatePenguin();
  });

  $scope.postAddress = function() {
    SocketService.emit('address', {room: roomURL, addr: {street: $scope.street, city: $scope.city, zip: $scope.zip}});
    $scope.addrEntered = true;
  }

  $scope.moveleft = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'l'});
    $scope.calculatePenguin();
  };
  $scope.moveright = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'r'});
    $scope.calculatePenguin();
  };
  $scope.moveup = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'u'});
    $scope.calculatePenguin();
  };
  $scope.movedown = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'd'});
    $scope.calculatePenguin();
  };

  angular.element($window).on('keydown', function(e) {
    if (e.keyCode == 38) {
      $scope.moveup();
    } else if (e.keyCode == 40) {
      $scope.movedown();
    } else if (e.keyCode == 37) {
      $scope.moveleft();
    } else if (e.keyCode == 39) {
      $scope.moveright();
    }
  });
}]);