var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var PlacesSchema = new Schema({
    address: {type: String, required: true},
    name: {type:String, required:true},
    location: {type: [Number], required: true}, // [Long, Lat]
    rating: {type:Number},
    reviews: {type: [String]},
    place_id: {type: String, unique:true, required:true},
    opening_hours: {type:[String]},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
PlacesSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

PlacesSchema.index({location: '2dsphere'});

module.exports = mongoose.model('places', PlacesSchema);