angular.module('SpotTracker').component('connect', {
  templateUrl: 'connect',

  controller: function($scope, Http, notify, $window) {
    $scope.user = {};

    $scope.spotifyUserConnect = () => {
      let url="/connect";

      Http.get(url)
        .then((res) => {
          if(!res) return;
          $window.location.href = res.url;
        })
        .catch((err) => {
          notify({message: "Something wrong with Spotify service. Please try later" + err, classes: ['alert-warning']});
        });
    }
  }
});