import mock from 'src/@fake-db/mock'

const data = {
    clients: [
        {
            id: 1,
            name: 'Galen Slixby',
            type: 'client',
            status: 'InActive',
        },
        {
            id: 2,
            name: 'Halsey Redmore',
            type: 'client',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Marjory Sicely',
            type: 'client',
            status: 'Active'
        },
        {
            id: 4,
            name: 'Cyrill Risby',
            type: 'client',
            status: 'InActive',
        },
        {
            id: 5,
            name: 'Maggy Hurran',
            type: 'client',
            status: 'Active'
        },
    ]
}

mock.onGet('/master/client/list').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()

    const filteredData = data.clients.filter(
        client =>
            (
                client.name.toLowerCase().includes(queryLowered) ||
                (client.status.toLowerCase().includes(queryLowered))) &&
            client.status === (client.status)
    )

    return [
        200,
        {
            allData: data.clients,
            client: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onPost('/master/client/add-client').reply(config => {
    // Get event from post data
    const client = JSON.parse(config.data).data
    const { length } = data.clients
    let lastIndex = 0
    if (length) {
        lastIndex = data.clients[length - 1].id
    }
    client.id = lastIndex + 1
    data.clients.unshift({ ...client })
    return [201, { client }]
})

mock.onDelete('/master/client/delete').reply(config => {
    // Get user id from URL
    const clientId = config.data
    const clientIndex = data.clients.findIndex(t => t.id === clientId)
    data.clients.splice(clientIndex, 1)
    return [200]
})

mock.onPut('/master/client/update-client').reply(config => {
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