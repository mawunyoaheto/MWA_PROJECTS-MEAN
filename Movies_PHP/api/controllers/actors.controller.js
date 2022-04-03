const { response } = require("express");
const mongoose = require("mongoose");
const MOVIES = mongoose.model(process.env.MOVIES_MODEL);

const getAll = (req, res) => {

    console.log("Get All Actors by Movie Controller");
    let movieId;
    const response = {
        status: 200,
        message: {}
    };
    if (req.params && req.params.movieId) {
        movieId = req.params.movieId;
        if (!mongoose.isValidObjectId(movieId)) {
            response.status = 400;
            response.message = "Invalid movieId";
        }
    } else {
        response.status = 400;
        response.message = "Cannot find without movieId";
    }

    if (response.status != 200) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).select("actors").exec((err, movie) => _findMovieByIdAndReturnResponse(err, movie, response, res));
    }
};

const getOne = (req, res) => {

    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);

    if (response.status != 200 && response.status != 201) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => {
            if (err) {
                res.status(500).json(err);
            } else {
                let actor = movie.actors.id(actorId);
                if (actor) {
                    res.status(200).json(actor);
                } else {
                    res.status(404).json("Actor with given id: " + actorId + " not found");
                }
            }

        });
    }
};

const addOne = (req, res) => {
    console.log("Add One Actor Controller");
    const response = {
        status: 201,
        message: {}
    };

    let movieId;

    if (req.params && req.params.movieId) {
        movieId = req.params.movieId;
        if (!mongoose.isValidObjectId(movieId)) {
            response.status = 400;
            response.message = "Invalid movieId";
        }
    } else {
        response.status = 400;
        response.message = "Cannot find without movieId";
    }

    if (response.status != 201) {
        res.status(response.status).json(response.message);
    } else {

        MOVIES.findById(movieId).select("actors").exec(function (err, movie) {
            console.log("Found movie ", movie);
            if (err) {
                console.log("Error finding movie");
                response.status = 500;
                response.message = err;
            } else if (!movie) {
                console.log("Movie with given Id not found " + movieId);
                response.status = 404;
                response.message = { "message": "Movie with given Id not found " + movieId };
            }
            if (movie) {
                _addActor(req, res, movie, response);
            } else {
                res.status(response.status).json(response.message);
            }
        });
    }


};

const updateOne = (req, res) => {
    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);
    console.log(movieId, actorId, response);

    if (response.status != 200) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => {
            if (err) {
                res.status(500).json(err);
            } else {
                let actor = movie.actors.id(actorId);
                if (actor) {
                    actor.name = req.body.name;
                    actor.awards = req.body.awards;
                    movie.save((err) => {
                        if (err) res.status(500).json(err);
                        res.status(201).json(movie);
                    });
                }
            }
        });
    }

};

const deleteOne = (req, res) => {
    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);
    if (response.status != 200) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => {
            if (err) {
                res.status(500).json(err);
            } else {
                let actor = movie.actors.id(actorId);
                if (actor) {
                    actor.remove();
                    movie.save(function (err, resp) {
                        if (err) res.status(500).json(err);
                        else res.status(202).json(movie);
                    });
                } else {
                    res.status(404).json("Actor with given id: " + actorId + "not found");
                }
            }

        });
    }
};

const _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse = (req) => {
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

    if (req.params && actorId) {
        if (!mongoose.isValidObjectId(actorId)) {
            response.status = 400;
            response.message = "Invalid actorId";
        }
    }

    return {
        movieId: movieId,
        actorId: actorId,
        response: response
    };
};
const _addActor = (req, res, movie, response) => {
    console.log(req.body);
    const { name, awards } = req.body;
    if (name) {
        if (isNaN(name)) {
            movie.actors.name = name;
        } else {
            response.status = 400;
            response.message = "Invalid input name must be a string";
        }

    } else {
        response.status = 400;
        response.message = "Invalid input name cannot be null";
    }

    if (awards) {
        if (isNaN(awards)) {
            console.log("Year cannot be a string");
            response.status = 400;
            response.message = "Invalid input, String not allowed for year";
        } else {
            movie.actors.awards = parseInt(awards, 10);
        }
    }

    let newActor = {
        name: name,
        awards: awards
    };

    if (response.status != 201) {
        res.status(response.status).json(response.message);
    } else {

        movie.actors.push(newActor);

        movie.save(function (err, movie) {
            // const response = { status: 200, message: [] };
            if (err) {
                response.status = 500;
                response.message = err;
            } else {
                response.status = 201;
                response.message = movie.actors;
            }
            res.status(response.status).json(response.message);
        });
    }
};

const _findMovieByIdAndReturnResponse = (err, movie, response, res) => {
    if (err) {
        res.status(500).json({ error: err });
    } else {
        res.status(response.status).json(movie);
    }
};

module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne
};