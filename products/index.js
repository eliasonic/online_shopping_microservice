const express = require('express');

const app = express();

const PORT = 8002

app.use(express.json())

app.use('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to products' })
})

app.listen(PORT, () => {
    console.log(`Products listening to port ${PORT}`);
})
