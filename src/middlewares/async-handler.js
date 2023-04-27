//try-catch구문 반복을 줄여줄 asyncHandler
function asyncHandler(requestHandler) {
  return async function (req, res, next) {
    try {
      await requestHandler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

export { asyncHandler };
