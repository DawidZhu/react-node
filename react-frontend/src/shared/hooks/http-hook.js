import { useState, useCallback, useRef, useEffect } from 'react';

// 在React中调用后端接口，常用的方式有两种：使用fetch API和使用axios。
// fetch是es6新增的用于网络请求标准api，它是一个api。
// axios是用于网络请求的第三方库，它是一个库。
export const useHttpClient = () => {

  //State Hook让函数组件也可以有state状态, 并进行状态数据的读写操作
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
//useRef返回的 ref 对象在组件的整个生命周期内保持不变，也就是说每次重新渲染函数组件时，返回的ref 对象都是同一个, 它类似于一个 class 的实例属性
  const activeHttpRequests = useRef([]);
//useCallback 
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        // await 
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);
// 自定义返回参数
  return { isLoading, error, sendRequest, clearError };
};
