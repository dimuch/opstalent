angular.module('SpotTracker').component('login', {
  templateUrl: 'login',

  controller: function($scope, Http, notify, Auth, $state) {

    $scope.spotifyLogin = () => {
      let user = $scope.user;
      let url="/user/login";

      $scope.url = {};

      Http.post(url, user)
        .then((res) => {
          if(!res) return;
          if (res) notify({message: 'Logged in', classes: res.classes});
          Auth.setUser(res);
          $state.go('search');
        })
        .catch((err) => {
          console.log(err);
          notify({message: "Provided Credentials are wrong" + err, classes: ['alert-warning']});
        });
    }
  }
});