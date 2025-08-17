import mock from 'src/@fake-db/mock'

const data = {
    paymentTransactions: [
        {
            id: 1,
            date: '28/10/2023',
            paymentType: 'Cash',
            name: 'dsfdf',
            accountName: 'ferf',
            amount: 20000,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae at sint ipsa! Cum, vel tempora! Inventore similique dolorem esse ullam ea, odit hic obcaecati modi, quos labore, quod nihil quas.,"
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

mock.onGet('/transaction/paymentTransaction/list').reply(config => {
    const { q = '' } = config.params
    const queryLowered = q.toLowerCase()
    const filteredData = data.paymentTransactions.filter(
        payment =>

            payment.paymentType.toLowerCase().includes(queryLowered) ||
            payment.name.toLowerCase().includes(queryLowered) ||
            payment.accountName.toLowerCase().includes(queryLowered) ||
            payment.amount.toString().toLowerCase().includes(queryLowered)
    )
    return [
        200,
        {
            allData: data.paymentTransactions,
            paymentTransaction: filteredData,
            params: config.params,
            total: filteredData.length
        }
    ]
})

mock.onPost('/transaction/paymentTransaction/add-paymentTransaction').reply(config => {
    // Get event from post data
    const payments = JSON.parse(config.data).data
    const { length } = data.paymentTransactions
    let lastIndex = 0
    if (length) {
        lastIndex = data.paymentTransactions[length - 1].id
    }
    payments.id = lastIndex + 1
    data.paymentTransactions.unshift({ ...payments })
    return [201, { payments }]
})

mock.onDelete('/transaction/paymentTransaction/delete').reply(config => {
    // Get user id from URL
    const paymentId = config.data
    const categoryIndex = data.paymentTransactions.findIndex(t => t.id === paymentId)
    data.paymentTransactions.splice(categoryIndex, 1)
    return [200]
})

mock.onPut('/transaction/paymentTransaction/update-paymentTransaction').reply(config => {
    // Get company data from request payload
    const updatedPayment = JSON.parse(config.data).data;

    // Find the index of the company to be updated based on its ID
    const clientIdToUpdate = updatedPayment.id;
    const indexToUpdate = data.paymentTransactions.findIndex(client => client.id === clientIdToUpdate);

    // If the company with the given ID is found, update its fields
    if (indexToUpdate !== -1) {
        data.paymentTransaction[indexToUpdate] = {
            ...data.paymentTransactions[indexToUpdate],
            name: updatedPayment.name,
            status: updatedPayment.status, // Assuming you want to set a status for the updated company
        };

        return [200, { paymentTransaction: data.paymentTransactions[indexToUpdate] }];
    } else {
        // If the company with the given ID is not found, return an error response
        return [404, { error: 'Company not found' }];
    }
});

