import mock from 'src/@fake-db/mock'

const data = {
    categories: [
        {
            id: 1,
            name: 'Galen',
            type: 'Category',
            status: 'inactive',
        },
        {
            id: 2,
            name: 'Halsey Redmore',
            type: 'Category',
            status: 'pending'
        },
        {
            id: 3,
            name: 'Marjory Sicely',
            type: 'Category',
            status: 'active'
        },
        {
            id: 4,
            name: 'Cyrill Risby',
            type: 'Category',
            status: 'inactive',
        },
        {
            id: 5,
            name: 'Maggy Hurran',
            type: 'Category',
            status: 'pending'
        },
    ]
}

mock.onGet('/master/category/list').reply(config => {
    const { q = '' } = config.params ?? ''
    const queryLowered = q.toLowerCase()

    const filteredData = data.categories.filter(
        category =>
            (
                category.name.toLowerCase().includes(queryLowered) ||
                category.role.toLowerCase().includes(queryLowered) ||
                (category.status.toLowerCase().includes(queryLowered))) &&
            category.status === (category.status)
    )

    return [
        200,
        {
            allData: data.categories,
            category: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onPost('/master/category/add-category').reply(config => {
    // Get event from post data
    const category = JSON.parse(config.data).data
    const { length } = data.categories
    let lastIndex = 0
    if (length) {
        lastIndex = data.categories[length - 1].id
    }
    category.id = lastIndex + 1
    data.categories.unshift({ ...category })
    return [201, { category }]
})

mock.onDelete('/master/category/delete').reply(config => {
    // Get user id from URL
    const categoryId = config.data
    const categoryIndex = data.categories.findIndex(t => t.id === categoryId)
    data.categories.splice(categoryIndex, 1)
    return [200]
})

mock.onPut('/master/category/update-category').reply(config => {
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