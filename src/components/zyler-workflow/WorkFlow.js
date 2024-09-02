import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { Button, Form, Input, Select, Checkbox, Row, Col, Card } from 'antd';
import { displayNames } from './Names';
import Footer from '../footer';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
} from 'react-flow-renderer';
import Myheader from '../header';
import Headermenu from '../headermenu';
import CustomeDiamondNode from './CustomeDiamondNode';
import Cookies from "js-cookie";

const { Option } = Select;

const nodeTypes = {
    diamond: CustomeDiamondNode,
};

const WorkFlow = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { id } = useParams();
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({ maxvalue: '' });
    const [product, setProduct] = useState('');
    const [modules, setModules] = useState([]);
    const [fields, setFields] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [ruledata, setRuledata] = useState([]);
    const [showCondition, setShowCondition] = useState(false);
    const [actionNode, setActionNode] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const undoStack = useRef([]);
    const redoStack = useRef([]);

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => {
            const updatedNodes = applyNodeChanges(changes, nds);
            undoStack.current.push({ nodes: nds, edges });
            return updatedNodes;
        });
    }, [edges]);

    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => {
            const updatedEdges = applyEdgeChanges(changes, eds);
            undoStack.current.push({ nodes, edges: eds });
            return updatedEdges;
        });
    }, [nodes]);

    const onConnect = useCallback((params) => {
        const newEdge = {
            ...params,
            label: params.sourceHandle === 'c' ? 'no' : 'yes',
            markerEnd: { type: 'arrowclosed' },
        };
        setEdges((eds) => {
            undoStack.current.push({ nodes, edges: eds });
            return addEdge(newEdge, eds);
        });
    }, [nodes]);

    const onConnectEnd = useCallback((event, params) => {
        if (params?.source) {
            setNodes((nds) => nds.filter((node) => node.id !== params.source));
            setEdges((eds) => eds.filter((edge) => edge.source !== params.source && edge.target !== params.source));
        }
    }, []);

    const addNode = useCallback(() => {
        setShowCondition(false);
        setNodes((nds) => {
            const newNode = {
                id: `${nds.length + 1}`,
                data: { label: 'No Label' },
                position: { x: Math.random() * 400, y: Math.random() * 400 },
            };
            const newNodes = [...nds, newNode];

            if (selectedNode) {
                const newEdge = {
                    id: `e${selectedNode}-${newNode.id}`,
                    source: `${selectedNode}`,
                    target: `${newNode.id}`,
                };
                setEdges((eds) => {
                    undoStack.current.push({ nodes: newNodes, edges: eds });
                    return [...eds, newEdge];
                });
            } else {
                undoStack.current.push({ nodes: nds, edges });
            }

            return newNodes;
        });
    }, [selectedNode, edges]);

    const addDiamondNode = useCallback(() => {
        setShowCondition(false);
        setNodes((nds) => {
            const newNode = {
                id: `${nds.length + 1}`,
                type: 'diamond',
                data: { label: 'Condition' },
                position: { x: Math.random() * 400, y: Math.random() * 400 },
            };
            const newNodes = [...nds, newNode];

            if (selectedNode) {
                const newEdge = {
                    id: `e${selectedNode}-${newNode.id}`,
                    source: `${selectedNode}`,
                    target: `${newNode.id}`,
                };
                setEdges((eds) => {
                    undoStack.current.push({ nodes: newNodes, edges: eds });
                    return [...eds, newEdge];
                });
            } else {
                undoStack.current.push({ nodes: nds, edges });
            }

            return newNodes;
        });
    }, [selectedNode, edges]);

    useEffect(() => {
        const fetchWorkflowRules = async () => {
            try {
                const Token = sessionStorage.getItem("uid");
                const response = await fetch(`${apiUrl}/api/worflow_rule/getworkflowrules`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`,
                    },
                    body: JSON.stringify({ "wf_id": id }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const resultData = await response.json();
                const { nodes, edges, rules } = resultData.workflow_data[0];
                setNodes(JSON.parse(nodes));
                setEdges(JSON.parse(edges));
                setRuledata(JSON.parse(rules));
            } catch (error) {
                console.error("Error fetching workflow rules:", error);
            }
        };

        fetchWorkflowRules();
    }, [id]);

    const saveWorkflowRules = useCallback(async () => {
        try {
            const Token = sessionStorage.getItem("uid");
            const response = await fetch(`${apiUrl}/api/worflow_rule/saveworkflowrules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`,
                },
                body: JSON.stringify({ "wf_id": id, "nodes": JSON.stringify(nodes), "edges": JSON.stringify(edges), "rules": JSON.stringify(ruledata) }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await response.json();
        } catch (error) {
            console.error("Error saving workflow rules:", error);
        }
    }, [nodes, edges, ruledata, id]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const Token = sessionStorage.getItem("uid");
                const response = await fetch(`${apiUrl}/api/worflow_rule/get_modules`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`,
                    },
                    body: JSON.stringify({ "product": product })
                });

                const resultData = await response.json();
                setModules(resultData.workflow_data);
            } catch (error) {
                console.error("Error fetching modules:", error);
            }
        };

        fetchModules();
    }, [product]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const Token = sessionStorage.getItem("uid");
                const response = await fetch(`${apiUrl}/api/worflow_rule/get_product`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`,
                    },
                    body: JSON.stringify({ "wf_id": id })
                });

                const resultData = await response.json();
                setProduct(resultData.workflow_data[0].wf_related_project);
            } catch (error) {
                console.error("Error fetching modules:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchFields = async () => {
            if (selectedModule) {
                try {
                    const Token = sessionStorage.getItem("uid");
                    const response = await fetch(`${apiUrl}/api/worflow_rule/get_fields`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Token}`,
                        },
                        body: JSON.stringify({ "modules": selectedModule }),
                    });

                    const resultData = await response.json();
                    setFields(resultData.workflow_data);
                } catch (error) {
                    console.error("Error fetching fields:", error);
                }
            }
        };

        fetchFields();
    }, [selectedModule]);

    const handleFormChange = useCallback(e => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        const newFormData = { ...formData, [name]: newValue };

        console.log('newFormData', newFormData);


        let label = '';
        if (name === 'state') {
            switch (newValue) {
                case 'start':
                    label = 'Start';
                    break;
                case 'conditioncheck':
                    label = 'Condition';
                    break;
                case 'action':
                    label = 'Action';
                    setActionNode(true);
                    break;
                case 'end':
                    label = 'End';
                    break;
                default:
                    label = '';
                    setActionNode(false);
            }
            newFormData.label = label;
            setNodes(nds => nds.map(node => (node.id === selectedNode ? { ...node, data: { label } } : node)));
        }

        setFormData(newFormData);
        if (['table', 'table', 'updatemodules', 'updatemodules2'].includes(name)) {
            setSelectedModule(value);
        }
    }, [formData, selectedNode]);
    // const handleFormChange = useCallback(e => {
    //     const { name, value, type, checked } = e.target;
    //     const newValue = type === 'checkbox' ? checked : value;
    //     setFormData(prevData => ({
    //         ...prevData,
    //         [name]: newValue,
    //     }));
    // }, [formData, selectedNode]);


    const handleFormSubmit = useCallback(() => {
        let conditionLabel = `${formData.field} value between ${formData.minvalue}${formData.maxvalue > 0 ? ' to ' + formData.maxvalue : ''}`;
        const label = showCondition ? conditionLabel : formData.state;

        if (showCondition) {
            if (formData.label !== 'start' && formData.label !== 'end' && formData.label !== 'action') {
                formData.label = 'condition';
                formData.state = 'condition';
            }
        }

        setNodes(nds => nds.map(node => (node.id === selectedNode ? { ...node, data: { label } } : node)));

        const newEntry = { [selectedNode]: formData };

        setRuledata(prevData => {
            const existingEntryIndex = prevData.findIndex(entry => Object.keys(entry)[0] === selectedNode);
            const updatedData = [...prevData];

            if (existingEntryIndex !== -1) {
                updatedData[existingEntryIndex] = newEntry;
            } else {
                updatedData.push(newEntry);
            }
            return updatedData;
        });

        setShowCondition(false);
        setFormVisible(false);
        saveWorkflowRules();
    }, [formData, selectedNode, showCondition, saveWorkflowRules]);

    const handleNodeClick = useCallback((_, node) => {
        setSelectedNode(node.id);
        setFormVisible(true);
        setShowCondition(node.type === 'diamond');
        const nodeData = getNodeValueById(node.id);
        setFormData(nodeData || {});
        setSelectedModule(nodeData?.table || null);
    }, [ruledata]);

    const getNodeValueById = useCallback(id => ruledata.find(node => node[id])?.[id] || {}, [ruledata]);

    const deleteNode = useCallback(() => {
        if (selectedNode) {
            setNodes(nds => {
                undoStack.current.push({ nodes: nds, edges });
                return nds.filter(node => node.id !== selectedNode);
            });
            setEdges(eds => eds.filter(edge => edge.source !== selectedNode && edge.target !== selectedNode));
            setRuledata(prevData => prevData.filter(entry => !entry[selectedNode]));
            setSelectedNode(null);
            setShowCondition(false);
            setFormVisible(false);
        }
    }, [selectedNode, edges]);

    const deleteEdge = useCallback(() => {
        if (selectedEdge) {
            setEdges(eds => {
                undoStack.current.push({ nodes, edges: eds });
                return eds.filter(edge => edge.id !== selectedEdge.id);
            });
            setSelectedEdge(null);
        }
    }, [selectedEdge, nodes]);

    const onEdgeClick = useCallback((event, edge) => {
        setSelectedEdge(edge);
    }, []);

    const handlePaneClick = () => {
        setSelectedNode(null);
        setSelectedEdge(null);
        setFormVisible(false);
    };

    const undo = useCallback(() => {
        const lastState = undoStack.current.pop();
        if (lastState) {
            redoStack.current.push({ nodes, edges });
            setNodes(lastState.nodes);
            setEdges(lastState.edges);
        }
    }, [nodes, edges]);

    const redo = useCallback(() => {
        const lastState = redoStack.current.pop();
        if (lastState) {
            undoStack.current.push({ nodes, edges });
            setNodes(lastState.nodes);
            setEdges(lastState.edges);
        }
    }, [nodes, edges]);

    // console.log('fomdata', formData);

    useEffect(() => {
        console.log('Form Data Updated:', formData);
    }, [formData]);


    return (
        <div>
            <div className="min-h-screen bg-gray-100">
                <Helmet>
                    <title>DBI360 Workflow</title>
                </Helmet>
                <div className="flex flex-col min-h-screen">
                    <Myheader />
                    <div className="flex-grow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Workflow</h2>
                            <ol className="breadcrumb flex gap-2 text-sm">
                                <li className="breadcrumb-item">Workflow /</li>
                                <li className="breadcrumb-item text-blue-500">Workflow View</li>
                            </ol>
                        </div>
                        <main className="bg-white rounded shadow p-4">
                            <div className="workflow-title " style={{ marginBottom: 10, textAlign: 'right' }}>
                                <Button onClick={addNode} type="primary" style={{ marginRight: 10 }}>
                                    {nodes.length > 0 ? ('Add a step') : ('Start')}
                                </Button>
                                <Button onClick={addDiamondNode} type="primary" style={{ marginRight: 10 }}>
                                    Add a conditional step
                                </Button>
                                <Button onClick={deleteNode} type="primary" style={{ marginRight: 10 }}>
                                    Delete a step
                                </Button>
                                <Button onClick={deleteEdge} type="primary" style={{ marginRight: 10 }}>
                                    Delete Connection
                                </Button>
                                <Button onClick={undo} type="primary" style={{ marginRight: 10 }}>
                                    Undo
                                </Button>
                                <Button onClick={redo} type="primary">
                                    Redo
                                </Button>
                            </div>
                            <Row gutter={16} className="mb-5">
                                <Col xs={24} md={8}>
                                    <Card className="h-100">
                                        {formVisible && (
                                            <div className="workflow-details">
                                                <div className="workflow-title text-center">
                                                    <h5 className="card-title">Define Rules for selected step</h5>
                                                </div>
                                                <Form
                                                    // onFinish={handleFormSubmit}
                                                    // layout="vertical"
                                                    // className="mt-3"

                                                    initialValues={formData}  // Set initial form values
                                                    onFinish={handleFormSubmit}
                                                    layout="vertical"
                                                    className="mt-3"
                                                >
                                                    <Form.Item
                                                        label="State"
                                                        name="state"
                                                    >
                                                        <Select
                                                            value={showCondition ? 'conditioncheck' : formData.state || ''}
                                                            onChange={(value) =>
                                                                handleFormChange({
                                                                    target: { name: 'state', value },
                                                                })
                                                            }
                                                        >
                                                            {showCondition ? (
                                                                <Option value="conditioncheck">Condition check</Option>
                                                            ) : (
                                                                <>
                                                                    <Option value="start">Start</Option>
                                                                    <Option value="action">Action</Option>
                                                                    <Option value="end">End</Option>
                                                                </>
                                                            )}
                                                        </Select>
                                                    </Form.Item>

                                                    {formData.state === 'action' && (
                                                        <>
                                                            <Form.Item
                                                                label="Choose modules"
                                                                name="updatemodules"
                                                            >
                                                                <Select
                                                                    value={formData.updatemodules || ''}
                                                                    onChange={(value) =>
                                                                        handleFormChange({
                                                                            target: { name: 'updatemodules', value },
                                                                        })
                                                                    }
                                                                >
                                                                    <Option value="">Select modules</Option>
                                                                    {modules.map((table, index) => (
                                                                        displayNames[table.TABLE_NAME] ? (
                                                                            <Option key={index} value={table.TABLE_NAME}>
                                                                                {displayNames[table.TABLE_NAME]}
                                                                            </Option>
                                                                        ) : null
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="Choose Field"
                                                                name="updatefiled"
                                                            >
                                                                <Select
                                                                    value={formData.updatefiled || ''}
                                                                    onChange={(value) =>
                                                                        handleFormChange({
                                                                            target: { name: 'updatefiled', value },
                                                                        })
                                                                    }
                                                                >
                                                                    <Option value="">Update Field</Option>
                                                                    {fields.map((field, index) => (
                                                                        <Option key={index} value={field.COLUMN_NAME}>
                                                                            {field.COLUMN_NAME}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="Update Value"
                                                                name="value"
                                                            >
                                                                <Input
                                                                    value={formData.value || ''}
                                                                    onChange={(e) =>
                                                                        handleFormChange({
                                                                            target: { name: 'value', value: e.target.value },
                                                                        })
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </>
                                                    )}

                                                    {showCondition && (
                                                        <Card>
                                                            <Form.Item
                                                                label="Choose modules"
                                                                name="table"
                                                            >
                                                                <Select
                                                                    value={formData.table || ''}
                                                                    onChange={(value) =>
                                                                        handleFormChange({
                                                                            target: { name: 'table', value },
                                                                        })
                                                                    }
                                                                >
                                                                    <Option value="">Select modules</Option>
                                                                    {modules.map((table, index) => (
                                                                        displayNames[table.TABLE_NAME] ? (
                                                                            <Option key={index} value={table.TABLE_NAME}>
                                                                                {displayNames[table.TABLE_NAME]}
                                                                            </Option>
                                                                        ) : null
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="Choose field"
                                                                name="field"
                                                            >
                                                                <Select
                                                                    value={formData.field || ''}
                                                                    onChange={(value) =>
                                                                        handleFormChange({
                                                                            target: { name: 'field', value },
                                                                        })
                                                                    }
                                                                >
                                                                    <Option value="">Select field</Option>
                                                                    {fields.map((field, index) => (
                                                                        <Option key={index} value={field.COLUMN_NAME}>
                                                                            {field.COLUMN_NAME}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="Minimum Value"
                                                                name="minvalue"
                                                            >
                                                                <Input
                                                                    value={formData.minvalue || ''}
                                                                    onChange={(e) =>
                                                                        handleFormChange({
                                                                            target: { name: 'minvalue', value: e.target.value },
                                                                        })
                                                                    }
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="Maximum Value"
                                                                name="maxvalue"
                                                            >
                                                                <Input
                                                                    value={formData.maxvalue || ''}
                                                                    onChange={(e) =>
                                                                        handleFormChange({
                                                                            target: { name: 'maxvalue', value: e.target.value },
                                                                        })
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </Card>
                                                    )}

                                                    {actionNode && (
                                                        <Form.Item>
                                                            <Checkbox
                                                                name="opennextaction"
                                                                checked={formData.opennextaction || false}
                                                                onChange={(e) =>
                                                                    handleFormChange({
                                                                        target: {
                                                                            name: 'opennextaction',
                                                                            value: e.target.checked,
                                                                        },
                                                                    })
                                                                }
                                                            >
                                                                Add Next Action
                                                            </Checkbox>
                                                        </Form.Item>
                                                    )}

                                                    {formData.opennextaction && (
                                                        <>
                                                            <Form.Item
                                                                label="Next Action"
                                                                name="nextAction"
                                                            >
                                                                <Select
                                                                    value={formData.nextAction || ''}
                                                                    onChange={(value) =>
                                                                        handleFormChange({
                                                                            target: { name: 'nextAction', value },
                                                                        })
                                                                    }
                                                                >
                                                                    <Option value="">Select State</Option>
                                                                    <Option value="approval_sent_stage">Add Approval stage</Option>
                                                                    <Option value="send_email_stage">Add Communication Email</Option>
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="Approval send to"
                                                                name="sendto"
                                                            >
                                                                <Input
                                                                    value={formData.sendto || ''}
                                                                    onChange={(e) =>
                                                                        handleFormChange({
                                                                            target: { name: 'sendto', value: e.target.value },
                                                                        })
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </>
                                                    )}

                                                    <div className="workflow-title text-center">
                                                        <Button
                                                            type="primary"
                                                            htmlType="submit"
                                                            className="mt-2"
                                                            style={{ width: '100%' }}
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </div>
                                        )}
                                    </Card>
                                </Col>

                                <Col xs={24} md={16}>
                                    <Card className="h-100">
                                        <div className="workflow-editor">
                                            <div style={{ height: 600 }}>
                                                <ReactFlowProvider>
                                                    <ReactFlow
                                                        nodes={nodes}
                                                        edges={edges}
                                                        onNodesChange={onNodesChange}
                                                        onEdgesChange={onEdgesChange}
                                                        onConnect={onConnect}
                                                        nodeTypes={nodeTypes}
                                                        onNodeClick={handleNodeClick}
                                                        onEdgeClick={onEdgeClick}
                                                        onConnectEnd={onConnectEnd}
                                                        onPaneClick={handlePaneClick}
                                                    >
                                                        <Background variant="dots" gap={12} size={1} />
                                                        <Controls />
                                                    </ReactFlow>
                                                </ReactFlowProvider>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </main>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default WorkFlow;
