import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';

// Dumb / Stateless / Presentational Component，因为它们只负责表现 DOM，如：网站头尾那种整块的部分。
// 组件被定义一次后，可以在应用中被多次引用；值渲染其核心部分，组件的每个实例看起来都差不多。
// 想要改变其外观的话，只有 props 这一个地方可以着手。简单又直观。
const MainNavigation = props => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {/*React.Fragment 作用？  */}
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        {/* SideDrawer，移动端 APP使用 */}
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
          {/* NavLink,路径选中时，对应的a元素变为红色，这个时候，我们要使用NavLink组件来替代Link组件 */}
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>

        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces/ 首页 </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
