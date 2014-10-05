var app = angular.module('spazz4fudz', ['ui.router', 'ngTouch']);

app.run(['$rootScope', '$state', '$location', '$window', function ($rootScope, $state, $location, $window) {
  $rootScope.$state = $state;
}]);

app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html'
    })
    .state('room', {
      url: '/fudz',
      templateUrl: 'views/room.html',
      abstract: true
    })
      .state('room.fudz', {
        url: '/:fudz_id',
        templateUrl: 'views/fudz.html'
      });
}]);