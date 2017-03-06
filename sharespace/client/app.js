// Application object with angular route dependency ([] is mandatory)
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
  	// Getting all posts
  	.state('inside', {
    	url: '/home',
    	templateUrl: 'views/posts.html',
    	controller: 'PostsController'
  	})
  	// Getting all the posts by specified tag
  	.state('posts_by_tag', {
    	url: '/posts/tag/:val',
    	templateUrl: 'views/posts_by_tag.html',
    	controller: 'PostsController'
  	})
  	// Getting all the posts by specified search
  	.state('posts_by_search', {
    	url: '/posts/search/:search',
    	templateUrl: 'views/posts_by_search.html',
    	controller: 'PostsController'
  	})
   	// Getting specific post by id
  	.state('post_details', {
    	url: '/posts/details/:id',
    	templateUrl: 'views/post_details.html',
    	controller: 'PostsController'
  	})
  	// Adding a new post
  	.state('add_post', {
    	url: '/posts/add',
    	templateUrl: 'views/add_post.html',
    	controller: 'PostsController'
    })
  	// Editing a new post by id
  	.state('edit_post', {
    	url: '/posts/edit/:id',
    	templateUrl: 'views/edit_post.html',
    	controller: 'PostsController'
    })
    // Get the user's profile
    .state('my_profile', {
      url: '/my_profile',
      templateUrl: 'views/my_profile.html',
      controller: 'InsideCtrl'
    })
    // Get other user's profile
    .state('other_profile', {
      url: '/users/:username',
      templateUrl: 'views/other_profile.html',
      controller: 'PostsController'
    });

  	$urlRouterProvider.otherwise('/outside/login');
})

.run(function($http, $rootScope, $state, $stateParams, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
        if (AuthService.isAuthenticated()) {
            if (next.name === 'edit_post') {
                $http.get('/api/' + 'memberinfo').then(function(result){
                    var id = $stateParams.id;
                    $http.get('/api/posts/' + id).success(function(response){
                    // Assign user information to user
                        if (result.data.user.username != response.user_created) {
                            event.preventDefault();
                            $state.go('inside');
                        }
                    });
                });
            }
        }
    
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
