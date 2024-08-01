import React, {useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Rightsidebar from '../rightsidebar';
import Footer from '../footer';
import Myheader from '../header';
import Headermenu from '../headermenu';
import { displayNames } from './Names';
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
const WorkFlowList = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    // const { bearerToken } = useParams();
    const [visible, setVisible] = useState(false);
    const [fields, setFields] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [formData, setFormData] = useState({
        wf_name: '',
        wf_related_to: null,
        wf_module_related_to: null,
        wf_module_related_to_product: null,
    });
    const [products, setproducts] = useState([]);
    // if (bearerToken) {
    //     sessionStorage.setItem("uid", bearerToken);
    //
    // }
    var Token = Cookies.get('accessToken');

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

    const getFields = async () => {
        const Token = Cookies.get('accessToken');
        // const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGFmZmlkIjoxLCJwaHBzZXJ2ZXIiOiJsb2NhbGhvc3QiLCJpYXQiOjE3MTk0MDcyODF9.Uwe2jSC0o5zmGYEduPWvUDUGNiYkdYSFImgcdvk_KyY';
        const getFieldsUrl = `${apiUrl}/api/worflow_rule/get_fields`;
        const result = await fetch(getFieldsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`,
            },
            body: JSON.stringify({
                "modules": selectedModule
            }),
        });
        const resultData = await result.json();
        setFields(resultData.workflow_data);
    };

    useEffect(() => {
        getworkflo();
    }, []);

    const getworkflo = async () => {
        const Token = Cookies.get('accessToken');
        // const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGFmZmlkIjoxLCJwaHBzZXJ2ZXIiOiJsb2NhbGhvc3QiLCJpYXQiOjE3MTk0MDcyODF9.Uwe2jSC0o5zmGYEduPWvUDUGNiYkdYSFImgcdvk_KyY';
        const getFieldsUrl = `${apiUrl}/api/worflow_rule/getworkflowlist`;
        const result = await fetch(getFieldsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`,
            },
        });
        const resultData = await result.json();
        setproducts(resultData.workflow_data);
    };




    const saveworkflow = async ($workflow_data) => {
        const Token = Cookies.get('accessToken');
        // const apiKey = process.env.REACT_APP_MY_API_KEY;
        // const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGFmZmlkIjoxLCJwaHBzZXJ2ZXIiOiJsb2NhbGhvc3QiLCJpYXQiOjE3MTk0MDcyODF9.Uwe2jSC0o5zmGYEduPWvUDUGNiYkdYSFImgcdvk_KyY';
        const getFieldsUrl = `${apiUrl}/api/worflow_rule/savewrokflow`;
        const result = await fetch(getFieldsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`,
            },
            body: JSON.stringify({
                "data": $workflow_data
            }),
        });
        const resultData = await result.json();
        getworkflo();
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <div>
                <Link to={`/workflow/${rowData.wf_id}`}>
                    <i className="fe fe-eye"></i>
                </Link>
                <Link to="#" style={{ marginLeft: 20 }}>
                    <i className="fe fe-trash" style={{ color: 'red' }}></i>
                </Link>
            </div>
        );
    };
    const getmoduletemplate = (rowData) => {
        return (
            displayNames[rowData.wf_related_to]
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDropdownChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: e.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setVisible(false);
        saveworkflow(formData);
    };

    return (
        <div>
            <Helmet>
                <title>DBI360 Workflow</title>
            </Helmet>
            <div className="page">
                <div className="page-main">
                    <div className="main-head position-fixed w-100" style={{ zIndex: 999 }}>
                        <Myheader />
                        <Headermenu />
                    </div>
                    <div className="main-content hor-content mt-0">
                        <div className="side-app">
                            <div className="main-container container-fluid" style={{ marginTop: "18.5vh" }}>
                                <div className="page-header my-0">
                                    <div>
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link to="/">Workflow List</Link></li>
                                        </ol>
                                    </div>
                                </div>
                                <>
                                    <div className="row mb-5">
                                        <div className="col-md-12">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div class="col-md-12 d-flex justify-content-end">
                                                            <Button className="btn btn-sm btn-primary ms-3 p-button p-component" label="Add New" icon="fe fe-plus-circle" onClick={() => setVisible(true)} />
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="content-details workstation-type">
                                                                <div className="card">
                                                                    <DataTable value={products} paginator rows={25} rowsPerPageOptions={[25, 50, 100, 150]} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                                                        <Column field="wf_name" header="Workflow Name"  />
                                                                        <Column field="wf_related_project" header="Product"  />
                                                                        <Column header="Related to"  body={getmoduletemplate} />
                                                                        <Column field="wf_module_reated_to" header="Trigger On"  />
                                                                        <Column field="alias_name" header="Created By"  />
                                                                        <Column field="wf_date_creaed" header="Created On"  />
                                                                        <Column field="quantity" header="Action" body={codeBodyTemplate}  />
                                                                    </DataTable>
                                                                </div>

                                                            </div>
                                                            <Dialog
                                                                header="Add New Workflow"
                                                                visible={visible}
                                                                style={{ width: '50vw', maxWidth: '600px', margin: '0 auto' }}
                                                                onHide={() => setVisible(false)}
                                                            >
                                                                <form onSubmit={handleSubmit} className="dialog-form">
                                                                    <div className="p-field">
                                                                        <InputText
                                                                            id="wf_name"
                                                                            name="wf_name"
                                                                            value={formData.wf_name}
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            className="form-element"
                                                                            placeholder="Enter Workflow Name"
                                                                        />
                                                                    </div>
                                                                    <div className="p-field">
                                                                        <Dropdown
                                                                            id="wf_module_related_to_product"
                                                                            name="wf_module_related_to_product"
                                                                            value={formData.wf_module_related_to_product}
                                                                            options={zylerproducts}
                                                                            onChange={(e) => handleDropdownChange(e, 'wf_module_related_to_product')}
                                                                            placeholder="Select a product"
                                                                            required
                                                                            className="form-element"
                                                                        />
                                                                    </div>
                                                                    <div className="p-field">
                                                                        <Dropdown
                                                                            id="wf_related_to"
                                                                            name="wf_related_to"
                                                                            value={formData.wf_related_to}
                                                                            options={roles}
                                                                            onChange={(e) => handleDropdownChange(e, 'wf_related_to')}
                                                                            placeholder="Related to Modules"
                                                                            required
                                                                            className="form-element"
                                                                        />
                                                                    </div>
                                                                    <div className="p-field">
                                                                        <Dropdown
                                                                            id="wf_module_related_to"
                                                                            name="wf_module_related_to"
                                                                            value={formData.wf_module_related_to}
                                                                            options={departments}
                                                                            onChange={(e) => handleDropdownChange(e, 'wf_module_related_to')}
                                                                            placeholder="Select an event"
                                                                            required
                                                                            className="form-element"
                                                                        />
                                                                    </div>
                                                                    <Button className="btn btn-sm btn-primary ms-3 form-button p-component" icon="fe fe-save" label="Submit" type="submit" />
                                                                </form>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
                <Rightsidebar />
                <Footer />
            </div>
        </div>
    );
}
export default WorkFlowList;