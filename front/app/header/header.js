angular.module('SpotTracker').controller('header',($rootScope, $scope, Auth) => {
  // pass all Auth methods
  $scope.logout = Auth.logout;

  $scope.isAuthenticated = Auth.isAuthenticated;
  $scope.displayName = () => {
    console.log(Auth.getUserParam('email'));
    if(Auth.isAuthenticated()) return Auth.getUserParam('email').split('@')[0]};
});