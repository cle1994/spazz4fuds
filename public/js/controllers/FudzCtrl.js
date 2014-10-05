app.controller('FudzController', ['$scope', '$location', '$window', 'SocketService', function($scope, $location, $window, SocketService) {
  $scope.move = '';
  $scope.win = false;
  $scope.gameshow = false;
  $scope.addrEntered = false;
  $scope.delivery = '';
  $scope.restaurantWin = '';
  $scope.sharelink = window.location.href;

  $scope.penguinstyle = {'top': '50%', 'margin-left': '0px'};
  var roomURL = $location.path().split('/').pop();

  $scope.onTextClick = function ($event) {
    $event.target.select();
  };

  $scope.executeWin = function(restaurant) {
    $scope.win = true;
    $scope.gameshow = false;
    SocketService.emit('destroy', {room: roomURL});
    $scope.restaurantWin = {id: restaurant.id, street: $scope.delivery.street, city: $scope.delivery.city, zip: $scope.delivery.zip, state: $scope.delivery.state, number: $scope.delivery.number};
    (function(){
      var ow = document.createElement('script'); 
      ow.type = 'text/javascript'; ow.async = true; ow.src = '//menus.ordr.in/js/widget.js';
      var s = document.getElementsByTagName('script')[0]; 
      s.parentNode.insertBefore(ow, s);
    })();
  }

  $scope.calculatePenguin = function() {
    var mtop = 50 - $scope.move.u + $scope.move.d;
    var mright = ($scope.move.r - $scope.move.l) * 2;
    $scope.penguinstyle = {
      'top': mtop + '%',
      'margin-left': mright + '%'
    }

    if (mtop == 11) {
      $scope.executeWin($scope.move.rest1);
    } else if (mtop == 90) {
      $scope.executeWin($scope.move.rest3);
    } else if (mright == -88) {
      $scope.executeWin($scope.move.rest4);
    } else if (mright == 82) {
      $scope.executeWin($scope.move.rest2);
    }
  }

  SocketService.on('connect', function() {
    SocketService.emit('join', { room: roomURL});
  });

  SocketService.on('move', function(data) {
    $scope.move = data;
    $scope.calculatePenguin();
  });

  SocketService.on('join data', function(data) {
    $scope.move = data;
    $scope.gameshow = true;
    $scope.addrEntered = true;
    $scope.calculatePenguin();
  });


  $scope.postAddress = function() {
    $scope.delivery = {street: $scope.street, city: $scope.city, zip: $scope.zip, state: $scope.state, number: $scope.number};
    SocketService.emit('address', {room: roomURL, addr: {street: $scope.street, city: $scope.city, zip: $scope.zip}});
    $scope.addrEntered = true;
    $scope.gameshow = true;
  }

  $scope.moveleft = function() {
    SocketService.emit('move', {room: roomURL, move: 'l'});
    $scope.calculatePenguin();
  };
  $scope.moveright = function() {
    SocketService.emit('move', {room: roomURL, move: 'r'});
    $scope.calculatePenguin();
  };
  $scope.moveup = function() {
    SocketService.emit('move', {room: roomURL, move: 'u'});
    $scope.calculatePenguin();
  };
  $scope.movedown = function() {
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