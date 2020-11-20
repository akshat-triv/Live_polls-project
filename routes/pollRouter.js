const express = require('express');
const pollController = require('./../controllers/pollController');
const router = express.Router();

router.get('/vote/:poll_id/:option_id', pollController.vote);

router.route('/').post(pollController.createPoll);

router
  .route('/:poll_id')
  .get(pollController.getPoll)
  .patch(pollController.updatePoll)
  .delete(pollController.deletePoll);

module.exports = router;
