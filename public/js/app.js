var app = angular.module('MeanApp', ['ngMessages', 'ngAutocomplete','gservice'])
  .controller('Ctrl', ['$scope','$http','gservice', function($scope, $http, gservice) {
    $scope.vm = {
      address: {}
    };
    //gservice.refresh(28.6315303, 77.22222179999994)
    //Store location details in db
    $scope.saveLocation = function() {

    var placeData = {
        address: $scope.vm.address.formattedAddress,
        name: $scope.vm.address.name,
        location: [$scope.vm.address.lng, $scope.vm.address.lat],
        place_id: $scope.vm.address.place_id,
        rating: $scope.vm.address.rating,
        reviews: $scope.vm.address.reviews,
        opening_hours: $scope.vm.address.openinghours
    };

    // Saves place data in db
    $http.post('/places', placeData)
    	.then(function(response) {
    		gservice.refresh($scope.vm.address.lat, $scope.vm.address.lng)

		})
		.catch(function(response) {
  			console.error('Error while saving location', response.status, response.data);
		});
};

/*Fetch details namely - place name, address,latitude,longitude,reviews and google ratings 
of a location based on place id*/
$scope.searchById = function(){
	url = '/places/'+ $scope.placeid;
	console.log(url)
	$http.get(url)
		.then(function(response){
			$scope.vm.address.formattedAddress1 = response.data[0].address;
            $scope.vm.address.name1 = response.data[0].address;
            $scope.vm.address.lng1 = response.data[0].location[0];
            $scope.vm.address.lat1 = response.data[0].location[1];
            $scope.vm.address.reviews1 = response.data[0].reviews;
            $scope.vm.address.rating1 = response.data[0].rating;
            $scope.vm.address.name = response.data[0].name;
            d = new Date()
            day = d.getDay()
            if(day){
                $scope.vm.address.opening_hours1 = response.data[0].opening_hours[day-1] 
            }
            else
                $scope.vm.address.opening_hours1 = response.data[0].opening_hours[6]
            gservice.refresh($scope.vm.address.lat1, $scope.vm.address.lng1)
		})

}

//Function to find locations within 50kms of a place and plot on map
$scope.findNearByPlaces = function(){
	gservice.refresh($scope.vm.address.lat1, $scope.vm.address.lng1,true)
}

  }]);
