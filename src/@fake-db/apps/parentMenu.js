// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const data = {
    parentMenus: [
        {
            id: 1,
            name: 'Dashboard',
            displayRank: 1,
            status: 'Active'
        },
        {
            id: 2,
            name: 'Master',
            displayRank: 2,
            status: 'Active'
        },
        {
            id: 3,
            name: 'Transaction',
            displayRank: 3,
            status: 'Active'
        },
        {
            id: 4,
            name: 'Report',
            displayRank: 4,
            status: 'Active'
        },
        {
            id: 5,
            name: 'Utility',
            displayRank: 5,
            status: 'Active'
        }
    ]
}

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/apps/parentMenu/data').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()

    const filteredData = data.parentMenus.filter(
        menu =>
            menu.name.toLowerCase().includes(queryLowered)
    )
    return [
        200,
        {
            params: config.params,
            allData: data.parentMenus,
            parentMenu: filteredData,
            total: filteredData.length
        }
    ]
})
