// export const displayNames = {
//     'tblenquiries': 'enquery',
//     'tblenquiryitems': 'enquery itesm',
//     'tblenquiryitemstaxes': 'enquery taxes',
//     'tblenquirystatus':'enquery status',
//     'tblquotations': 'quotation',
//     'tblstaff': 'staff',
//     'tblquotationitems': 'Quotation Item',
// };

export const zyler_displayNames = {
    'tblenquiries': 'enquery',
    'tblenquiryitems': 'enquery itesm',
    'tblenquiryitemstaxes': 'enquery taxes',
    'tblenquirystatus':'enquery status',
    'tblquotations': 'quotation',
    'tblstaff': 'staff',
    'tblquotationitems': 'Quotation Item',
};

export const aster_displayNames = {
    'tbldesignations': 'designations',
    'tbloptions': 'options',
    'tblsessions':'sessions'
};
export const auth_displayNames = {
    'tblworkflow': 'workflow',
    'tblworkflow_rules': 'workflow_rules',
    'tbldepartments':'departments'
};

export const getDisplayNames = (product) => {
    let displayNames = {}; 
    switch (product) {
        case "test":
            displayNames = auth_displayNames;
            break;
        case "greenjeeva":
            displayNames = zyler_displayNames;
            break;
        case "asterdoc":
            displayNames = aster_displayNames;
            break;
        default:
            displayNames = {}; 
    }
    return displayNames;
}