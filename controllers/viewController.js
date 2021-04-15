const Poll = require('./../models/pollModel');
const Option = require('./../models/optionModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = (req, res) => {
  res.status(200).render('home', {
    hostName: `${req.protocol}://${req.headers.host}`,
  });
};

exports.getPoll = catchAsync(async (req, res, next) => {
  const poll_id = req.params.poll_id;
  const admin_id = req.params.admin_id;
  let page = 'choose';
  console.log(req.originalUrl);

  if (req.originalUrl.split('/').includes('admin')) {
    page = 'result';
  }

  new Poll(undefined, poll_id).find((poll) => {
    new Option(undefined, poll_id, undefined).find((options) => {
      if (!poll.name) {
        return next(new AppError('No such poll exists', 404));
      }
      if (page === 'result' && poll.admin != admin_id) {
        return next(
          new AppError('You are not authorized to access this route', 403)
        );
      }
      res.status(200).render(page, {
        poll,
        options,
        hostName: `${req.protocol}://${req.headers.host}`,
      });
    });
  });
});
