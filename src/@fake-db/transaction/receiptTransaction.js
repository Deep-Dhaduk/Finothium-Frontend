// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const data = {
    receiptTransactions: [
        {
            id: 1,
            date: '28/10/2023',
            paymentType: 'Cash',
            name: 'dsfdf',
            accountName: 'ferf',
            amount: 20000,
            description: 'Active',
        },
        {
            id: 2,
            date: '30/10/2023',
            paymentType: 'Bank',
            name: 'Siddhi',
            accountName: 'sidz',
            amount: 15000,
            description: 'inactive',
        },
        {
            id: 3,
            date: '01/11/2023',
            paymentType: 'Cash',
            name: 'dfjuk',
            accountName: 'ghng',
            amount: 30000,
            description: 'Active',
        },
        {
            id: 4,
            date: '19/11/2023',
            paymentType: 'Cash',
            name: 'Siddhi',
            accountName: 'sidz',
            amount: 15000,
            description: 'inactive',
        },
        {
            id: 5,
            date: '01/12/2023',
            paymentType: 'Cash',
            name: 'kiumj',
            accountName: 'smjmjuidz',
            amount: 15000,
            description: 'inactive',
        },
    ]
}

mock.onPost('/transaction/receiptTransaction/add-receiptTransaction').reply(config => {
    // Get event from post data
    const receipt = JSON.parse(config.data).data
    const { length } = data.receiptTransactions
    let lastIndex = 0
    if (length) {
        lastIndex = data.receiptTransactions[length - 1].id
    }
    receipt.id = lastIndex + 1
    data.receiptTransactions.unshift({ ...receipt })

    return [201, { receipt }]
})

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/transaction/receiptTransaction/list').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()
    const filteredData = data.receiptTransactions.filter(
        receipt =>
            receipt.paymentType.toLowerCase().includes(queryLowered) ||
            receipt.name.toLowerCase().includes(queryLowered) ||
            receipt.accountName.toLowerCase().includes(queryLowered) ||
            receipt.amount.toString().toLowerCase().includes(queryLowered)
    )
    return [
        200,
        {
            allData: data.receiptTransactions,
            receiptTransaction: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onDelete('/transaction/receiptTransaction/delete').reply(config => {
    // Get user id from URL
    const receiptId = config.data
    const companyIndex = data.receiptTransactions.findIndex(t => t.id === receiptId)
    data.receiptTransactions.splice(companyIndex, 1)

    return [200]
})

mock.onPut('/traqnsaction/receiptTransaction/update-receiptTransaction').reply(config => {
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
            status: 'active', // Assuming you want to set a status for the updated company
        };

        return [200, { company: data.company[indexToUpdate] }];
    } else {
        // If the company with the given ID is not found, return an error response
        return [404, { error: 'Company not found' }];
    }
});


