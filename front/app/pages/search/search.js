angular.module('SpotTracker').component('search', {
  templateUrl: 'search',

  controller: function($scope, Http) {
    $scope.result = {};
    $scope.headers = [];

    $scope.userQuery = {
      searchText: '',
      searchTypes:{
        album: true,
        artist: false,
        playlist: false,
        track: false
      }
    };

    $scope.setQuery = () => {
      $scope.result = {};
      $scope.headers = [];
      $scope.activeTab = {index: 0};
      Http.post('/search', $scope.userQuery, 'info loaded').then((res) => {
        Object.keys(res.data).forEach((key) => {
          $scope.result[key] = res.data[key];
          $scope.headers.push(key);
        });
      });
    }
  }
});