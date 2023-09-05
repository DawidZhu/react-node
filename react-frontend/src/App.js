import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
// App 父组件，主要是渲染页面整体架构，包括基础的子组件， Login 和 Router
//A Component is one of the core building blocks of React. 
//every application you will develop in React will be made up of pieces called components. 
//Dumb Component, Smart Component, Pure Component, Higher-Order Component, Controlled & Uncontrolled Component
//The usage of Pure Component gives a considerable increase in performance because it reduces the number of render operations in the application.

// React发明了JSX， 可以简单地理解它是一种在JS中编写与XML类似的语言。通过JSX来声明组件的属性，类型与结果，
// 并且通过｀{}`插值，套嵌JS逻辑与子级的JSX。

// App Component 函数组件
const App = () => {
  //ES6 附带的功能之一是添加了let和const，可用于变量声明
  //ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了（所以也被叫作ES2015）
  //用const声明的变量保持常量值。const 不能被修改并且不能被重新声明，每个const声明都必须在声明时进行初始化。
  //像let声明一样，const声明只能在声明它们的块级作用域  block scoped. 中访问
  //当用const声明对象时，这种行为却有所不同。虽然不能更新const对象，但是可以更新该对象的属性。
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);
  //React Hooks是从React 16.8版本推出的新特性，目的是解决React的状态共享以及组件生命周期管理混乱的问题。
  //Hooks 是 React 16.8 版本中引入的内置 React 函数。它们允许你在函数组件（Functional components）中使用 React 库的功能，
  //如生命周期方法（lifecycle methods）、状态（state）和上下文（context ），而不必担心将其重写为一个类（class）
  // 拥有了Hooks，你再也不需要写Class了，你的所有组件都将是Function。
  //Hooks 是函数，有多个种类，每个 Hook 都为Function Component提供使用 React 状态和生命周期特性的通道
  // Hooks 使用原则 1.只在组件的顶层调用 Hooks； 2.只从React函数中调用Hooks：
  // State Hook让函数组件也可以有state状态, 允许你在函数组件（functional components）内创建、更新和操作状态。
  // 语法: const [xxx, setXxx] = useState(initValue), 变量 isLoggedIn

  // useCallback会返回一个函数的 memoized（记忆的）值；
  // 在依赖不变的情况下，最后一个参数[]， 它会返回相同的引用，避免子组件进行无意义的重复渲染：
  //通常使用useCallback的目的是不希望子组件进行多次渲染，并不是为了函数进行缓存；
  //const fnA = useCallback(fnB, [a])
  //useCallback会将传递给它的函数fnB返回，并且会将函数fnB的运行结果进行缓存。并且，当依赖a变更时还会返回新的函数。
  // uid？？？
  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  // let 是块级作用域：在带有let的块中声明的变量仅可在该块中使用
  // let 可以被修改但是不能被重新声明.
  let routes;
// 如果已登陆 isLoggedIn, 路由到的都是页面 page
  if (isLoggedIn) {
    // exact：是否精准匹配；
    routes = (
      <Switch>
        <Route path="/" exact>
         {/* 主页显示： Users 组件*/}
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
     
      </Switch>
    );
  } else {
    // 如果未登陆 isLoggedIn,路由到的都是页面 page
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
      {/* 测试使用 UpdatePlace  */}
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>

        <Redirect to="/auth" />
      </Switch>
    );
  }
//  认证环境变量信息
  return (
    
    <AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      userId: userId,
      login: login,
      logout: logout
    }}
  >
      
      <Router>
        {/* MainNavigation 自定义导航菜单组件*/}
        <MainNavigation /> 

        {/*  根据Path，显示路由到的 组件*/}
        <main>{routes}</main> 
      </Router>
      </AuthContext.Provider>
  );
};
// export
export default App;
