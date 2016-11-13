angular.module('SpotTracker').component('connect', {
  templateUrl: 'connect',

  controller: function($scope, Http, notify, $window) {
    $scope.user = {};

    $scope.spotifyUserConnect = () => {
      let url="/login";

      Http.get(url, user)
        .then((res) => {
          if(!res) return;
          if (res) notify({message: 'approve request', classes: res.classes});
          $window.location.href = res.url;
        })
        .catch((err) => {
          console.log(err);
          notify({message: "Provided Credentials are wrong or you are in approved country" + err, classes: ['alert-warning']});
        });
      // Auth.login($scope.user).then(res => $scope.loading = false);
    }
  }
});