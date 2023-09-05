import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
// 程序入口，index.js , 添加需要渲染的组件 App

//我们一般会在项目的src/index.js文件中初始化项目，即创建根节点后将App组件渲染render 到根节点上
// JS & JSX文件后缀：其实没有什么区别，只不过是方便一眼看出该文件中包含jsx 语法罢了，
// 如果你用.jsx 后缀名，那么需要配置babel 等支持。 所以一般来说用.js 后缀就行了。
// document.getElementById('root')，root 放到index.html
ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(element, container[, callback])
//render() 方法用于在提供的容器参数 container 里渲染一个 React 元素 element。
//如果 React 元素之前已经在 container 里渲染过，这将会对其执行更新操作，并仅会在必要时改变 DOM 以映射最新的 React 元素。
//如果提供了可选的回调函数 callback，该回调将在组件被渲染或更新之后被执行。



