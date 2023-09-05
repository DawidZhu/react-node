import React from 'react';

import './Card.css';
// Card，Dumb Component, 包含 显示内容和样式 html & css
//  It also does not have any state or lifecycle hooks. 
// However, it still can receive some data and function from the parents via props.
const Card = props => {
  // return 目的：present something to the DOM, 页面显示，html 
  return (
    // 从 父组件获取 ${props.className}
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
