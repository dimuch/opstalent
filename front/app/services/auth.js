angular
  .module('SpotTracker')
  .service('Auth', function($state, Http, $window) {
    let storage = $window.localStorage;
    let cachedToken;
    let cachedUser;
    let userToken = 'userToken';
    let userEmail = 'email';

    let authToken = {
      user: {},

      getUserParam: (param) => {
        if(cachedUser) {
          return cachedUser[param]
        };
        return storage.getItem(param);
      },

      setUser: (user) => {
        angular.extend(authToken.user, user);
        cachedUser = authToken.user;
        storage.setItem(userEmail, user.email);
        storage.setItem(userToken, user.userToken);
      },
      getUser: () => {
        if(!cachedUser){
          cachedUser = storage.getItem(userEmail);
        }
        return cachedUser;
      },
      setToken: (token) => {
        cachedToken = token;
        storage.setItem(userToken, token)
      },
      getToken: () => {
        if(!cachedToken) {
          cachedToken = storage.getItem(userToken);
        }
        return cachedToken;
      },
      isAuthenticated: () => {
        return !!authToken.getToken() && !!authToken.getUser();
      },
      removeToken: () => {
        cachedToken = null;
        storage.removeItem(userToken);
      },
      removeUser: () => {
        cachedUser= null;
        storage.removeItem(userEmail);
      },

      logout: () => {
        Http.post('/user/logout', authToken.user).then(res => {
          if (!res) return;

          authToken.removeToken();
          authToken.removeUser();
          authToken.user = {};

          $state.go('login');
        })
      },
      update: (user) => {
        Http.post('/users/update', user, 'Personal details were successfully updated').then(() => {
          auth.setUser(user);
        });
      }
    }

    return authToken;
  });