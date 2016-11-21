angular.module('SpotTracker').component('user', {
  templateUrl: 'user',

  controller: function($scope, Http, notify, Auth, $stateParams) {
    $scope.user = {};
    let user = $stateParams.id;
    let url = '/user/' + user;

    Http.get(url, {id: user})
      .then((res) => {
        if(!res) return;
        if (res) $scope.user = res;
      })
      .catch((err) => {
        notify({message: err.message, classes: ['alert-warning']});
      });
  }
});