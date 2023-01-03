const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Poll = require('./../models/pollModel');
const Option = require('./../models/optionModel');

exports.vote = catchAsync(async (req, res, next) => {
  let option_id = req.params.option_id;
  let poll_id = req.params.poll_id;

  new Poll(undefined, poll_id).updateVotes();

  new Option(undefined, undefined, option_id).update();

  res
    .status(200)
    .json({ status: 'success', message: 'Vote has been submitted' });
});

exports.createPoll = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  let options = [];

  const poll = new Poll(name).save();
  const poll_id = poll.poll_id;
  const admin_id = poll.admin;

  Object.keys(req.body).forEach((el) => {
    if (el.startsWith('option-')) {
      let option = req.body[el];
      let option_id = new Option(option, poll_id).save();
      options.push(option_id);
    }
  });

  let data = {
    poll,
    options,
  };

  res.status(201).json({
    status: 'success',
    message: 'poll created successfuly',
    data: {
      hostName: `${req.protocol}://${req.headers.host}`,
      poll_id,
      admin_id,
    },
  });
});

exports.getPoll = catchAsync(async (req, res, next) => {
  const poll_id = req.params.poll_id;
  new Poll(undefined, poll_id).find((poll) => {
    new Option(undefined, poll_id, undefined).find((options) => {
      if (!poll.name) {
        return next(new AppError('No such poll exists', 404));
      }
      res.status(200).json({ status: 'success', poll, options });
    });
  });
});

exports.updatePoll = catchAsync(async (req, res, next) => {
  const poll_id = req.params.poll_id;
  let poll,
    options = [];
  const { name } = req.body;
  if (name) {
    poll = new Poll(name, poll_id).update().deleteAllOptions();
  }

  Object.keys(req.body).forEach((el) => {
    if (el.startsWith('option-')) {
      let option = req.body[el];
      let option_id = new Option(option, poll_id).save();
      options.push(option_id);
    }
  });

  let data = {
    poll,
    options,
  };

  res.status(201).json({ status: 'success', data });
});

exports.deletePoll = catchAsync(async (req, res, next) => {
  const poll_id = req.params.poll_id;
  const poll = new Poll(undefined, poll_id);
  poll.deleteAllOptions();
  poll.delete();

  res
    .status(200)
    .json({ status: 'success', message: 'Your poll was deleted successfully' });
});
