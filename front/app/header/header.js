angular.module('SpotTracker').controller('header',($rootScope, $scope, Auth) => {
  $scope.logout = Auth.logout;

  $scope.isAuthenticated = Auth.isAuthenticated;

  $scope.displayName = () => {
    if(Auth.isAuthenticated()) return Auth.getUser('email').split('@')[0]
  };

});