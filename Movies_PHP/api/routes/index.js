const router = require("express").Router();
const moviesController = require("../controllers/movies.controller");
const actorsController = require("../controllers/actors.controller");

router.route("/movies")
    .get(moviesController.getAll)
    .post(moviesController.addOne);

router.route("/movies/:movieId")
    .get(moviesController.getOne)
    .delete(moviesController.deleteOne)
    .put(moviesController.updateOne);

router.route("/movies/:movieId/actors")
    .get(actorsController.getAll)
    .post(actorsController.addOne);

router.route("/movies/:movieId/actors/:actorId")
    .get(actorsController.getOne)
    .put(actorsController.updateOne)
    .delete(actorsController.deleteOne);


module.exports = router;

