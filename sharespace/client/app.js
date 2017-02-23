angular.module('myApp', ['ui.router', 'ngRoute', 'videosharing-embed'])
 
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
  	.state('outside', {
  		abstract: true,
    	url: '/outside',
    	template: "<div ui-view></div>",
    	templateUrl: 'views/outside.html'
  	})
  	.state('outside.login', {
    	url: '/login',
    	templateUrl: 'views/login.html',
    	controller: 'LoginCtrl'
  	})
  	.state('outside.register', {
    	url: '/register',
    	templateUrl: 'views/register.html',
    	controller: 'RegisterCtrl'
  	})
  	.state('inside', {
    	url: '/inside',
    	templateUrl: 'views/inside.html',
    	controller: 'InsideCtrl'
  	});

  	$urlRouterProvider.otherwise('/outside/login');
})


.run(function($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});


// Application object with angular route dependency ([] is mandatory)
// ngRoute comes from the Angular Route file we installed

/**
// Setting up all te routes
myApp.config(function($routeProvider){
	// Getting all the posts
	$routeProvider.when('/', {
		controller: 'PostsController',
		templateUrl: 'views/posts.html'
	})
	// Getting all the posts by specified tag
	.when('/posts/tag/:val', {
		controller: 'PostsController',
		templateUrl: 'views/posts_by_tag.html'
	})
	// Getting all the posts by specified search
	.when('/posts/search/:search', {
		controller: 'PostsController',
		templateUrl: 'views/posts_by_search.html'
	})
	// Getting specific post by id
	.when('/posts/details/:id', {
		controller: 'PostsController',
		templateUrl: 'views/post_details.html'
	})
	// Adding a new post
	.when('/posts/add', {
		controller: 'PostsController',
		templateUrl: 'views/add_post.html'
	})
	// Editing a new post by id
	.when('/posts/edit/:id', {
		controller: 'PostsController',
		templateUrl: 'views/edit_post.html'
	})
	// If none of the above, redirect to the home page
	.otherwise({
		redirectTo: '/'
	});
});
**/