import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const diamondStyle = {
    width: '275px',
    height: '40px',
    background: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #000',
    borderRadius: '2px',
};

const labelStyle = {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    justifyContent: 'center',
    alignItems: 'center',

};

const CustomeDiamondNode = ({ data, isConnectable }) => {
    return (
        <div style={diamondStyle}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} id="a" />
            <Handle type="source" position={Position.Left} isConnectable={isConnectable} id="c"  />
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} id="d" />
            <div style={labelStyle}> {data.label}
                {data.source === 'c' && <span> yes</span>}
                {data.source === 'd' && <span> no</span>}
            </div>
        </div>
    );
};

export default CustomeDiamondNode;
