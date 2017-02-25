angular.module('myApp')

// Authentication service
.service('AuthService', function($q, $http, API_ENDPOINT) {

    // Initial values for some global variables
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    var authToken;

    // Load user credentials function (loadUserCredentials)
    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);

        // Case where a token exists
        if (token) {
        useCredentials(token);
        }
    }

    // Store user credentials function (storeUserCredentials) by user token
    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    // User credentials function (userCredentials) by user token
    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
 
        // Set the token as header for requests
        $http.defaults.headers.common.Authorization = authToken;
    }

    // Destroy user credentials function (destroyUserCredentuals)
    function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    // Register function (register)
    var register = function(user) {

        // Return a promise
        return $q(function(resolve, reject) {

        // Connect to the API endpoint
        $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {

            // Case where register is successful
            if (result.data.success) {

            // Resolve promise
            resolve(result.data.msg);

            // Case where register is not successful
            } else {
                reject(result.data.msg);
            }
        });
        });
    };

    // Login function (login)
    var login = function(user) {

        // Return a promise
        return $q(function(resolve, reject) {

        // Connect to the API endpoint
        $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
        
            // Case where login is successful
            if (result.data.success) {

            // Return token and store user credentials
            storeUserCredentials(result.data.token);

            // Resolve promises
            resolve(result.data.msg);

            // Case where login is not successful
            } else {
                reject(result.data.msg);
            }
        });
        });
    };

    // Logout function (logout)
    var logout = function() {
        destroyUserCredentials();
    };

    // Call to load user credentials function
    loadUserCredentials();

    // Returns login, register and logout functions along with isAuthenticated
    return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() {return isAuthenticated;},
    };
    })
 
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
    // Response error that handles whether user has been authenticated
    responseError: function(response) {
    $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
    }[response.status], response);
    return $q.reject(response);
    }
    };
})

// Server response when making http request
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});
