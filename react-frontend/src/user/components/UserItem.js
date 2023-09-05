import React from 'react';
// Link 组件
import { Link } from 'react-router-dom';
import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

// UserItem 展示Component，因为它们只负责表现 DOM 
const UserItem = props => {
  // 通过在子组件上写 props，将数据从父组件中传递到子组件，子组件再从 props.xxx 中获取相应的值 
  // return 目的： 页面渲染，通过 html&JSX + 组件 布局页面展示
  return (
    <li className="user-item">
      <Card className="user-item__content">
        {/* Card 组件，样式显示 */}

        {/* Link 组件 动态链接 path， 从父组件UsersList取值 props.id 
          通过 userID，查询该用户下的所有places
          路由到 UserPlaces 容器组件
        */}
        <Link to={`/${props.id}/places`}> 
          <div className="user-item__image">
            {props.id}

            {/* 使用自定义的 Avatar 组件 */}  
            <Avatar image={props.image} alt={props.id} />
          </div>

           {/*  显示主要信息 */}  
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {/*  判断是多个还是一个 */}  
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
