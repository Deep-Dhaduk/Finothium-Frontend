import mock from 'src/@fake-db/mock'

const data = {
    accountTypes: [
        {
            id: 1,
            name: 'Galen Slixby',
            type: 'Account Type',
            status: 'InActive',
        },
        {
            id: 2,
            name: 'Halsey Redmore',
            type: 'Account Type',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Marjory Sicely',
            type: 'Account Type',
            status: 'Active'
        },
        {
            id: 4,
            name: 'Cyrill Risby',
            type: 'Account Type',
            status: 'InActive',
        },
        {
            id: 5,
            name: 'Maggy Hurran',
            type: 'Account Type',
            status: 'Active'
        },
    ]
}

mock.onGet('/master/accountType/list').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()

    const filteredData = data.accountTypes.filter(
        accountType =>
            (
                accountType.name.toLowerCase().includes(queryLowered) ||
                (accountType.status.toLowerCase().includes(queryLowered))) &&
            accountType.status === (accountType.status)
    )
    return [
        200,
        {
            allData: data.accountTypes,
            accountType: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onPost('/master/accountType/add-accountType').reply(config => {
    // Get event from post data
    const account = JSON.parse(config.data).data
    const { length } = data.accountTypes
    let lastIndex = 0
    if (length) {
        lastIndex = data.accountTypes[length - 1].id
    }
    account.id = lastIndex + 1
    data.accountTypes.unshift({ ...account })
    return [201, { account }]
})

mock.onDelete('/master/accountType/delete').reply(config => {
    // Get user id from URL
    const accountTypeId = config.data
    const clientIndex = data.accountTypes.findIndex(t => t.id === accountTypeId)
    data.accountTypes.splice(clientIndex, 1)
    return [200]
})

mock.onPut('/master/accountType/update-accountType').reply(config => {
    // Get company data from request payload
    const updatedaccountType = JSON.parse(config.data).data;

    // Find the index of the company to be updated based on its ID
    const accountIdToUpdate = updatedaccountType.id;
    const indexToUpdate = data.accountTypes.findIndex(account => account.id === accountIdToUpdate);

    // If the company with the given ID is found, update its fields
    if (indexToUpdate !== -1) {
        data.accountTypes[indexToUpdate] = {
            ...data.accountTypes[indexToUpdate],
            name: updatedaccountType.name,
            status: updatedaccountType.status, // Assuming you want to set a status for the updated company
        };

        return [200, { company: data.accountTypes[indexToUpdate] }];
    } else {
        // If the company with the given ID is not found, return an error response
        return [404, { error: 'Company not found' }];
    }
});