import React from 'react';

import './Avatar.css';
//Avatar, Dumb Component，包含 需要展示的页面内容和样式
//  It also does not have any state or lifecycle hooks. 
// However, it still can receive some data and function from the parents via props.
const Avatar = props => {
  // return 目的：present something to the DOM, 页面显示，html
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
