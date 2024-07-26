import React from 'react';
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

const nodeTypes = {
    diamond: CustomeDiamondNode,
};
const WorkFlow = () => {
    return(
        <>Workflow Page</>
    );
}
export default WorkFlow;