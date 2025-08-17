// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const data = {
    transfers: [
        {
            id: 1,
            date: '28/10/2023',
            paymentType: 'Cash',
            from: 'dsfdf',
            to: 'ferf',
            amount: 20000,
            description: 'Active',
        },
        {
            id: 2,
            date: '30/10/2023',
            paymentType: 'Bank',
            from: 'Siddhi',
            to: 'sidz',
            amount: 15000,
            description: 'inactive',
        },
        {
            id: 3,
            date: '01/11/2023',
            paymentType: 'Cash',
            from: 'dfjuk',
            to: 'ghng',
            amount: 30000,
            description: 'Active',
        },
        {
            id: 4,
            date: '19/11/2023',
            paymentType: 'Cash',
            from: 'Siddhi',
            to: 'sidz',
            amount: 15000,
            description: 'inactive',
        },
        {
            id: 5,
            date: '01/12/2023',
            paymentType: 'Cash',
            from: 'kiumj',
            to: 'smjmjuidz',
            amount: 15000,
            description: 'inactive',
        },
    ]
}

mock.onPost('/transaction/transfer/add-transfer').reply(config => {
    // Get event from post data
    const transfer = JSON.parse(config.data).data
    const { length } = data.transfers
    let lastIndex = 0
    if (length) {
        lastIndex = data.transfers[length - 1].id
    }
    transfer.id = lastIndex + 1
    data.transfers.unshift({ ...transfer })

    return [201, { transfer }]
})

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/transaction/transfer/list').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()
    const filteredData = data.transfers.filter(
        transfer =>
            transfer.paymentType.toLowerCase().includes(queryLowered) ||
            transfer.from.toLowerCase().includes(queryLowered) ||
            transfer.to.toLowerCase().includes(queryLowered) ||
            transfer.amount.toString().toLowerCase().includes(queryLowered)
    )
    return [
        200,
        {
            allData: data.transfers,
            transfer: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onDelete('/transaction/transfer/delete').reply(config => {
    // Get user id from URL
    const transferId = config.data
    const companyIndex = data.transfers.findIndex(t => t.id === transferId)
    data.transfers.splice(companyIndex, 1)

    return [200]
})

mock.onPut('/transaction/transfer/update-transfer').reply(config => {
    // Get company data from request payload
    const updatedTransfer = JSON.parse(config.data).data;

    // Find the index of the company to be updated based on its ID
    const transferIdToUpdate = updatedTransfer.id;
    const indexToUpdate = data.transfers.findIndex(company => company.id === transferIdToUpdate);

    // If the company with the given ID is found, update its fields
    if (indexToUpdate !== -1) {
        data.transfers[indexToUpdate] = {
            ...data.transfers[indexToUpdate],
            date: updatedTransfer.date,
            paymentType: updatedTransfer.paymentType,
            from: updatedTransfer.from,
            to: updatedTransfer.to,
            amount: updatedTransfer.amount,
            description: updatedTransfer.description
        };

        return [200, { transfer: data.transfers[indexToUpdate] }];
    } else {
        // If the company with the given ID is not found, return an error response
        return [404, { error: 'Company not found' }];
    }
});


