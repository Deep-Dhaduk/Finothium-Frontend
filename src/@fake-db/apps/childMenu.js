// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const data = {
    childMenus: [
        {
            id: 1,
            name: 'Dashboard',
            displayRank: 1,
            parentMenu: "Master",
            status: 'Active'
        },
        {
            id: 2,
            name: 'Master',
            displayRank: 2,
            parentMenu: "Master",
            status: 'Active'
        },
        {
            id: 3,
            name: 'Transaction',
            displayRank: 3,
            parentMenu: "Master",
            status: 'Active'
        },
        {
            id: 4,
            name: 'Report',
            displayRank: 4,
            parentMenu: "Master",
            status: 'Active'
        },
        {
            id: 5,
            name: 'Utility',
            displayRank: 5,
            parentMenu: "Master",
            status: 'Active'
        }
    ]
}

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/apps/childMenu/data').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()

    const filteredData = data.childMenus.filter(
        menu =>
            menu.name.toLowerCase().includes(queryLowered) ||
            menu.parentMenu.toLowerCase().includes(queryLowered)
    )
    return [
        200,
        {
            params: config.params,
            allData: data.childMenus,
            childMenu: filteredData,
            total: filteredData.length
        }
    ]
})
