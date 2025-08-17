import mock from 'src/@fake-db/mock'

const data = {
    paymentTypes: [
        {
            id: 1,
            name: 'Galen Slixby',
            type: 'Payment Type',
            status: 'InActive',
        },
        {
            id: 2,
            name: 'Halsey Redmore',
            type: 'Payment Type',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Marjory Sicely',
            type: 'Payment Type',
            status: 'Active'
        },
        {
            id: 4,
            name: 'Cyrill Risby',
            type: 'Payment Type',
            status: 'InActive',
        },
        {
            id: 5,
            name: 'Maggy Hurran',
            type: 'Payment Type',
            status: 'Active'
        },
    ]
}

mock.onGet('/master/paymentType/data').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()

    const filteredData = data.paymentTypes.filter(
        paymentType =>
            (
                paymentType.name.toLowerCase().includes(queryLowered) ||
                (paymentType.status.toLowerCase().includes(queryLowered))) &&
            paymentType.status === (paymentType.status)
    )
    return [
        200,
        {
            allData: data.paymentTypes,
            paymentType: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onPost('/master/paymentType/add-paymentType').reply(config => {
    // Get event from post data
    const payment = JSON.parse(config.data).data
    const { length } = data.paymentTypes
    let lastIndex = 0
    if (length) {
        lastIndex = data.paymentTypes[length - 1].id
    }
    payment.id = lastIndex + 1
    data.paymentTypes.unshift({ ...payment })
    return [201, { payment }]
})

mock.onDelete('/master/paymentType/delete').reply(config => {
    // Get user id from URL
    const paymentTypeId = config.data
    const clientIndex = data.paymentTypes.findIndex(t => t.id === paymentTypeId)
    data.paymentTypes.splice(clientIndex, 1)
    return [200]
})

mock.onPut('/master/paymentType/update-paymentType').reply(config => {
    // Get company data from request payload
    const updatedClient = JSON.parse(config.data).data;

    // Find the index of the company to be updated based on its ID
    const clientIdToUpdate = updatedClient.id;
    const indexToUpdate = data.clients.findIndex(client => client.id === clientIdToUpdate);

    // If the company with the given ID is found, update its fields
    if (indexToUpdate !== -1) {
        data.clients[indexToUpdate] = {
            ...data.clients[indexToUpdate],
            name: updatedClient.name,
            status: updatedClient.status, // Assuming you want to set a status for the updated company
        };

        return [200, { company: data.clients[indexToUpdate] }];
    } else {
        // If the company with the given ID is not found, return an error response
        return [404, { error: 'Company not found' }];
    }
});