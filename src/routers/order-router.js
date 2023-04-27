import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired, adminOnly, asyncHandler } from "../middlewares";
import { orderService } from "../services";
import { krDate } from "../utils";

const orderRouter = Router();

//주문 생성 api
orderRouter.post(
  "/new-order",
  loginRequired,
  asyncHandler(async (req, res) => {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const {
      userId,
      productList,
      recipient,
      phoneNumber,
      zipCode,
      address1,
      address2,
      shippingMessage,
      shippingStatus, //undefined
    } = req.body;
    const date = krDate();
    const newOrder = await orderService.addOrder({
      userId,
      productList,
      recipient,
      phoneNumber,
      zipCode,
      address1,
      address2,
      shippingMessage,
      shippingStatus, // default '배송전'
      createdDate: date,
    });
    res.status(201).json(newOrder);
  })
);

//주문 수정 api
orderRouter.patch(
  "/orders/:oid",
  loginRequired,
  asyncHandler(async (req, res) => {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const orderId = req.params.oid;
    const {
      recipient,
      phoneNumber,
      zipCode,
      address1,
      address2,
      shippingMessage,
    } = req.body;
    const orderInfoRequired = { orderId };

    const toUpdate = {};

    if (recipient) {
      toUpdate.recipient = recipient;
    }
    if (phoneNumber) {
      toUpdate.phoneNumber = phoneNumber;
    }
    if (zipCode) {
      toUpdate.zipCode = zipCode;
    }
    if (address1) {
      toUpdate.address1 = address1;
    }
    if (address2) {
      toUpdate.address2 = address2;
    }
    if (shippingMessage) {
      toUpdate.shippingMessage = shippingMessage;
    }
    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await orderService.updateOrderInfo(
      orderInfoRequired,
      toUpdate
    );

    res.status(200).json(updatedUserInfo);
  })
);

//주문 삭제 api
orderRouter.delete(
  "/orders",
  loginRequired,
  asyncHandler(async (req, res) => {
    const orderId = req.query.oid;
    const deletedOrderInfo = await orderService.deleteOrder(orderId);
    res.status(200).send("주문 삭제에 성공했습니다!").json(deletedOrderInfo);
  })
);

//유저 전체 주문 리스트 전달
orderRouter.get(
  "/orders/:uid",
  loginRequired,
  asyncHandler(async (req, res) => {
    const userId = req.params.uid;
    const orderListByUserId = await orderService.getOrderListByUserId(userId);
    res.status(200).json(orderListByUserId);
  })
);

// 관리자 상품 전체 조회
orderRouter.get(
  "/admin/orders/",
  adminOnly,
  asyncHandler(async (req, res) => {
    const currentPage = Number(req.query.currentPage) || 1;
    const perPage = 8;

    const orderLists = await orderService.getOrderLists(currentPage, perPage);
    res.status(200).json(orderLists);
  })
);

//관리자의 주문 상태 변경 기능
orderRouter.patch(
  "/admin/orders/:oid",
  adminOnly,
  asyncHandler(async (req, res) => {
    const orderId = req.params.oid;
    const { shippingStatus } = req.body;

    const orderInfoRequired = { orderId };
    const toUpdate = {};

    if (shippingStatus) {
      toUpdate.shippingStatus = shippingStatus;
    }

    const statusUpdatedOrder = await orderService.updateOrderStatus(
      orderInfoRequired,
      toUpdate
    );
    res.status(200).json(statusUpdatedOrder);
  })
);

//관리자의 주문 삭제 기능
orderRouter.delete(
  "/admin/orders/:oid",
  adminOnly,
  asyncHandler(async (req, res) => {
    const orderId = req.params.oid;
    const deletedOrderInfo = await orderService.deleteOrder(orderId);
    res.status(200).send("주문 삭제에 성공했습니다!").json(deletedOrderInfo);
  })
);

//관리자의 배송 상태별 주문 count
orderRouter.get(
  "/admin/orders/shipping-status",
  adminOnly,
  asyncHandler(async (req, res) => {
    const orderCountByShippingStatus = await orderService.getOrderCounts();

    res.status(200).json(orderCountByShippingStatus);
  })
);

export { orderRouter };
