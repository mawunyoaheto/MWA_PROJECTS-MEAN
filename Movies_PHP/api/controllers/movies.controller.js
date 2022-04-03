const mongoose = require("mongoose");
const MOVIES = mongoose.model(process.env.MOVIES_MODEL);

const getAll = (req, res) => {
    console.log("Get All Movies Controller");
    const response = {
        status: 200,
        message: {}
    };

    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, 10);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, 10);
    let max = parseInt(process.env.MAX_FIND_COUNT, 10);


    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if (isNaN(offset) || isNaN(count)) {
        console.log("Offset or Count is not a number");
        response.status = 400;
        response.message = "offset and count must be digit";
    }

    if (count > max) {
        console.log("Count greater than max");
        response.status = 400;
        response.message = "Count cannot be greater than " + max;
    }

    if (response.status != 200) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.find().skip(offset).limit(count).exec((err, movies) => _getAllMoviesAndReturnResponse(err, movies, response, res));

    }


};

const addOne = (req, res) => {
    const response = {
        status: 201,
        message: {}
    };

    let newMovie = {};

    newMovie.title = req.body.title;
    newMovie.year = parseInt(req.body.year, 10);

    if (req.body.actors) {
        newMovie.actors = req.body.actors;
    } else {
        newMovie.actors = [];
    }

    if (isNaN(newMovie.year)) {
        console.log("Year cannot be a string");
        response.status = 400;
        response.message = "Invalid input, String not allowed for year";
    }

    if (response.status != 201) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.create(newMovie, (err, savedMovie) => _saveNewMovieAndSendResponse(err, savedMovie, response, res));
    }
};

const getOne = (req, res) => {
    console.log("Get One Movie Controller");
    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);

    if (response.status != 200) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => _findMovieByIdAndReturnResponse(err, movie, response, res));
    }
};


const updateOne = (req, res) => {
    console.log("Full update One Movie Controller");
    let updatedMovie = {};

    const { movieId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);
   
    if (req.body && req.body.title) {
        updatedMovie.title = req.body.title;
    }

    if (req.body && req.body.year) {
        updatedMovie.year = parseInt(req.body.year, 10);
        if (isNaN(updatedMovie.year)) {
            console.log("Year cannot be a string");
            response.status = 400;
            response.message = "Invalid input, String not allowed for year";
        }
    }

    if (Object.keys(updatedMovie) === 0) {
        console.log("Empty updatedMovie object");
        response.status = 400;
        response.message = "Invalid input, object cannot be empty";
    }

    if (response.status != 201) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findByIdAndUpdate(movieId, updatedMovie, (err, newMovie) => _updateOne(err, newMovie, response, res));
    }
};

const deleteOne = (req, res) => {
    console.log("DELETE Movie Controller");
    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);

    if (response.status != 200) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.deleteOne({ _id: movieId }).exec((err, deletedMovie) => _deleteMovieByIdAndReturnResponse(err, deletedMovie, response, res));
    }
};

const _validateMovieIdFromReqAndReturnMovieIdAndResponse = (req) => {
    const response = {
        status: 200,
        message: {}
    };
    const { movieId, actorId } = req.params;

    if (req.params && movieId) {
        if (!mongoose.isValidObjectId(movieId)) {
            response.status = 400;
            response.message = "Invalid movieId";
        }
    } else {
        response.status = 400;
        response.message = "Cannot find without movieId";
    }

    return {
        movieId: movieId,
        response: response
    };
};

const _getAllMoviesAndReturnResponse = (err, movies, response, res) => {
    console.log("Found Movies", movies.length);
    res.status(response.status).json(movies);
};

const _findMovieByIdAndReturnResponse = (err, movie, response, res) => {
    if (err) {
        res.status(500).json({ error: err });
    } else {
        res.status(response.status).json(movie);
    }
};

const _saveNewMovieAndSendResponse = (err, savedMovie, response, res) => {
    if (err) {
        res.status(500).json({ error: err });
    } else {
        res.status(response.status).json(savedMovie);
    }

};

const _deleteMovieByIdAndReturnResponse = (err, deletedMovie, response, res) => {

    if (err) {
        res.status(500).json({ error: err });
    } else {
        res.status(response.status).json(deletedMovie);
    }
};

const _updateOne = (err, updateMovie, response, res) => {
    if (err) {
        console.log("Error updating movie");
        res.status(500).json(err);
    } else {
        res.status(response.status).json(updateMovie);
    }
};
module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne,
};