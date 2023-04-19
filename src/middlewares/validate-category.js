function validateCategory(req, res, next) {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res
      .status(400)
      .json({ message: '카테고리 이름은 필수 항목입니다.' });
  }
  next();
}

export { validateCategory };
