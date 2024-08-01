import React, {useCallback, useEffect, useState, useRef} from 'react';
import { json, Link, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { Button, Form } from 'react-bootstrap';
import { displayNames } from './Names';
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

const nodeTypes = {
    diamond: CustomeDiamondNode,
};
const WorkFlow = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { id } = useParams();
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [product, setproduct] = useState('');
    const [modules, setModules] = useState([]);
    const [fields, setFields] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [ruledata, setRuledata] = useState([]);
    const [showCondition, setShowCondition] = useState(false);
    const [actionnode, setactionnode] = useState(false);
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
                const Token = Cookies.get('accessToken');
                const response = await fetch(`${apiUrl}/api/worflow_rule/getworkflowrules`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
            const Token = Cookies.get('accessToken');
            const response = await fetch(`${apiUrl}/api/worflow_rule/saveworkflowrules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
                const Token = Cookies.get('accessToken');
                const response = await fetch(`${apiUrl}/api/worflow_rule/get_modules`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
                const Token = Cookies.get('accessToken');
                const response = await fetch(`${apiUrl}/api/worflow_rule/get_product`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ "wf_id": id })
                });

                const resultData = await response.json();
                // console.log(resultData.workflow_data[0].wf_related_project);
                setproduct(resultData.workflow_data[0].wf_related_project)
                // setModules(resultData.workflow_data);
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
                    const Token = Cookies.get('accessToken');
                    const response = await fetch(`${apiUrl}/api/worflow_rule/get_fields`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
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
                    setactionnode(true);
                    break;
                case 'end':
                    label = 'End';
                    break;
                default:
                    label = '';
                    setactionnode(false);
            }
            newFormData.label = label;
            setNodes(nds => nds.map(node => (node.id === selectedNode ? { ...node, data: { label } } : node)));
        }

        setFormData(newFormData);
        if (['table', 'table', 'updatemodules', 'updatemodules2'].includes(name)) {
            setSelectedModule(value);
        }
    }, [formData, selectedNode]);

    const handleFormSubmit = useCallback(e => {
        console.log(formData);
        e.preventDefault();
        let conditionlabel = `${formData.field} value between ${formData.minvalue}${formData.maxvalue > 0 ? ' to ' + formData.maxvalue : ''}`;
        const label = showCondition ? conditionlabel : formData.state;
        console.log(formData);
        if(showCondition ){
            if(formData.label !== 'start' && formData.label !== 'end' && formData.label !== 'action'){
                formData.label = 'condition';
                formData.state = 'condition';
            }
        }
        console.log(formData);
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
    }, [formData, selectedNode, showCondition]);

    useEffect(() => {
        if (ruledata.length > 0) {
            saveWorkflowRules();
        }
    }, [ruledata, saveWorkflowRules]);

    const handleNodeClick = useCallback((_, node) => {
        setSelectedNode(node.id);
        setFormVisible(true);
        setShowCondition(node.type === 'diamond');
        setFormData(getNodeValueById(node.id) || {});
        setSelectedModule(getNodeValueById(node.id)?.table1 || null);
    }, [ruledata]);

    const getNodeValueById = useCallback(id => ruledata.find(node => node[id])?.[id] || null, [ruledata]);

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

    return (
        <div>
            <Helmet>
                <title>Workflow</title>
            </Helmet>
            <div className="page">
                <div className="page-main">
                    <div className="main-content hor-content mt-0">
                        <Myheader />
                        <Headermenu />
                        <div className="side-app">
                            <div className="main-container container-fluid">
                                <div className="page-header my-0">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to={'/'}> Workflow </Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            View
                                        </li>
                                    </ol>
                                </div>
                                <div className="workflow-title " style={{ marginBottom: 10, textAlign: 'right' }}>
                                    <Button onClick={addNode} className="mt-2" style={{ marginRight: 10 }}>
                                        {nodes.length > 0 ? ('Add a step') : ('Start')}
                                    </Button>
                                    <Button onClick={addDiamondNode} className="mt-2" style={{ marginRight: 10 }}>
                                        Add a conditional step
                                    </Button>
                                    <Button onClick={deleteNode} className="mt-2" style={{ marginRight: 10 }}>
                                        Delete a step
                                    </Button>
                                    <Button onClick={deleteEdge} className="mt-2" style={{ marginRight: 10 }}>
                                        Delete Connection
                                    </Button>
                                    <Button onClick={undo} className="mt-2" style={{ marginRight: 10 }}>
                                        Undo
                                    </Button>
                                    <Button onClick={redo} className="mt-2">
                                        Redo
                                    </Button>
                                </div>
                                <div className="row mb-5">
                                    <div className="col-md-3">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                {formVisible && (
                                                    <div className="workflow-details">
                                                        <div className="workflow-title text-center">
                                                            <h5 className="card-title">Define Rules for selected step</h5>
                                                        </div>
                                                        <Form onSubmit={handleFormSubmit} className="mt-3">
                                                            <Form.Group>
                                                                <Form.Label>State</Form.Label>
                                                                <Form.Control
                                                                    as="select"
                                                                    name="state"
                                                                    value={showCondition ? 'conditioncheck' : formData.state || ''}
                                                                    onChange={handleFormChange}
                                                                >
                                                                    {showCondition ? (
                                                                        <option value="conditioncheck">Condition check</option>
                                                                    ) : (
                                                                        <>
                                                                            <option value="">Select State</option>
                                                                            <option value="start">Start</option>
                                                                            <option value="action">Action</option>
                                                                            <option value="end">End</option>
                                                                        </>
                                                                    )}
                                                                </Form.Control>
                                                            </Form.Group>

                                                            {formData.state === 'action' && (
                                                                <>
                                                                    <Form.Group>
                                                                        <Form.Label>Choose modules</Form.Label>
                                                                        <Form.Control
                                                                            as="select"
                                                                            name="updatemodules"
                                                                            value={formData.updatemodules || ''}
                                                                            onChange={handleFormChange}
                                                                        >
                                                                            <option value="">Select modules</option>
                                                                            {modules.map((table, index) => (
                                                                                displayNames[table.TABLE_NAME] ? (
                                                                                    <option key={index} value={table.TABLE_NAME}>
                                                                                        {displayNames[table.TABLE_NAME]}
                                                                                    </option>
                                                                                ) : null
                                                                            ))}
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                    <Form.Group>
                                                                        <Form.Label>Choose Field</Form.Label>
                                                                        <Form.Control
                                                                            as="select"
                                                                            name="updatefiled"
                                                                            value={formData.updatefiled || ''}
                                                                            onChange={handleFormChange}
                                                                        >
                                                                            <option value="">Update Field</option>
                                                                            {fields.map((field, index) => (
                                                                                <option key={index} value={field.COLUMN_NAME}>
                                                                                    {field.COLUMN_NAME}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                    <Form.Group>
                                                                        <Form.Label>Update Value</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="value"
                                                                            value={formData.value || ''}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                    </Form.Group>
                                                                </>
                                                            )}
                                                            {showCondition && (
                                                                <div className="card">
                                                                    <Form.Group>
                                                                        <Form.Label>Choose modules</Form.Label>
                                                                        <Form.Control
                                                                            as="select"
                                                                            name="table"
                                                                            value={formData.table || ''}
                                                                            onChange={handleFormChange}
                                                                        >
                                                                            <option value="">Select modules</option>
                                                                            {modules.map((table, index) => (
                                                                                displayNames[table.TABLE_NAME] ? (
                                                                                    <option key={index} value={table.TABLE_NAME}>
                                                                                        {displayNames[table.TABLE_NAME]}
                                                                                    </option>
                                                                                ) : null
                                                                            ))}
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                    <Form.Group>
                                                                        <Form.Label>Choose field</Form.Label>
                                                                        <Form.Control
                                                                            as="select"
                                                                            name="field"
                                                                            value={formData.field || ''}
                                                                            onChange={handleFormChange}
                                                                        >
                                                                            <option value="">Select field</option>
                                                                            {fields.map((field, index) => (
                                                                                <option key={index} value={field.COLUMN_NAME}>
                                                                                    {field.COLUMN_NAME}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                    <Form.Group>
                                                                        <Form.Label>Minimum Value</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="minvalue"
                                                                            value={formData.minvalue || ''}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group>
                                                                        <Form.Label>Maximum Value</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="maxvalue"
                                                                            value={formData.maxvalue || ''}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                    </Form.Group>
                                                                </div>
                                                            )}
                                                            {actionnode && (
                                                                <Form.Group>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        label="Add Next Action"
                                                                        name="opennextaction"
                                                                        checked={formData.opennextaction || false}
                                                                        onChange={handleFormChange}
                                                                    />
                                                                </Form.Group>)}

                                                             {formData.opennextaction && (
                                                                <>
                                                                    <Form.Group>
                                                                        <Form.Label>Next Action</Form.Label>
                                                                        <Form.Control
                                                                            as="select"
                                                                            name="nextAction"
                                                                            value={formData.nextAction || ''}
                                                                            onChange={handleFormChange}
                                                                        >
                                                                            <option value="">Select State</option>
                                                                            <option value="approval_sent_stage">Add Approval stage</option>
                                                                            <option value="send_email_stage">Add Communication Email</option>
                                                                        </Form.Control>
                                                                    </Form.Group>
                                                                    <Form.Group>
                                                                        <Form.Label>Approval send to</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="sendto"
                                                                            value={formData.sendto || ''}
                                                                            onChange={handleFormChange}
                                                                        />
                                                                    </Form.Group>
                                                                </>
                                                             )}
                                                            <div className="workflow-title text-center">
                                                                <Button type="submit" className="mt-2" style={{ width: '100%' }}>
                                                                    Save
                                                                </Button>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="card h-100">
                                            <div className="card-body">
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <a href="#top" id="back-to-top">
                <i className="fa fa-angle-up" />
            </a>
        </div>
    );
}
export default WorkFlow;