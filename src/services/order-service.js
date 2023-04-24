import { model } from 'mongoose';
import { orderModel } from '../db';
import { productModel } from '../db';
import { userModel } from '../db';
import { shortId } from '../db/schemas/types/short-id';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
    this.userModel = userModel;
    this.productModel = productModel;
  }

  //주문 생성
  async addOrder(orderInfo) {
    //여기서 ProductList는 ObjectId와 quantity 들을 담은 List임.
    const {
      userId,
      productList,
      recipient,
      phoneNumber,
      zipCode,
      address1,
      address2,
      shippingMessage,
      shippingStatus,
    } = orderInfo;
    const newOrderInfo = {
      userId,
      productList,
      recipient,
      phoneNumber,
      zipCode,
      address1,
      address2,
      shippingMessage,
      shippingStatus,
    };

    for (let i = 0; i < productList.length; i++) {
      const productId = productList[i].productId;
      const product = await this.productModel.findById(productId);
      const count = Number(productList[i].quantity);
      const productStock = Number(product.stock);
      if (productStock < count) {
        throw new Error('상품 주문 개수가 현재 재고 수보다 많습니다. ');
      }
      const updatedProduct = await this.productModel.updateById({
        productId,
        count: count * -1,
      });
    }

    const createdOrder = await this.orderModel.create(newOrderInfo);

    return createdOrder;
  }

  //일반 유저의 주문 정보 수정
  async updateOrderInfo(orderInfoRequired, toUpdate) {
    const { orderId } = orderInfoRequired;
    let order = await this.orderModel.findById(orderId);

    if (order.shippingStatus === '배송전') {
      order = await this.orderModel.update({
        orderId,
        update: toUpdate,
      });

      return order;
    } else {
      throw new Error(
        "배송 상태가 '배송전'인 경우에만 정보를 수정할 수 있습니다.",
      );
    }
  }

  //일반 유저의 주문 정보 삭제
  async deleteOrder(orderId) {
    let order = await this.orderModel.findById(orderId);
    if (order.shippingStatus === '배송전') {
      order = await this.orderModel.deleteById(orderId);
    } else {
      throw new Error(
        "배송 상태가 '배송전'인 경우에만 정보를 삭제할 수 있습니다.",
      );
    }

    order.productList.

  }

  async getOrderListByUserId(userId) {
    let orderList = await this.orderModel.findByUserId(userId);
    return orderList;
  }

  //관리자의 주문 목록 전체 조회 with 페이지네이션
  async getOrderLists(currentPage, perPage) {
    let orderLists = await this.orderModel.findAll(currentPage, perPage);

    if (orderLists.length === 0) {
      throw new Error('주문 내역이 없습니다.');
    }

    return orderLists;
  }

  //관리자의 주문 상태 수정
  async updateOrderStatus(orderInfoRequired, toUpdate) {
    const { orderId } = orderInfoRequired;
    let updatedOrder = await this.orderModel.update({
      orderId,
      update: toUpdate,
    });
    return updatedOrder;
  }

  async getOrderCounts() {
    const [preShippingOrderCount, inShippingOrderCount, shippedOrderCount] =
      await Promise.all([
        this.orderModel.countOrders({ shippingStatus: '배송전' }),
        this.orderModel.countOrders({ shippingStatus: '배송중' }),
        this.orderModel.countOrders({ shippingStatus: '배송완료' }),
      ]);

    const totalOrderCount =
      preShippingOrderCount + inShippingOrderCount + shippedOrderCount;

    return {
      totalOrderCount,
      preShippingOrderCount,
      inShippingOrderCount,
      shippedOrderCount,
    };
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
