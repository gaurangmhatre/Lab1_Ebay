var userProfile = angular.module('userProfile', ['ngRoute']);




userProfile.config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.  
	                when('/', {
	    				templateUrl : '/templates/userProfile/cart.html',
	    				//controller  : 'mainController'
	    			}).
                    when('/accountDetails', {
                        templateUrl: '/templates/userProfile/accountDetails.html',
                        controller: 'accountDetailsController'
                    }).
                    when('/activity', {
                        templateUrl: '/templates/userProfile/activity.html',
                        controller: 'activityController'
                    }).
                    when('/cart', {
                        templateUrl : '/templates/userProfile/cart.html',
                      //  controller: 'cartController'
                    }).
                    when('/sellItem', {
                        templateUrl : '/templates/userProfile/sellItem.html',
                        controller : 'sellItemController'
                    });
            }]);


userProfile.controller('activityController', function($scope) {
	// create a message to display in our view
	$scope.message = 'Everyone come and see how good I look!';
});

userProfile.controller('sellItemController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});
