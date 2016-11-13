angular.module('SpotTracker').component('login', {
  templateUrl: 'login',

  controller: function($scope, Http, notify, $window) {
    $scope.spotifyFrame = {file: ''};

    $scope.spotifyLogin = () => {
      // let user = $scope.user;
      let user = {
        email:"dmytro.kostylov@gmail.com",
        password:"toshato$2016"
      };
      let url="/login";

      $scope.url = {};

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