// const CustomerService = require('../services/customer-service')

module.exports = (app) => {
    // const service = new CustomerService()

    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body

        // await service.SubscribeEvents(payload)

        console.log('======= Product Service received Event =======')

        return res.sendStatus(200)
    })
}