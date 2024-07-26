import React, { useState,useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Myheader() {
  const [showModal, setShowModal] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationModal(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  const toggleNotificationModal = () => {
    setShowNotificationModal(!showNotificationModal);
  };

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal);
  };


  return (
    <>
       <div className="header hor-header">
        <div className="container-fluid main-container">
          <div className="d-flex">
            <Link
              aria-label="Hide Sidebar"
              className="app-sidebar__toggle"
              data-bs-toggle="sidebar"
              to="#"
            />
            <Link className="logo-horizontal" to="#">
              <img
                src="../assets/images/brand/logo.png"
                className="header-brand-img desktop-logo"
                alt="logo"
              />
              <img
                src="../assets/images/brand/logo-3.png"
                className="header-brand-img light-logo1"
                alt="logo"
              />
            </Link>
            <div className="main-header-center ms-3 d-none d-lg-block" style={{ marginTop: 17 }}>
              <input
                className="form-control"
                placeholder="Search for results..."
                type="search"
              />
              <button className="btn px-0 pt-2">
                <i className="fe fe-search" aria-hidden="true" />
              </button>
            </div>
            <div className="d-flex order-lg-2 ms-auto header-right-icons">
              <div className="dropdown d-none">
                <Link
                  to="#"
                  className="nav-link icon"
                  data-bs-toggle="dropdown"
                >
                  <i className="fe fe-search" />
                </Link>
                <div className="dropdown-menu header-search dropdown-menu-start">
                  <div className="input-group w-100 p-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search...."
                    />
                    <div className="input-group-text btn btn-primary">
                      <i className="fe fe-search" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="navbar-toggler navresponsive-toggler d-lg-none ms-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent-4"
                aria-controls="navbarSupportedContent-4"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon fe fe-more-vertical" />
              </button>
              <div className="navbar navbar-collapse responsive-navbar p-0">
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent-4"
                >
                  <div className="d-flex order-lg-2">
                    <div className="dropdown d-lg-none d-flex">
                      <Link
                        to="#"
                        className="nav-link icon"
                        data-bs-toggle="dropdown"
                      >
                        <i className="fe fe-search" />
                      </Link>
                      <div className="dropdown-menu header-search dropdown-menu-start">
                        <div className="input-group w-100 p-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search...."
                          />
                          <div className="input-group-text btn btn-primary">
                            <i className="fa fa-search" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </div>
                     {/* <div className="d-flex country">-109
                      <Link className="nav-link icon theme-layout nav-link-bg layout-setting">
                        <span className="dark-layout">
                          <i className="fe fe-moon" />
                        </span>
                        <span className="light-layout">
                          <i className="fe fe-sun" />
                        </span>
                      </Link>
                    </div> */}
                    <div ref={notificationRef} className={`dropdown d-flex notifications ${showNotificationModal ? 'show' : ''}`}>
                      <div className="nav-link icon" onClick={toggleNotificationModal}>
                        <i className="fe fe-bell" />
                        <span className="pulse" />
                      </div>
                      {showNotificationModal && (
                        <div style={{ position: "absolute", left: "-256px" }} className="dropdown-menu dropdown-menu-end dropdown-menu-arrow show">
                          {/* Dropdown menu content */}
                          <div className="drop-heading border-bottom">
                            <div className="d-flex">
                              <h6 className="mt-1 mb-0 fs-16 fw-semibold text-dark">
                                Notifications
                              </h6>
                            </div>
                          </div>
                          <div className="notifications-menu">
                            {/* Your notification items */}
                            {/* Example item */}
                            <div className="dropdown-item d-flex">
                              <div className="me-3 notifyimg bg-primary brround box-shadow-primary">
                                <i className="fe fe-mail" />
                              </div>
                              <div className="mt-1 wd-80p">
                                <h5 className="notification-label mb-1">
                                  New Application received
                                </h5>
                                <span className="notification-subtext">
                                  3 days ago
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="dropdown-divider m-0" />
                          <Link
                            to="#"
                            className="dropdown-item text-center p-3 text-muted"
                          >
                            View all Notification
                          </Link>
                        </div>
                      )}
                    </div>
                   
 {/* <div className="dropdown  d-flex message">-152
                      <Link
                        className="nav-link icon text-center"
                        data-bs-toggle="dropdown"
                      >
                        <i className="fe fe-message-square" />
                        <span className="pulse-danger" />
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <div className="drop-heading border-bottom">
                          <div className="d-flex">
                            <h6 className="mt-1 mb-0 fs-16 fw-semibold text-dark">
                              You have 5 Messages
                            </h6>
                            <div className="ms-auto">
                              <Link
                                to="#"
                                className="text-muted p-0 fs-12"
                              >
                                make all unread
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="message-menu message-menu-scroll">
                          <Link className="dropdown-item d-flex" to="#">
                            <span
                              className="avatar avatar-md brround me-3 align-self-center cover-image"
                              data-bs-image-src="../assets/images/users/1.jpg"
                            />
                            <div className="wd-90p">
                              <div className="d-flex">
                                <h5 className="mb-1">Peter Theil</h5>
                                <small className="text-muted ms-auto text-end">
                                  6:45 am
                                </small>
                              </div>
                              <span>Commented on file Guest list....</span>
                            </div>
                          </Link>
                          <Link className="dropdown-item d-flex" to="#">
                            <span
                              className="avatar avatar-md brround me-3 align-self-center cover-image"
                              data-bs-image-src="../assets/images/users/15.jpg"
                            />
                            <div className="wd-90p">
                              <div className="d-flex">
                                <h5 className="mb-1">Abagael Luth</h5>
                                <small className="text-muted ms-auto text-end">
                                  10:35 am
                                </small>
                              </div>
                              <span>New Meetup Started......</span>
                            </div>
                          </Link>
                          <Link className="dropdown-item d-flex" to="#">
                            <span
                              className="avatar avatar-md brround me-3 align-self-center cover-image"
                              data-bs-image-src="../assets/images/users/12.jpg"
                            />
                            <div className="wd-90p">
                              <div className="d-flex">
                                <h5 className="mb-1">Brizid Dawson</h5>
                                <small className="text-muted ms-auto text-end">
                                  2:17 pm
                                </small>
                              </div>
                              <span>Brizid is in the Warehouse...</span>
                            </div>
                          </Link>
                          <Link className="dropdown-item d-flex" to="#">
                            <span
                              className="avatar avatar-md brround me-3 align-self-center cover-image"
                              data-bs-image-src="../assets/images/users/4.jpg"
                            />
                            <div className="wd-90p">
                              <div className="d-flex">
                                <h5 className="mb-1">Shannon Shaw</h5>
                                <small className="text-muted ms-auto text-end">
                                  7:55 pm
                                </small>
                              </div>
                              <span>New Product Realease......</span>
                            </div>
                          </Link>
                          <Link className="dropdown-item d-flex" to="#">
                            <span
                              className="avatar avatar-md brround me-3 align-self-center cover-image"
                              data-bs-image-src="../assets/images/users/3.jpg"
                            />
                            <div className="wd-90p">
                              <div className="d-flex">
                                <h5 className="mb-1">Cherry Blossom</h5>
                                <small className="text-muted ms-auto text-end">
                                  7:55 pm
                                </small>
                              </div>
                              <span>You have appointment on......</span>
                            </div>
                          </Link>
                        </div>
                        <div className="dropdown-divider m-0" />
                        <Link
                          to="#"
                          className="dropdown-item text-center p-3 text-muted"
                        >
                          See all Messages
                        </Link>
                      </div>
                    </div> */}
                    {/* <div className="dropdown d-flex header-settings">
                      <Link
                        to="#;"
                        className="nav-link icon"
                        data-bs-toggle="sidebar-right"
                        data-target=".sidebar-right"
                      >
                        <i className="fe fe-align-right" />
                      </Link>
                    </div> */}

                    <div ref={profileRef} className={`dropdown d-flex profile-1 ${showProfileModal ? 'show' : ''}`}>
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        className="nav-link leading-none d-flex"
                        onClick={toggleProfileModal}
                      >
                        <img
                          src="../assets/images/users/21.jpg"
                          alt="profile-user"
                          className="avatar  profile-user brround cover-image"
                        />
                      </Link>
                      {showProfileModal && (
                        <div style={{ position: "absolute", left: "-129px" }} className="dropdown-menu dropdown-menu-end dropdown-menu-arrow show">
                          <div className="drop-heading">
                            <div className="text-center">
                              <h5 className="text-dark mb-0 fs-14 fw-semibold">
                                Percy Kewshun
                              </h5>
                              <small className="text-muted">Senior Admin</small>
                            </div>
                          </div>
                          <div className="dropdown-divider m-0" />
                          <Link className="dropdown-item" to="profile.html">
                            <i className="dropdown-icon fe fe-user" /> Profile
                          </Link>
                          <Link className="dropdown-item" to="email-inbox.html">
                            <i className="dropdown-icon fe fe-mail" /> Inbox
                            <span className="badge bg-danger rounded-pill float-end">
                              5
                            </span>
                          </Link>
                          <Link className="dropdown-item" to="lockscreen.html">
                            <i className="dropdown-icon fe fe-lock" /> Lockscreen
                          </Link>
                          <Link className="dropdown-item" to="login.html">
                            <i className="dropdown-icon fe fe-alert-circle" />{" "}
                            Sign out
                          </Link>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
              {/* <div className="demo-icon nav-link icon">
                <i className="fe fe-settings fa-spin  text_primary" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  
  );
}

export default Myheader;
