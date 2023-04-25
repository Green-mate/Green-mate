async function pagenate(page, perPage, products) {
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;
  const result = {};

  if (endIndex < products.length) {
    result.next = {
      page: page + 1,
      perPage: perPage,
    };
  }

  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      perPage: perPage,
    };
  }

  result.results = products.slice(startIndex, endIndex);
  return result;
}

export { pagenate };
