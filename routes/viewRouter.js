const express = require('express');
const viewController = require('./../controllers/viewController');
const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/poll/:poll_id', viewController.getPoll);

router.get('/poll/admin/:poll_id/:admin_id', viewController.getPoll);

module.exports = router;
