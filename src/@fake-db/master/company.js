// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const data = {
    company: [
        {
            id: 1,
            companyName: 'Unblock',
            legalName: "Unblock Technolabs",
            authorizePersonName: 'Vijay Bhayani',
            address: 'Mota Varachha, Surat',
            contactNo: '9033127636',
            email: 'info@unblocktechnolabs.com',
            website: "https://unblocktechnolabs.com/",
            PAN: '45346577689889',
            GSTIN: 'fgdfghfghgh',
            status: 'Active'
        },
        {
            id: 2,
            companyName: 'Vision',
            legalName: "Vision Infotech",
            authorizePersonName: 'Dhiren Vaghani',
            address: 'Sahara Darwaja, Surat',
            contactNo: ' 84016 52525',
            email: ' hr@visioninfotech.net',
            website: "https://visioninfotech.net/",
            PAN: '45346577689889',
            GSTIN: 'fgdfghfghgh',
            status: 'Active'
        },
        {
            id: 3,
            companyName: 'Knackroot',
            legalName: "Knackroot Technolabs",
            authorizePersonName: 'Prachi shah',
            address: 'Drive In Rd, Ahmedabad',
            contactNo: '9898777397',
            email: 'info@knackroot.com',
            website: "https://www.knackroot.com/",
            PAN: '45346577689889',
            GSTIN: 'fgdfghfghgh',
            status: 'Active'
        },
    ]
}

mock.onPost('/master/company/add-company').reply(config => {
    // Get event from post data
    const company = JSON.parse(config.data).data
    const { length } = data.company
    let lastIndex = 0
    if (length) {
        lastIndex = data.company[length - 1].id
    }
    company.id = lastIndex + 1
    data.company.unshift({ ...company })
    return [201, { company }]
})

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/master/company/data').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()
    const filteredData = data.company.filter(
        company =>
            company.companyName.toLowerCase().includes(queryLowered) ||
            company.legalName.toLowerCase().includes(queryLowered) ||
            company.authorizePersonName.toLowerCase().includes(queryLowered)
    )
    return [
        200,
        {
            allData: data.company,
            company: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onDelete('/master/company/delete').reply(config => {
    // Get user id from URL
    const companyId = config.data
    const companyIndex = data.company.findIndex(t => t.id === companyId)
    data.company.splice(companyIndex, 1)

    return [200]
})

mock.onPut('/master/company/update-company').reply(config => {
    // Get company data from request payload
    const updatedCompany = JSON.parse(config.data).data;
    // Find the index of the company to be updated based on its ID
    const companyIdToUpdate = updatedCompany.id;
    const indexToUpdate = data.company.findIndex(company => company.id === companyIdToUpdate);

    // If the company with the given ID is found, update its fields
    if (indexToUpdate !== -1) {
        data.company[indexToUpdate] = {
            ...data.company[indexToUpdate],
            companyName: updatedCompany.companyName,
            legalName: updatedCompany.legalName,
            authorizedPersonName: updatedCompany.authorizedPersonName,
            contact: updatedCompany.contact,
            email: updatedCompany.email,
            address: updatedCompany.address,
            website: updatedCompany.website,
            PAN: updatedCompany.PAN,
            GSTIN: updatedCompany.GSTIN,
            status: updatedCompany.status, // Assuming you want to set a status for the updated company
        };

        return [200, { company: data.company[indexToUpdate] }];
    } else {
        // If the company with the given ID is not found, return an error response
        return [404, { error: 'Company not found' }];
    }
});


