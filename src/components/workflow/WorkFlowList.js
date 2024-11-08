import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Footer from "../footer";
import Myheader from "../header";
import {
  aster_displayNames,
  auth_displayNames,
  zyler_displayNames,
} from "./Names";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { debounce } from "lodash";

const { Option } = Select;

const WorkFlowList = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [fields, setFields] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [formData, setFormData] = useState({
    wf_name: "",
    wf_related_to: null,
    wf_module_related_to: null,
    wf_module_related_to_product: null,
  });
  // const[displayNames,setDisplaynames]=useState()
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();
  const [debouncedValidator, setDebouncedValidator] = useState(null);

  const Token = Cookies.get("accessToken");

  if (Token == null) {
    navigate("/erorr_403");
  }

  // const roles = [
  //     { label: 'Workflow', value: 'tblworkflow' },
  //     { label: 'Enquiry items', value: 'tblenquiryitems' },
  //     { label: 'Quotation', value: 'tblquotations' },
  // ];
  const roles =
    typeof selectedModule === "object" && selectedModule !== null
      ? Object.entries(selectedModule).map(([value, label]) => ({
          label: label,
          value: value,
        }))
      : [];

  const departments = [
    { label: "onsubmit", value: "onsubmit" },
    { label: "convert", value: "convert items" },
  ];

  const zylerproducts = [
    { label: "authserver", value: "test" },
    { label: "zyler_test", value: "greenjeeva" },
    { label: "aster", value: "asterdoc" },
  ];

  const onChangeProduct = (value) => {
    switch (value) {
      case "test":
        setSelectedModule(auth_displayNames);
        break;
      case "greenjeeva":
        setSelectedModule(zyler_displayNames);
        break;
      case "asterdoc":
        setSelectedModule(aster_displayNames);
        break;
      default:
        setSelectedModule("");
    }
  };

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
    const Token = Cookies.get("accessToken");
    const getFieldsUrl = `${apiUrl}/api/v1/workflow-rule/getworkflowlist/`;
    try {
      const response = await fetch(getFieldsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          "X-Database-Id": process.env.REACT_APP_WORKFLOW_HEADER,
        },
      });

      // Check if response is okay and JSON content type
      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const resultData = await response.json();
        setProducts(resultData.workflow_data);
      } else {
        const text = await response.text(); // Get response text for debugging
        console.error("Error fetching workflows:", text);
        message.error("Failed to fetch workflows.");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      message.error("Error loading workflows.");
    }
  };

  const saveWorkflow = async (workflow_data) => {
    const Token = Cookies.get("accessToken");
    const saveWorkflowUrl = `${apiUrl}/api/v1/workflow-rule/saveworkflow/`;
    try {
      const response = await fetch(saveWorkflowUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          "X-Database-Id": process.env.REACT_APP_WORKFLOW_HEADER,
        },
        body: JSON.stringify(workflow_data),
      });

      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const resultData = await response.json();
        if (resultData.success) {
          message.success("Workflow added successfully");
          getWorkflow();
        } else {
          message.error("Failed to add workflow");
        }
      } else {
        const text = await response.text(); // Get response text for debugging
        console.error("Error saving workflow:", text);
        message.error("Failed to add workflow.");
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      message.error("Error adding workflow.");
    }
  };

  useEffect(() => {
    // Create a debounced version of the validator
    const debouncedFunction = debounce(async (value, callback) => {
      if (!value) {
        return callback();
      }
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/workflow-rule/checkworkflowname/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
              "X-Database-Id": process.env.REACT_APP_WORKFLOW_HEADER,
            },
            body: JSON.stringify({ wf_name: value }),
          }
        );

        const data = await response.json();

        if (data.success) {
          callback(); // Workflow name doesn't exist, validation passes
        } else {
          callback(new Error("This workflow name already exists.")); // Workflow name exists, validation fails
        }
      } catch (error) {
        callback(new Error("Error checking workflow name.")); // Handle error in form validation
      }
    }, 1000);

    setDebouncedValidator(() => debouncedFunction);

    // Clean up debounce function on component unmount
    return () => {
      debouncedFunction.cancel();
    };
  }, []);

  const deleteWorkflow = async (id) => {
    const Token = Cookies.get("accessToken");
    const deleteUrl = `${apiUrl}/api/v1/workflow-rule/deleteworkflow/${id}/`;
    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          "X-Database-Id": process.env.REACT_APP_WORKFLOW_HEADER,
        },
      });

      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const resultData = await response.json();
        if (resultData.success) {
          message.success("Workflow deleted successfully");
          getWorkflow();
        } else {
          message.error("Failed to delete workflow");
        }
      } else {
        const text = await response.text(); // Get response text for debugging
        console.error("Error deleting workflow:", text);
        message.error("Failed to delete workflow.");
      }
    } catch (error) {
      console.error("Error deleting workflow:", error);
      message.error("Error deleting workflow.");
    }
  };

  const handleSubmit = (values) => {
    console.log(values);
    setVisible(false);
    saveWorkflow(values);
  };

  const columns = [
    {
      title: "Workflow Name",
      dataIndex: "wf_name",
      key: "wf_name",
    },
    {
      title: "Product",
      dataIndex: "wf_related_project",
      key: "wf_related_project",
    },
    {
      title: "Related to",
      dataIndex: "wf_related_to",
      key: "wf_related_to",
      render: (text, record) => {
        let displayName = "";

        switch (record.wf_related_project) {
          case "test":
            displayName = auth_displayNames[text];
            break;
          case "greenjeeva":
            displayName = zyler_displayNames[text];
            break;
          case "asterdoc":
            displayName = aster_displayNames[text];
            break;
          default:
            displayName = "Unknown";
        }

        return displayName;
      },
    },
    {
      title: "Trigger On",
      dataIndex: "wf_module_reated_to",
      key: "wf_module_reated_to",
    },
    {
      title: "Created By",
      dataIndex: "alias_name",
      key: "alias_name",
    },
    {
      title: "Created On",
      dataIndex: "wf_date_creaed",
      key: "wf_date_creaed",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Link to={`/workflow/${record.wf_id}`}>
            <EyeOutlined className="text-blue-500" />
          </Link>
          {/* <DeleteOutlined
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteWorkflow(record.wf_id)}
                    /> */}
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
                pageSizeOptions: ["25", "50", "100", "150"],
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
            rules={[
              { required: true, message: "Please enter workflow name" },
              {
                validator: (_, value) => {
                  // Use the debounced validator
                  return new Promise((resolve, reject) => {
                    if (debouncedValidator) {
                      debouncedValidator(value, (error) => {
                        if (error) {
                          reject(error);
                        } else {
                          resolve();
                        }
                      });
                    } else {
                      resolve();
                    }
                  });
                },
              },
            ]}
          >
            <Input placeholder="Enter Workflow Name" />
          </Form.Item>
          <Form.Item
            name="wf_module_related_to_product"
            label="Product"
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select placeholder="Select a product" onChange={onChangeProduct}>
              {zylerproducts.map((product) => (
                <Option key={product.value} value={product.value}>
                  {product.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="wf_related_to"
            label="Related to Modules"
            rules={[
              { required: true, message: "Please select related module" },
            ]}
          >
            <Select placeholder="Related to Modules">
              {roles.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="wf_module_related_to"
            label="Event"
            rules={[{ required: true, message: "Please select an event" }]}
          >
            <Select placeholder="Select an event">
              {departments.map((dept) => (
                <Option key={dept.value} value={dept.value}>
                  {dept.label}
                </Option>
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
};

export default WorkFlowList;
