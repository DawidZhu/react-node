import React from 'react';

import './MainHeader.css';

// Dumb / Stateless / Presentational Component，因为它们只负责表现 DOM，如：网站头尾那种整块的部分。
// 组件被定义一次后，可以在应用中被多次引用；值渲染其核心部分，组件的每个实例看起来都差不多。
//想要改变其外观的话，只有 props 这一个地方可以着手。简单又直观。
const MainHeader = props => {
  return <header className="main-header">{props.children}</header>;
  // 查看父组件的参数 props.children
};

export default MainHeader;
