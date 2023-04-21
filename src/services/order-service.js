import { orderModel } from '../db';
import { productModel } from '../db';
import { userModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
    this.userModel = userModel;
  }

  //주문 생성
  async addOrder(orderInfo) {
    //여기서 ProductList는 productId들을 담은 List임.
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
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
