app.controller('FudzController', ['$scope', '$location', function($scope, $location) {
  $scope.url = $location.path();
}]);