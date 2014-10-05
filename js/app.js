var spazz = angular.module('spazz', ['ngRoute', 'ngTouch']);

spazz.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './views/home.html'
    })

    .when('/user', {
      templateUrl: './views/user.html'
    })

    .otherwise({
      redirect: '/'
    });

    $locationProvider.html5Mode(true);
}]);