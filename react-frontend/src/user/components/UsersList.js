import React from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';

// UsersList 展示Component，因为它们只负责表现 DOM，父组件是 Users 容器组件
// 调用组件 <UsersList items={loadedUsers} />
// 通过在子组件上写 props，将数据从父组件中传递到子组件，子组件再从 props.xxx 中获取相应的值
//延伸到 React 当中，属性就被称作 props（properties 的缩写）。组件之间可以通过 Props 进行交互。
const UsersList = props => {
  if (props.items.length === 0) {
  
    // return 目的：页面渲染
    // className 属性用于指定 CSS 的 class，此特性适用于所有常规 DOM 节点和 SVG 元素，如 <div>，<a> 及其它标签。
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  // 返回用户的列表，每个Item 包含user的所有属性信息
  return (
    <ul className="users-list">

      {props.items.map(user => (
        // 需要展示的数据传递给 子组件 UserItem
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;
