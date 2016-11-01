angular.module('shrouded-basin', ['lumx']).
controller('MainCtrl', function($rootScope, $scope, $http) {

  // Get the cities data that I can show in the drop-down
  $http.get('/api/users').success(function(data) {
    $scope.users = (JSON.parse(data.info)).Users;
    console.log($scope.cities);
  }).error(function(err) {
    $scope.error = err;
  });

  // Call the server to get the fares info
  $scope.submit = function() {
    $http.get('/api/v1/places?origin=' + $scope.info.origin.code +
      '&departuredate=' + formatDate($scope.info.departuredate) +
      '&returndate=' + formatDate($scope.info.returndate) +
      '&maxfare=' + $scope.info.maxfare.value).success(function(data) {
        $scope.results = data;
        $scope.data = data.info;
        if ($scope.results.status) {
          $scope.fareinfo = JSON.parse($scope.data).FareInfo;
        } else {
          $scope.error = JSON.parse($scope.data.data).message;
        }
    }).error(function(err) {
      $scope.error = JSON.parse(err.data).message;
    });
  };

  // Helper function from stackoverflow so that I can format the date before sending to the server
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
});

