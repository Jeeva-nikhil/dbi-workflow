import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { EyeOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Footer from '../footer';
import Myheader from '../header';
import { displayNames } from './Names';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const { Option } = Select;

const WorkFlowList = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [fields, setFields] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [formData, setFormData] = useState({
        wf_name: '',
        wf_related_to: null,
        wf_module_related_to: null,
        wf_module_related_to_product: null,
    });
    const [products, setProducts] = useState([]);
    const [form] = Form.useForm();

    const Token = sessionStorage.getItem("uid");
    console.log('Token', Token);

    if (Token == null) {
        navigate('/erorr_403');
    }

    const roles = [
        { label: 'Enquiry', value: 'tblenquiries' },
        { label: 'Enquiry items', value: 'tblenquiryitems' },
        { label: 'Quotation', value: 'tblquotations' },
    ];

    const departments = [
        { label: 'onsubmit', value: 'onsubmit' },
        { label: 'convert', value: 'convert items' }
    ];

    const zylerproducts = [
        { label: 'zyler', value: 'greenjeeva' },
        { label: 'zyler_test', value: 'zyler_test' }
    ];

    useEffect(() => {
        if (selectedModule) {
            getFields();
        }
    }, [selectedModule]);

    useEffect(() => {
        getWorkflow();
    }, []);

    const getFields = async () => {
        // ... (keep the existing getFields function)
    };

    const getWorkflow = async () => {
        const Token = sessionStorage.getItem("uid");
        const getFieldsUrl = `${apiUrl}/api/worflow_rule/getworkflowlist`;
        try {
            const response = await fetch(getFieldsUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`,
                },
            });

            // Check if response is okay and JSON content type
            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                const resultData = await response.json();
                setProducts(resultData.workflow_data);
            } else {
                const text = await response.text(); // Get response text for debugging
                console.error('Error fetching workflows:', text);
                message.error('Failed to fetch workflows.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            message.error('Error loading workflows.');
        }
    };

    const saveWorkflow = async (workflow_data) => {
        const Token = sessionStorage.getItem("uid");
        const saveWorkflowUrl = `${apiUrl}/api/worflow_rule/savewrokflow`;
        try {
            const response = await fetch(saveWorkflowUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`,
                },
                body: JSON.stringify({
                    "data": workflow_data
                }),
            });

            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                const resultData = await response.json();
                if (resultData.success) {
                    message.success('Workflow added successfully');
                    getWorkflow();
                } else {
                    message.error('Failed to add workflow');
                }
            } else {
                const text = await response.text(); // Get response text for debugging
                console.error('Error saving workflow:', text);
                message.error('Failed to add workflow.');
            }
        } catch (error) {
            console.error('Error saving workflow:', error);
            message.error('Error adding workflow.');
        }
    };

    const deleteWorkflow = async (id) => {
        const Token = sessionStorage.getItem("uid");
        const deleteUrl = `${apiUrl}/api/worflow_rule/deleteworkflow/${id}`;
        try {
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`,
                },
            });

            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                const resultData = await response.json();
                if (resultData.success) {
                    message.success('Workflow deleted successfully');
                    getWorkflow();
                } else {
                    message.error('Failed to delete workflow');
                }
            } else {
                const text = await response.text(); // Get response text for debugging
                console.error('Error deleting workflow:', text);
                message.error('Failed to delete workflow.');
            }
        } catch (error) {
            console.error('Error deleting workflow:', error);
            message.error('Error deleting workflow.');
        }
    };

    const handleSubmit = (values) => {
        console.log(values);
        setVisible(false);
        saveWorkflow(values);
    };

    const columns = [
        {
            title: 'Workflow Name',
            dataIndex: 'wf_name',
            key: 'wf_name',
        },
        {
            title: 'Product',
            dataIndex: 'wf_related_project',
            key: 'wf_related_project',
        },
        {
            title: 'Related to',
            dataIndex: 'wf_module_reated_to',
            key: 'wf_module_reated_to',
            render: (text) => displayNames[text],
        },
        {
            title: 'Trigger On',
            dataIndex: 'wf_module_reated_to',
            key: 'wf_module_reated_to',
        },
        {
            title: 'Created By',
            dataIndex: 'alias_name',
            key: 'alias_name',
        },
        {
            title: 'Created On',
            dataIndex: 'wf_date_creaed',
            key: 'wf_date_creaed',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Link to={`/zylerworkflowl/${record.wf_id}`}>
                        <EyeOutlined className="text-blue-500" />
                    </Link>
                    <DeleteOutlined
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteWorkflow(record.wf_id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Helmet>
                <title>DBI360 Workflow</title>
            </Helmet>
            <div className="flex flex-col min-h-screen">
                <Myheader />
                <div className="flex-grow p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Workflow List</h2>
                        <ol className="breadcrumb flex gap-2 text-sm">
                            <li className="breadcrumb-item">Workflow /</li>
                            <li className="breadcrumb-item text-blue-500">Workflow List</li>
                        </ol>
                    </div>
                    <main className="bg-white rounded shadow p-4">
                        <div className="mb-4 flex justify-end">
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => setVisible(true)}
                            >
                                Add New
                            </Button>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={products}
                            pagination={{
                                pageSize: 25,
                                pageSizeOptions: ['25', '50', '100', '150'],
                            }}
                            bordered
                            size="middle"
                            className="min-w-full"
                        />
                    </main>
                </div>
                <Footer />
            </div>

            <Modal
                title="Add New Workflow"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="wf_name"
                        label="Workflow Name"
                        rules={[{ required: true, message: 'Please enter workflow name' }]}
                    >
                        <Input placeholder="Enter Workflow Name" />
                    </Form.Item>
                    <Form.Item
                        name="wf_module_related_to_product"
                        label="Product"
                        rules={[{ required: true, message: 'Please select a product' }]}
                    >
                        <Select placeholder="Select a product">
                            {zylerproducts.map(product => (
                                <Option key={product.value} value={product.value}>{product.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="wf_related_to"
                        label="Related to Modules"
                        rules={[{ required: true, message: 'Please select related module' }]}
                    >
                        <Select placeholder="Related to Modules">
                            {roles.map(role => (
                                <Option key={role.value} value={role.value}>{role.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="wf_module_related_to"
                        label="Event"
                        rules={[{ required: true, message: 'Please select an event' }]}
                    >
                        <Select placeholder="Select an event">
                            {departments.map(dept => (
                                <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default WorkFlowList;
