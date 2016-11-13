angular
  .module('SpotTracker')
  .factory('Http', function($rootScope, $http, $q, notify) {
    return {
      post: function(url, data, msg) {
        return $q((resolve, reject) => {
          // $http.post(url, Object.assign({}, $rootScope.token, data)).success(res => {
          $http.post(url, data).success(res => {
            if (res.message) {
              return reject(res.message);
            }

            if (msg) notify({message: msg, classes: res.classes});

            resolve(res);
          }).error(err => {
            msg = 'Error occurred';

            if (err) {
              if (err.message) {
                msg = err.message;
              } else {
                msg = err;
              }
            }

            reject(msg);
          })
        }).catch(err => {
          notify({message: err, classes: ['alert-danger']});
          return false;
        });
      },

      get: function(url, data, msg) {
        return $q((resolve, reject) => {
          $http.get(url, data).success(res => {
            if (res.message) {
              return reject(res.message);
            }

            if (msg) notify({message: msg, classes: ['alert-success']});

            resolve(res);
          }).error(err => {
            msg = 'Error occurred';

            if (err) {
              if (err.message) {
                msg = err.message;
              } else {
                msg = err;
              }
            }

            reject(msg);
          })
        }).catch(err => {
          notify({message: err, classes: ['alert-danger']});
          return false;
        });
      }
    };
  });