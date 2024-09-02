import React from 'react';
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
const WorkflowConfiguration = () => {
return(
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
                                            <li className="breadcrumb-item"><Link to="/">Workflow Configuration</Link></li>
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
                                                           
                                                        </div>
                                                        <div className="col-12">
                                                            <>Workflow Configuration</>
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
export default WorkflowConfiguration;