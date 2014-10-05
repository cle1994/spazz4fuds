app.controller('FudzController', ['$scope', '$location', '$window', 'SocketService', function($scope, $location, $window, SocketService) {
  $scope.move = '';
  var roomURL = $location.path().split('/').pop();

  SocketService.on('connect', function() {
    SocketService.emit('join', { room: roomURL});
  });

  SocketService.on('move', function(data) {
    $scope.move = data;
  });

  SocketService.on('join data', function(data) {
    $scope.move = data;
  });

  $scope.postAddress = function() {
    SocketService.emit('address', {room: roomURL, addr: {addr: $scope.street, city: $scope.city, zip: $scope.zip}});
  }

  $scope.moveleft = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'l'});
  };
  $scope.moveright = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'r'});
  };
  $scope.moveup = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'u'});
  };
  $scope.movedown = function() {
    console.log($scope.move);
    SocketService.emit('move', {room: roomURL, move: 'd'});
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