app.controller('HomeController', ['$scope', '$location', function($scope, $location) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  $scope.newBattle = function() {
    var result = '';
    for (var i = 0; i < 10; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * 62));
    }
    $location.path('/fudz/' + result);
  }

}]);