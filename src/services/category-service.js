import { categoryModel, productModel } from '../db';

class CategoryService {
  constructor(categoryModel, productModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
  }

  async addCategory(categoryInfo) {
    // 객체 destructuring
    const { title } = categoryInfo;

    // 이름 중복 확인
    const category = await this.categoryModel.findByTitle(title);
    if (category) {
      throw new Error(
        '이 이름은 현재 사용중입니다. 다른 이름을 입력해 주세요.',
      );
    }

    // db에 저장
    const createdNewCategory = await this.categoryModel.create(categoryInfo);

    return createdNewCategory;
  }

  async getCategorys() {
    const categorys = await this.categoryModel.findAll();
    return categorys;
  }

  async setCategory(categoryId, toUpdate) {
    // 업데이트 진행
    const updatedCategory = await this.categoryModel.update({
      categoryId,
      update: toUpdate,
    });

    return updatedCategory;
  }

  async getCategoryDataById(cid) {
    const category = await this.categoryModel.findById(cid);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error(
        '해당 id의 카테고리는 없습니다. 다시 한 번 확인해 주세요.',
      );
    }

    return category;
  }

  async getCategoryDataByTitle(categoryTitle) {
    const category = await this.categoryModel.findByTitle(categoryTitle);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error(
        '해당 이름의 카테고리는 없습니다. 다시 한 번 확인해 주세요.',
      );
    }

    return category;
  }

  async deleteCategoryData(cid) {
    // 만약 해당 카테고리의 제품이 1개라도 있다면, 삭제 불가함.
    // const product = await this.productModel.findById(cid);

    // if (product) {
    //   throw new Error(
    //     `${cid} 카테고리에 등록된 제품이 있습니다. 등록된 제품이 없어야 카테고리 삭제가 가능합니다. `,
    //   );
    // }

    const { deletedCount } = await this.categoryModel.deleteById(cid);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new Error(`${cid} 카테고리의 삭제에 실패하였습니다`);
    }

    return { result: 'success' };
  }
}

const categoryService = new CategoryService(categoryModel, productModel);

export { categoryService };
