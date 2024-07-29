import React from 'react';

function Error403() {
    return (
        <div className="page-wrap"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#3498db',
                color: 'white',
                textAlign: 'center',
            }}
        >
            <div className="page-not-found">
                <img src="https://res.cloudinary.com/razeshzone/image/upload/v1588316204/house-key_yrqvxv.svg" className="img-key" alt="" />
                <h1 className="text-xl">
                    <span>4</span>
                    <span>0</span>
                    <span className="broken">3</span>
                </h1>
                <h4 className="text-md">Access Denied!</h4>
            </div>
        </div>
    );
}

export default Error403;
