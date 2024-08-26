import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Badge, Avatar } from 'antd';
import { FiBell, FiAlignLeft, FiBook, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import Logo from "../assets/dbi.png";
import Headermenu from '../components/headermenu'
import HeaderMenu from "../components/headermenu";


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
  const notificationMenu = (
      <div className="absolute -right-27 mt-7 flex h-90 w-75 flex-col rounded bg-white shadow sm:right-0 sm:w-80">
      <div className="px-4 py-3">
        <h5 className="font-medium">Notification</h5>
      </div>
        <ul className="flex max-h-80 flex-col custom-scroll overflow-y-auto">
          {/* Start: Notification item 1 */}
          <li>
            <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
            >
              <p className="text-sm">
                <span className="text-black dark:text-white">
                  Edit your information in a swipe
                </span>{" "}
                Sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim.
              </p>

              <p className="text-xs">12 May, 2025</p>
            </Link>
          </li>
          {/* End: Notification item 1 */}

          {/* Start: Notification item 2 */}
          <li>
            <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
            >
              <p className="text-sm">
                <span className="text-black dark:text-white">
                  It is a long established fact
                </span>{" "}
                that a reader will be distracted by the readable.
              </p>

              <p className="text-xs">24 Feb, 2025</p>
            </Link>
          </li>
          {/* End: Notification item 2 */}

          {/* Start: Notification item 3 */}
          <li>
            <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
            >
              <p className="text-sm">
                <span className="text-black dark:text-white">
                  There are many variations
                </span>{" "}
                of passages of Lorem Ipsum available, but the majority have
                suffered
              </p>

              <p className="text-xs">04 Jan, 2025</p>
            </Link>
          </li>
          {/* End: Notification item 3 */}

          {/* Start: Notification item 4 */}
          <li>
            <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
            >
              <p className="text-sm">
                <span className="text-black dark:text-white">
                  There are many variations
                </span>{" "}
                of passages of Lorem Ipsum available, but the majority have
                suffered
              </p>

              <p className="text-xs">01 Dec, 2024</p>
            </Link>
          </li>
          {/* End: Notification item 4 */}

          {/* Start: Notification item 5 */}
          <li>
            <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
            >
              <p className="text-sm">
                <span className="text-black dark:text-white">
                  There are many variations
                </span>{" "}
                of passages of Lorem Ipsum available, but the majority have
                suffered
              </p>

              <p className="text-xs">01 Dec, 2024</p>
            </Link>
          </li>
          {/* End: Notification item 5 */}

          {/* Start: Notification item 6 */}
          <li>
            <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
            >
              <p className="text-sm">
                <span className="text-black dark:text-white">
                  There are many variations
                </span>{" "}
                of passages of Lorem Ipsum available, but the majority have
                suffered
              </p>

              <p className="text-xs">01 Dec, 2024</p>
            </Link>
          </li>
          {/* End: Notification item 6 */}
        </ul>

      </div>
  );
  // ===== User Dropdown Items Start =====
  const userDropdown = [
    {
      to: "#",
      icon: <FiUser />,
      label: "My Profile",
    },
    {
      to: "#",
      icon: <FiBook />,
      label: "My Contacts",
    },
    {
      to: "#",
      icon: <FiSettings />,
      label: "Account Settings",
    },
    {
      to: "#",
      icon: <FiLogOut />,
      label: "Logout",
    },
  ];
// ===== User Dropdown Items End =====

  const profileMenu = (
      <Menu>
        {/* ===== User Info Start ===== */}
        <div className="py-2 px-4 border-b">
          <h5 className="font-medium">Percy Kewshun</h5>
          <span className="block text-xs">Senior Front-end Engineer</span>
        </div>
        {/* ===== User Info End ===== */}
        {/* ===== Dropdown Items Start ===== */}
        <ul className="flex flex-col gap-5 p-4">
          {userDropdown.map((item) => (
              <li key={item.label} className="text-nowrap">
                <Link
                    to={item.to}
                    className="flex items-center gap-3 text-slate-700 duration-300 ease-in-out hover:text-primary"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
          ))}
        </ul>
        {/* ===== Dropdown Items End ===== */}

      </Menu>
  );



  return (
      <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-white drop-shadow dark:bg-boxdark dark:drop-shadow-none py-2 px-4">
        {/* Start of left section */}
        <div className="lg:w-11/12 flex items-center">
          {/* Start of mobile menu button */}
          <button className="block lg:hidden text-xl p-2">
            <FiAlignLeft className="text-white" />
          </button>
          {/* End of mobile menu button */}

          {/* Start of logo */}
          <Link className="hidden lg:block flex-shrink-0" to="/">
            <img src={Logo} alt="Logo" className="inline-block w-10" />
          </Link>
          {/* End of logo */}

          <Headermenu />
        </div>
        {/* End of left section */}

        {/* Start of right section */}
        <div className="flex items-center gap-6">
          <Dropdown
              ref={notificationRef}
              overlay={notificationMenu}
              trigger={['click']}
              visible={showNotificationModal}
          >

            <Link to="#" className="nav-link icon relative" onClick={toggleNotificationModal} >
                         <span className="absolute -top-1 right-0 z-1 h-2 w-2 rounded-full bg-red-600 inline">
                            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
                         </span>
              <FiBell />

            </Link>

          </Dropdown>
          <Dropdown ref={profileRef}
                    overlay={profileMenu}
                    trigger={['click']}
                    visible={showProfileModal}
          >
            <Link to="#" className="nav-link leading-none d-flex" onClick={toggleProfileModal}  >
              <Avatar src="../assets/images/users/21.jpg" />
            </Link>
          </Dropdown>
        </div>
        {/* End of right section */}






</header>
  );
}

export default Myheader;
