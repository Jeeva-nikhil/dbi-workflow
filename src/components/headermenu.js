import React, { useState } from "react";
import { Link, NavLink } from 'react-router-dom';

function Headermenu() {
  const [isExpand, setExpand] = useState(false);

  const handleToggleExpand = () => {
    setExpand(!isExpand);
  };

  return (
      <div className="" style={{ zIndex: -1, position: "relative" }}>
        <div className="app-sidebar__overlay" data-bs-toggle="sidebar" />
        <div className="app-sidebar ps horizontal-main" style={{ width: '100%' }}>
          <div className="side-header">
            <Link to="index.html" className="header-brand1">
              <img
                  src="../assets/images/brand/logo.png"
                  className="header-brand-img desktop-logo"
                  alt="logo"
              />
              <img
                  src="../assets/images/brand/logo-1.png"
                  className="header-brand-img toggle-logo"
                  alt="logo"
              />
              <img
                  src="../assets/images/brand/logo-2.png"
                  className="header-brand-img light-logo"
                  alt="logo"
              />
              <img
                  src="../assets/images/brand/logo-3.png"
                  className="header-brand-img light-logo1"
                  alt="logo"
              />
            </Link>
          </div>
          <div className="main-sidemenu container">
            <ul className="side-menu flex-nowrap">
              <li>
                <NavLink to={'/'} className="slide-item">
                  <i className="side-menu__icon fe fe-pie-chart" />
                  <span className="side-menu__label">Workflow</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={'/'} className="slide-item">
                  <i className="side-menu__icon fe fe-settings" />
                  <span className="side-menu__label">Workflow Configuration</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}

export default Headermenu;
