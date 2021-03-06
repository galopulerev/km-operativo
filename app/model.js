// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Position Schema. This will be the basis of how position data is stored in the db
var PositionSchema = new Schema({
    id: {type: String, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    created_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
PositionSchema.pre('save', function(next){
    now = new Date();
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
PositionSchema.index({location: '2dsphere'});

// Exports the PositionSchema for use elsewhere. Sets the MongoDB collection to be used as: "dis-position"
module.exports = mongoose.model('dis-position', PositionSchema);