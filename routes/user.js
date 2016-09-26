

var mongoose = require('mongoose'),
    Users = mongoose.model('users')

/**
 * Get Users
 */
exports.index  = function(req,res){
    Users.find( function(err, users) {
        if (err) return res.render('Error occurred');
        res.send(users);
    });
};

exports.findById = function(req,res){
    Users.findById( req.params.id, function( err, users ) {
            if (err) {
                res.send('Error occurred');
                return console.log(err);
            }
            res.send(users);
    });
};

exports.newUser = function(req,res){
    var emp = new Users(req.body);

    emp.save(function(err){
        if (err) {
            res.send('Error occurred');
            return console.log(err);
        }
        res.send(emp);
    });
}

exports.update = function(req,res){
    Users.findById( req.params.id, function( err, users ) {
        if(!users){
            res.send('User not found with given id');
        }else{
            if(users.__v != req.body.__v){
                return res.send('Please use the update users details as ' + users);
            }
            users.set(req.body)
            if(users.isModified()){
                users.increment();
                users.save(function(err){
                    if (err) {
                        res.send('Error occurred');
                        return console.log(err);
                    }
                    res.send(users);
                });
            }else{
                res.send(users);
            }

        }
    });
};

exports.delete = function(req,res){
    Users.findById( req.params.id, function( err, users ) {
        if(!employee){
            return res.send('Todo not found with given id');
        }
        users.remove(function(err){
            if (err) {
                res.send('Error occurred');
                return console.log(err);
            }
            res.send('Deleted')
        });
    });
};