function renderCategoryBar() {
  const categoryBar = document.querySelector('#category-list-section');

  categoryBar.innerHTML = `
  <hr class="my-4 border-t border-gray-500 w-1200 opacity-25" />
      <nav id="category-wrap" class="w-1200 h-auto flex-wrap">
        <ul id="user-menu-navbar" class="flex flex-row justify-around">
          <li class="text-green-500 text-lg font-bold">
            <a class="cursor-pointer" aria-current="page">전체상품</a>
          </li>
          <li class="text-lg font-bold">
            <a class="cursor-pointer">관엽/공기정화식물</a>
          </li>
          <li class="text-lg font-bold">
            <a class="cursor-pointer">다육/선인장</a>
          </li>
          <li class="text-lg font-bold">
            <a class="cursor-pointer">야생화</a>
          </li>
          <li class="text-lg font-bold">
            <a class="cursor-pointer">분재</a>
          </li>
          <li class="text-lg font-bold">
            <a class="cursor-pointer">동양란/서양란</a>
          </li>
          <li class="text-lg font-bold">
            <a class="cursor-pointer">화분</a>
          </li>
          <li class="text-lg font-bold">
            <a class="cursor-pointer">원예/자재류</a>
          </li>
        </ul>
      </nav>
      <hr class="my-4 border-t border-gray-500 w-1200 opacity-25" />`;
}

renderCategoryBar();
