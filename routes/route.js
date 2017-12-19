var Places = require('../models/places.js');
var mongoose = require('mongoose');


module.exports = function(app) {

    app.get('/places', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
		//res.send("Retrieving places list");
		var name = req.query.name != "undefined" ? req.query.name : undefined
		var location = req.query.location != "undefined" ? req.query.location : undefined
		if(name){
			var query = Places.find({"name":name});
		}
		else if(location){
			var query = Places.find({"location":location})
		}
		else
			var query = Places.find({});
        query.exec(function(err, places){
            if(err)
                res.send(err);

            res.json(places);
        });
    });

    app.get('/places/:id', function(req, res){

		var query = Places.find({"_id":req.params.id});
	        query.exec(function(err, places){
	            if(err)
	                res.send(err);

	            res.json(places);
	        });
    });


    app.post('/places', function(req, res){

        var newplace = new Places(req.body);

        // New User is saved in the db.
        newplace.save(function(err){
            if(err)
                res.send(err);

            res.json(req.body);
        });
    });

    app.delete('/places/:id',function(req, res) {
        Places.remove({
            _id: req.params.id
        }, function(err, places) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

    app.put('places/:id',function(req, res){
    	Places.findOneAndUpdate({ 
    		_id:req.params.id },req.body,{ new:true },
    			function(err,places){
    				if (err)
    					res.send(err);
    				res.json(places);
    	})
    })

    app.get('/get_nearby_places',function(req, res){
    	location = req.query.location
    	distance = req.query.distance
		var query = Places.find(
   			{ "location" : { $near : location, $maxDistance: distance  } }
		)
	        query.exec(function(err, places){
	            if(err)
	                res.send(err);

	            res.json(places);
	        });
    })

    //Error message in case wrong route is entered
    app.use(function(req, res) {
  		res.status(404).send({url: req.originalUrl + ' not found'})
	});

};  
