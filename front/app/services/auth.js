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

      setUser: (user) => {
        angular.extend(authToken.user, user);
        cachedUser = authToken.user;
        storage.setItem(userEmail, JSON.stringify({email: user.email}));
        storage.setItem(userToken, user.userToken);
      },

      getUser: (param) => {
        if(!cachedUser){
          cachedUser = JSON.parse(storage.getItem(param));
        }
        // let user = JSON.parse(cachedUser);

        if(param) return cachedUser[param];

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
        return !!authToken.getToken() && !!authToken.getUser('email');
      },
      removeToken: () => {
        cachedToken = null;
        storage.removeItem(userToken);
      },
      removeUser: () => {
        cachedUser= null;
        storage.removeItem(userEmail);
        authToken.user = {};
      },

      logout: () => {
        Http.post('/user/logout', authToken.user).then(res => {
          if (!res) return;

          authToken.removeToken();
          authToken.removeUser();

          $state.go('login');
        })
      },
      update: (user) => {
        Http.post('/users/update', user, 'Personal details were successfully updated').then(() => {
          auth.setUser(user);
        });
      }
    };

    return authToken;
  });