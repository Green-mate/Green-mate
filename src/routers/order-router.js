import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { orderService } from '../services';

const orderRouter = Router();

//주문 생성 api
orderRouter.post('/new-order', loginRequired, async (req, res, next) => {
  try {
    const {
      userId,
      productList,
      recipient,
      phoneNumber,
      zipCode,
      address1,
      address2,
      shippingMessage,
      shippingStatus, //undefined로 보내주시면 됩니다.
    } = req.body;
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
    });
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

//주문 수정 api
orderRouter.patch('/orders/:oid', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
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
      toUpdate,
    );

    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
