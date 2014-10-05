spazz.factory('FudService', ['$http', function($http) {
  return {
    get: function() {
      return $http.get('/api/fudz');
    },

    create: function(fudzdata) {
      return $http.post('/api/fudz', fudzdata);
    },

    get_swatch: function(id) {
      return $http.get('/api/fudz/' + id);
    }
  };
}]);