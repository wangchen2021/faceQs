import axios from 'axios'
import './App.css'
import { Suspense } from 'react'

// 1. 全局缓存容器：存储 { promise: Promise实例, data: 解析后的数据 }
const requestCache = new Map();

const fetchUser = () => {
  const cacheKey = 'test_user';
  
  // 若已有缓存，直接返回
  if (requestCache.has(cacheKey)) {
    const cache = requestCache.get(cacheKey);
    // 若 Promise 已解析，直接抛出数据（让组件渲染）；若未解析，抛出 Promise（让 Suspense 暂停）
    if (cache.data) {
      return cache.data;
    }
    throw cache.promise;
  }

  // 存储数据的容器
  const cache = {
    promise: null as any,
    data: null,
  };

  // 发起 Axios 请求
  const requestPromise = axios.get("http://localhost:3000/test")
    .then((res) => {
      cache.data = res.data; // 关键：Promise 解析后，将数据存入 cache
      return res.data;
    })
    .catch((err) => {
      requestCache.delete(cacheKey); // 失败时删除缓存
      throw err;
    });

  cache.promise = requestPromise;
  requestCache.set(cacheKey, cache);

  // 关键：抛出 Promise，让 Suspense 捕获并暂停
  throw requestPromise;
}

const AxiosComponent = () => {
  // 此时 fetchUser 会抛出 Promise（Suspense 暂停）或返回解析后的 data
  const user = fetchUser();
  return <div>{JSON.stringify(user)}</div>;
}

function App() {
  return (
    <>
      <Suspense fallback={<div>wait me for a moment</div>}>
        <AxiosComponent />
      </Suspense>
    </>
  )
}

export default App