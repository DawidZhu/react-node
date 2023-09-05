import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
// Users 容器组件，放到Page目录，包含 展示组件ErrorModal&  UserList & UserItem等

//Smart / Stateful / Container Component 组件有着不同的职责，container components因为背负了灵巧之名，它们必须得关注 state 并留意应用是如何工作的。
// Users page 用来显示用户信息，包含 componenet: UsersList, UsersList又包含componenet： UserItem

// Users 容器组件，放到Page 目录
const Users = () => {

  //根据自定义的4个 返回参数 useHttpClient
  // 自定义 Hooks useHttpClient 的返回值
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //State Hook让函数组件也可以有state状态, 并进行状态数据的读写操作
  //语法: const [xxx, setXxx] = React.useState(initValue)  
  // loadedUsers 存放从后台查询的User 数据
  const [loadedUsers, setLoadedUsers] = useState();

  //默认情况下，React 会在每次渲染后调用副作用side effects函数 —— 包括第一次渲染的时候
  //useEffect Hook 让你在函数组件（functional components）中执行副作用（side effects）。
  //side effects 是可以与组件的主要操作一起运行的动作，如外部 API 交互、修改 state 变量（state variables）和数据获取。
  //通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作
  //将 useEffect 放在组件内部让我们可以在 effect 中直接访问 useState 变量（或其他 props）
  //useEffect会在每次 DOM 渲染后执行，不会阻塞页面渲染。
  // useEffect 它让你在函数组件（functional components）中复制 React 的生命周期方法。
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //在React中调用后端接口，常用的方式有两种：使用fetch API和使用axios。
        const responseData = await sendRequest(
          'http://localhost:1000/api/users'
        );
        //const responseData = await axios.get("http://localhost:1000/api/users") 

        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [sendRequest]);
  //该 Hook 有两个参数，第一个参数是一个包含命令式、且可能有副作用side effects代码的函数，第二个参数是一个数组，
  //此参数来控制该Effect包裹的函数执不执行，如果第二个参数不传递，则该Effect每次组件刷新都会执行
  // sendRequest 改变时才会执行

  // return 目的：即是整个组件的作用， 交给父组件渲染 renter
  // 父子组件的传值，子组件 UsersList 通过 props.items 取值
  return (
    <React.Fragment>
      {/* ErrorModal 子组件，发生错误时，展示错误信息，参数作为子组件的 prons */}
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && (
      <div className="center">
        <LoadingSpinner />
      </div>
    )}
    {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
  </React.Fragment>
  );
};

export default Users;
