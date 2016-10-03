userProfile.controller('accountDetailsController',function($scope, $http,$state){
	
	$scope.invalid_login = true;
	$scope.unexpected_error = true;

		console.log("inside accountDetails controller");
	
		console.log("userId:: " + $scope.userId)
	
		
		$http({
			method : "POST",
			url : '/getUserAccountDetails',
			data : {
				"userId": $scope.userId //pass userId via session.
			}
		}).success(function(data) {
			console.log("inside success");
			console.log("data is ::");
			console.log(data);
			
			$scope.email = data.EmailId;
			$scope.UserId = data.UserId;
			$scope.FirstName = data.FirstName;
			$scope.LastName = data.LastName;
			$scope.EmailId = data.EmailId;
			$scope.Address = data.Address;
			$scope.CreditCarddetails = data.CreditCarddetails;
			
			
			//set all variables.
				 
		}).error(function(error) {
			console.log("inside error");
			console.log(error);
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
			$window.alert("unexpected_error");
		});


	
	
	
});