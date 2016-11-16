angular.module('SpotTracker').component('register', {
  templateUrl: 'register',

  controller: function($scope, Http, notify, Auth, $state) {
    $scope.user = {};
    $scope.sameUserCheck = {result: ''};

    $scope.checkUser = (email) => {
      if(!email) return;
      let url="/user";
      $scope.sameUserCheck = {result: 'Checking'};

      Http.post(url, {email: email})
        .then((res) => {
          if(!res) return;
          if (res) notify({message: 'You can create account with email ' + email, classes: ['alert-success']});
          $scope.sameUserCheck = {result: 'good'};
        })
        .catch((err) => {
          $scope.sameUserCheck = {result: 'need other email'};
        });
    };

    $scope.userRegister = () => {
      let user = $scope.user;
      let url="/user/register";

      Http.post(url, user)
        .then((res) => {
          if(!res) return;
          if (res && res.status) notify({message: 'Your account has been created', classes: ['alert-success']});

          Auth.setUser(res);
          $state.go('search');
        })
        .catch((err) => {
          notify({message: "Something going wrong " + err, classes: ['alert-warning']});
        });
    };

  }
});