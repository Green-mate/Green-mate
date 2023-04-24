import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import {
  viewsRouter,
  userRouter,
  productRouter,
  categoryRouter,
  orderRouter,
} from './routers';
import { errorHandler } from './middlewares';

const app = express();

// 요청과 응답에 대한 정보를 콘솔에 기록하는 morgan 미들웨어 추가.(app.js 가장 위에 있어야 함!)
// 나중에 배포환경, 개발환경에 따라 케이스를 나눠야 하지만, 일단은 개발환경만 연결.
app.use(morgan('dev'));
// app.use(morgan('combined'));

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// api 라우팅

app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', orderRouter);

// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
