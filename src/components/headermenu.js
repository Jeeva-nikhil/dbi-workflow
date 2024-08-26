import React, { useState } from "react";
import {  MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
    {
        label: 'Workflow',
        key: 'mail',
        icon: <MailOutlined />,
    },
    {
        label: 'Workflow Configuration',
        key: 'app',
        icon: <SettingOutlined />,

    }
];
const Headermenu = () => {
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

  return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className="w-full" />
    );
}

export default Headermenu;
