export function hangulEncoder(queryParams) {
  const kor_reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식

  if (queryParams.match(kor_reg)) {
    const encodeQuery = encodeURI(queryParams);
    return encodeQuery;
  } else {
    return queryParams;
  }
}

// 사용 예시
// const queryParams = "덩굴성";
// client.get(`${API.baseUrl}/api/products?category=${hangulEncoder(queryParams)}`);
