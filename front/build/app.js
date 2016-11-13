'use strict';

// Make sure to include the `ui.router` module as a dependency
angular.module('SpotTracker', ['ui.router', 'ngAnimate', 'templates', 'cgNotify', 'ui.bootstrap', 'ngSanitize']).run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]).run(["$http", "$templateCache", "notify", function ($http, $templateCache, notify) {
  $http.get('../assets/vendor/bower_components/angular-notify/angular-notify.html', { cache: $templateCache });
  notify.config({
    duration: 3000,
    position: 'center',
    templateUrl: '../assets/vendor/bower_components/angular-notify/angular-notify.html'
  });
}]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/task');

  $stateProvider.state({
    name: 'task',
    url: '/task',
    component: 'task'
  }).state({
    name: 'search',
    url: '/search',
    component: 'search'
  }).state({
    name: 'connect',
    url: '/connect',
    component: 'connect'
  }).state({
    name: 'login',
    url: '/login',
    component: 'login'
  });
}]);
'use strict';

angular.module('SpotTracker').factory('Http', ["$rootScope", "$http", "$q", "notify", function ($rootScope, $http, $q, notify) {
  return {
    post: function post(url, data, msg) {
      return $q(function (resolve, reject) {
        // $http.post(url, Object.assign({}, $rootScope.token, data)).success(res => {
        $http.post(url, data).success(function (res) {
          if (res.message) {
            return reject(res.message);
          }

          if (msg) notify({ message: msg, classes: res.classes });

          resolve(res);
        }).error(function (err) {
          msg = 'Error occurred';

          if (err) {
            if (err.message) {
              msg = err.message;
            } else {
              msg = err;
            }
          }

          reject(msg);
        });
      }).catch(function (err) {
        notify({ message: err, classes: ['alert-danger'] });
        return false;
      });
    },

    get: function get(url, data, msg) {
      return $q(function (resolve, reject) {
        $http.get(url, data).success(function (res) {
          if (res.message) {
            return reject(res.message);
          }

          if (msg) notify({ message: msg, classes: ['alert-success'] });

          resolve(res);
        }).error(function (err) {
          msg = 'Error occurred';

          if (err) {
            if (err.message) {
              msg = err.message;
            } else {
              msg = err;
            }
          }

          reject(msg);
        });
      }).catch(function (err) {
        notify({ message: err, classes: ['alert-danger'] });
        return false;
      });
    }
  };
}]);
'use strict';

angular.module('SpotTracker').component('connect', {
  templateUrl: 'connect',

  controller: ["$scope", "Http", "notify", "$window", function controller($scope, Http, notify, $window) {
    $scope.user = {};

    $scope.spotifyUserConnect = function () {
      var url = "/login";

      Http.get(url, user).then(function (res) {
        if (!res) return;
        if (res) notify({ message: 'approve request', classes: res.classes });
        $window.location.href = res.url;
      }).catch(function (err) {
        console.log(err);
        notify({ message: "Provided Credentials are wrong or you are in approved country" + err, classes: ['alert-warning'] });
      });
      // Auth.login($scope.user).then(res => $scope.loading = false);
    };
  }]
});
'use strict';

angular.module('SpotTracker').component('login', {
  templateUrl: 'login',

  controller: ["$scope", "Http", "notify", "$window", function controller($scope, Http, notify, $window) {
    $scope.spotifyFrame = { file: '' };

    $scope.spotifyLogin = function () {
      // let user = $scope.user;
      var user = {
        email: "dmytro.kostylov@gmail.com",
        password: "toshato$2016"
      };
      var url = "/login";

      $scope.url = {};

      Http.get(url, user).then(function (res) {
        if (!res) return;
        if (res) notify({ message: 'approve request', classes: res.classes });
        $window.location.href = res.url;
      }).catch(function (err) {
        console.log(err);
        notify({ message: "Provided Credentials are wrong or you are in approved country" + err, classes: ['alert-warning'] });
      });
      // Auth.login($scope.user).then(res => $scope.loading = false);
    };
  }]
});
'use strict';

angular.module('SpotTracker').component('search', {
  templateUrl: 'search',

  controller: ["$scope", "Http", function controller($scope, Http) {
    $scope.result = {};
    $scope.headers = [];

    $scope.userQuery = {
      searchText: '',
      searchTypes: {
        album: true,
        artist: false,
        playlist: false,
        track: false
      }
    };

    $scope.setQuery = function () {
      $scope.result = {};
      $scope.headers = [];
      $scope.activeTab = { index: 0 };
      Http.post('/search', $scope.userQuery, 'info loaded').then(function (res) {
        Object.keys(res.data).forEach(function (key) {
          $scope.result[key] = res.data[key];
          $scope.headers.push(key);
        });
      });
    };
  }]
});
'use strict';

angular.module('SpotTracker').component('task', {
  templateUrl: 'task',

  controller: function controller() {
    this.test = 'task';
  }
});