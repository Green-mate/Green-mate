let dataBase;

const openDataBase = () => {
  const db = new Promise((resolve, reject) => {
    const onRequest = indexedDB.open('GreenMateStorage', 1);
    onRequest.onupgradeneeded = () => {
      console.log('indexedDB 업그레이드 작동.');
      const database = onRequest.result;

      database.createObjectStore('cart', {
        autoIncrement: true,
      });
      database.createObjectStore('order', {
        autoIncrement: true,
      });
    };

    onRequest.onsuccess = async () => {
      console.log('indexedDB 실행 성공!');

      resolve(onRequest.result);
    };
    onRequest.onerror = () => {
      const err = onRequest.error;
      console.log(`indexedDB 실행 실패... : ${err}`);
      reject(err);
    };
  });
  return db;
};

const getFromDb = async (storeName, key = '') => {
  if (!dataBase) {
    dataBase = await openDataBase();
  }

  const transaction = dataBase.transaction([storeName]);
  const store = transaction.objectStore(storeName);

  const data = new Promise((resolve, reject) => {
    const getRequest = key ? store.get(key) : store.getAll();

    getRequest.onsucess = () => {
      resolve(getRequest.result);
    };
    getRequest.onerror = () => {
      const err = getRequest.error;
      console.log(`상품 불러오기 실패... : ${err}`);
      reject(err);
    };
  });
  return data;
};
