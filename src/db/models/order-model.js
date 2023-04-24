import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';
const Order = model('Order', OrderSchema);

export class OrderModel {
  //주문 목록 전체 조회 with pagination
  async findAll(currentPage, perPage) {
    const orders = await Order.find(
      {},
      '_id productList shippingStatus createdAt',
    )
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate('productList.shortId', 'productName productPrice')
      .exec();
    return orders;
  }

  //ID로 주문 조회
  async findById(orderId) {
    const order = await Order.findById({ _id: orderId });
    return order;
  }

  // userId들에 해당하는 주문리스트 조회
  async findByUserId(userId) {
    const orderList = await Order.find({ userId: userId })
      .populate(
        'productList.shortId',
        'productName productPrice stock productImage',
      )
      .exec();
    return orderList;
  }

  //주문 생성
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }
  //주문 삭제
  async deleteById(orderId) {
    const result = await Order.deleteOne({ _id: orderId });
    return result;
  }

  //주문 내용 수정
  async update({ orderId, update }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false }; //업데이트된 도큐먼트를 반환해줌.

    const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
    return updatedOrder;
  }

  //주문 개수 count by filter
  async countOrders(filter) {
    const countedOrders = await Order.countDocuments(filter);
    return countedOrders;
  }
}
const orderModel = new OrderModel();

export { orderModel };
