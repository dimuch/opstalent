// Make sure to include the `ui.router` module as a dependency
angular
  .module('SpotTracker', ['ui.router','ngAnimate', 'templates', 'cgNotify', 'ui.bootstrap', 'ngSanitize'])

  .run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .run(($http, $templateCache, notify) => {
    $http.get('../assets/vendor/bower_components/angular-notify/angular-notify.html', {cache: $templateCache});
    notify.config({
      duration: 3000,
      position: 'center',
      templateUrl: '../assets/vendor/bower_components/angular-notify/angular-notify.html'
    });
  })

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
    $urlRouterProvider.otherwise('/task');

    $stateProvider
      .state({
        name: 'task',
        url: '/task',
        component: 'task'
      })
      .state({
        name: 'search',
        url: '/search',
        component: 'search'
      })
      .state({
        name: 'connect',
        url: '/connect',
        component: 'connect'
      })
      .state({
        name: 'login',
        url: '/login',
        component: 'login'
      })
    }
  ]);
