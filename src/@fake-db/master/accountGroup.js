import mock from 'src/@fake-db/mock'

const data = {
    accountGroups: [
        {
            id: 1,
            name: 'Galen Slixby',
            type: 'Account Group',
            status: 'InActive',
        },
        {
            id: 2,
            name: 'Halsey Redmore',
            type: 'Account Group',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Marjory Sicely',
            type: 'Account Group',
            status: 'Active'
        },
        {
            id: 4,
            name: 'Cyrill Risby',
            type: 'Account Group',
            status: 'InActive',
        },
        {
            id: 5,
            name: 'Maggy Hurran',
            type: 'Account Group',
            status: 'Active'
        },
    ]
}

mock.onGet('/master/accountGroup/list').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()

    const filteredData = data.accountGroups.filter(
        accountGroup =>
            (
                accountGroup.name.toLowerCase().includes(queryLowered) ||
                (accountGroup.status.toLowerCase().includes(queryLowered))) &&
            accountGroup.status === (accountGroup.status)
    )
    return [
        200,
        {
            allData: data.accountGroups,
            accountGroup: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onPost('/master/accountGroup/add-accountGroup').reply(config => {
    // Get event from post data
    const account = JSON.parse(config.data).data
    const { length } = data.accountGroups
    let lastIndex = 0
    if (length) {
        lastIndex = data.accountGroups[length - 1].id
    }
    account.id = lastIndex + 1
    data.accountGroups.unshift({ ...account })
    return [201, { account }]
})

mock.onDelete('/master/accountGroup/delete').reply(config => {
    // Get user id from URL
    const accountGroupId = config.data
    const clientIndex = data.accountGroups.findIndex(t => t.id === accountGroupId)
    data.accountGroups.splice(clientIndex, 1)
    return [200]
})

mock.onPut('/master/accountGroup/update-accountGroup').reply(config => {
    // Get company data from request payload
    const updateAccountGroup = JSON.parse(config.data).data;

    // Find the index of the company to be updated based on its ID
    const accountIdToUpdate = updateAccountGroup.id;
    const indexToUpdate = data.accountTypes.findIndex(account => account.id === accountIdToUpdate);

    // If the company with the given ID is found, update its fields
    if (indexToUpdate !== -1) {
        data.accountTypes[indexToUpdate] = {
            ...data.accountTypes[indexToUpdate],
            name: updateAccountGroup.name,
            status: updateAccountGroup.status, // Assuming you want to set a status for the updated company
        };

        return [200, { company: data.accountGroups[indexToUpdate] }];
    } else {
        // If the company with the given ID is not found, return an error response
        return [404, { error: 'Company not found' }];
    }
});