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
  }).state({
    name: 'register',
    url: '/register',
    component: 'register'
  }).state({
    name: 'user',
    url: '/user/:id',
    component: 'user'
  });
}]);
'use strict';

angular.module('SpotTracker').directive('validateEquals', function () {
  var validateEqual = void 0;
  return {
    require: 'ngModel',
    link: function link(scope, element, attrs, ngModelCtrl) {
      validateEqual = function validateEqual(value) {
        var valid = value === scope.$eval(attrs.validateEquals);
        ngModelCtrl.$setValidity('equal', valid);
        return valid ? value : undefined;
      };

      ngModelCtrl.$parsers.push(validateEqual);
      ngModelCtrl.$formatters.push(validateEqual);

      scope.$watch(attrs.validateEquals, function () {
        ngModelCtrl.$setViewValue(ngModelCtrl.viewValue);
      });
    }
  };
});
'use strict';

angular.module('SpotTracker').controller('header', ["$rootScope", "$scope", "Auth", function ($rootScope, $scope, Auth) {
  $scope.logout = Auth.logout;

  $scope.isAuthenticated = Auth.isAuthenticated;

  $scope.displayName = function () {
    if (Auth.isAuthenticated()) return Auth.getUser('email').split('@')[0];
  };
}]);
'use strict';

angular.module('SpotTracker').service('Auth', ["$state", "Http", "$window", function ($state, Http, $window) {
  var storage = $window.localStorage;
  var cachedToken = void 0;
  var cachedUser = void 0;
  var userToken = 'userToken';
  var userEmail = 'email';

  var authToken = {
    user: {},

    setUser: function setUser(user) {
      angular.extend(authToken.user, user);
      cachedUser = authToken.user;
      storage.setItem(userEmail, JSON.stringify({ email: user.email }));
      storage.setItem(userToken, user.userToken);
    },

    getUser: function getUser(param) {
      if (!cachedUser) {
        cachedUser = JSON.parse(storage.getItem(param));
      }
      // let user = JSON.parse(cachedUser);

      if (param) return cachedUser[param];

      return cachedUser;
    },
    setToken: function setToken(token) {
      cachedToken = token;
      storage.setItem(userToken, token);
    },
    getToken: function getToken() {
      if (!cachedToken) {
        cachedToken = storage.getItem(userToken);
      }
      return cachedToken;
    },
    isAuthenticated: function isAuthenticated() {
      return !!authToken.getToken() && !!authToken.getUser('email');
    },
    removeToken: function removeToken() {
      cachedToken = null;
      storage.removeItem(userToken);
    },
    removeUser: function removeUser() {
      cachedUser = null;
      storage.removeItem(userEmail);
      authToken.user = {};
    },

    logout: function logout() {
      Http.post('/user/logout', authToken.user).then(function (res) {
        if (!res) return;

        authToken.removeToken();
        authToken.removeUser();

        $state.go('login');
      });
    },
    update: function update(user) {
      Http.post('/users/update', user, 'Personal details were successfully updated').then(function () {
        auth.setUser(user);
      });
    }
  };

  return authToken;
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

          // if (msg) notify({message: msg, classes: res.classes});

          resolve(res);
        }).error(function (err) {
          // msg = 'Error occurred';
          //
          // if (err) {
          //   if (err.message) {
          //     msg = err.message;
          //   } else {
          //     msg = err;
          //   }
          // }

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
      var url = "/connect";

      Http.get(url).then(function (res) {
        if (!res) return;
        $window.location.href = res.url;
      }).catch(function (err) {
        notify({ message: "Something wrong with Spotify service. Please try later" + err, classes: ['alert-warning'] });
      });
    };
  }]
});
'use strict';

angular.module('SpotTracker').component('login', {
  templateUrl: 'login',

  controller: ["$scope", "Http", "notify", "Auth", "$state", function controller($scope, Http, notify, Auth, $state) {

    $scope.spotifyLogin = function () {
      var user = $scope.user;
      var url = "/user/login";

      $scope.url = {};

      Http.post(url, user).then(function (res) {
        if (!res) return;
        if (res) notify({ message: 'Logged in', classes: res.classes });
        Auth.setUser(res);
        $state.go('search');
      }).catch(function (err) {
        console.log(err);
        notify({ message: "Provided Credentials are wrong" + err, classes: ['alert-warning'] });
      });
    };
  }]
});
'use strict';

angular.module('SpotTracker').component('register', {
  templateUrl: 'register',

  controller: ["$scope", "Http", "notify", "Auth", "$state", function controller($scope, Http, notify, Auth, $state) {
    $scope.user = {};
    $scope.sameUserCheck = { result: '' };

    $scope.checkUser = function (email) {
      if (!email) return;
      var url = "/user";
      $scope.sameUserCheck = { result: 'Checking' };

      Http.post(url, { email: email }).then(function (res) {
        if (!res) return;
        if (res) notify({ message: 'You can create account with email ' + email, classes: ['alert-success'] });
        $scope.sameUserCheck = { result: 'good' };
      }).catch(function (err) {
        $scope.sameUserCheck = { result: 'need other email' };
      });
    };

    $scope.userRegister = function () {
      var user = $scope.user;
      var url = "/user/register";

      Http.post(url, user).then(function (res) {
        if (!res) return;
        if (res && res.status) notify({ message: 'Your account has been created', classes: ['alert-success'] });

        Auth.setUser(res);
        $state.go('search');
      }).catch(function (err) {
        notify({ message: "Something going wrong " + err, classes: ['alert-warning'] });
      });
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
'use strict';

angular.module('SpotTracker').component('user', {
  templateUrl: 'user',

  controller: ["$scope", "Http", "notify", "Auth", "$stateParams", function controller($scope, Http, notify, Auth, $stateParams) {
    $scope.user = {};
    var user = $stateParams.id;
    var url = '/user/' + user;

    Http.get(url, { id: user }).then(function (res) {
      if (!res) return;
      if (res) $scope.user = res;
    }).catch(function (err) {
      notify({ message: err.message, classes: ['alert-warning'] });
    });
  }]
});