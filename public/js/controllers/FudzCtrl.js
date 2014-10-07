app.controller('FudzController', ['$scope', '$location', '$window', 'SocketService', function($scope, $location, $window, SocketService) {

  $scope.move = {};
  $scope.restaurants = {
    rest1: '',
    rest2: '',
    rest3: '',
    rest4: ''
  };
  $scope.penguinstyle = {'top': '50%', 'margin-left': '0px'};

  $scope.win = false;
  $scope.gameshow = false;
  $scope.addrEntered = false;
  $scope.address = {};
  $scope.restaurantWin = {};
  $scope.sharelink = window.location.href;
  var roomURL = $location.path().split('/').pop();

  $scope.onTextClick = function ($event) {
    $event.target.select();
  };

  $scope.executeWin = function(restaurant) {
    $scope.win = true;
    $scope.gameshow = false;
    SocketService.emit('destroy', {room: roomURL});
    $scope.restaurantWin = {
      id: restaurant,
      street: $scope.address.street,
      city: $scope.address.city,
      zip: $scope.address.zip,
      state:$scope.address.state,
      number: $scope.address.number
    };

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

    if (mtop <= 10) {
      $scope.executeWin($scope.restaurants.rest2.id);
    } else if (mtop >= 90) {
      $scope.executeWin($scope.restaurants.rest4.id);
    } else if (mright <= -86) {
      $scope.executeWin($scope.restaurants.rest1.id);
    } else if (mright >= 84) {
      $scope.executeWin($scope.restaurants.rest3.id);
    }
  }

  SocketService.on('connect', function() {
    SocketService.emit('join', { room: roomURL });
  });

  SocketService.on('new', function() {
    $scope.move = {
      u: 0,
      d: 0,
      l: 0,
      r: 0
    }
  });

  SocketService.on('joining', function() {
    $scope.addrEntered = true;
    $scope.gameshow = true;
    SocketService.emit('data', { room: roomURL, data: $scope.move });
    SocketService.emit('updateRest', { room: roomURL, restaurants: $scope.restaurants });
    SocketService.emit('updateAddr', { room: roomURL, addr: $scope.address });
  });

  SocketService.on('receive', function(data) {
    $scope.addrEntered = true;
    $scope.gameshow = true;
    $scope.move = data;
    $scope.calculatePenguin();
  });

  SocketService.on('receiveRest', function(data) {
    $scope.addrEntered = true;
    $scope.gameshow = true;
    $scope.restaurants = data;
  });

  SocketService.on('receiveAddr', function(data) {
    $scope.addrEntered = true;
    $scope.gameshow = true;
    $scope.address = data;
  });

  SocketService.on('receiveAddr', function(data) {
    $scope.addrEntered = true;
    $scope.gameshow = true;
    $scope.address = data;
  });

  SocketService.on('move', function(data) {
    $scope.move[data.move] += 2;
    $scope.calculatePenguin();
  });

  SocketService.on('restaurant', function(data) {
    $scope.restaurants = {
      rest1: data[0],
      rest2: data[1],
      rest3: data[2],
      rest4: data[3]
    };

  });

  $scope.postAddress = function() {
    $scope.address = { street: $scope.street, city: $scope.city, zip: $scope.zip, state: $scope.state, number: $scope.number };
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