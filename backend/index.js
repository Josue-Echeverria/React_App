// server/index.js

const express = require("express");
const cors = require('cors')
const app = express();
const sql = require('mssql');

const config = {
    server: 'localhost',
    database: 'order-db',
    user: 'sa',
    password: 'L0tsoffun!',
    port: 1433,
    options: {
        encrypt: true, // For secure connection
        trustServerCertificate: true 
    },
};

const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post("/order", async (req, res) => {
  try{
    const {name, phone, direction, quantity, unitsInfo, total, design, firstPaymentImg, secondPaymentImg} = req.body
    await sql.connect(config);
    const request = new sql.Request();

    // console.log(design)
    request.output('outResultCode', sql.Int);
    request.input('inName', sql.VarChar(64), name);
    request.input('inPhone', sql.VarChar(16), phone);
    request.input('inDirection', sql.VarChar(128), direction);
    request.input('inQuantity', sql.Int, quantity);
    request.input('inUnit', sql.NVARCHAR(sql.MAX), JSON.stringify(unitsInfo));
    request.input('inTotal', sql.Money, total);
    request.input('inImgDesign', sql.VarChar(sql.MAX), design);
    request.input('inImgFirstPayment', sql.VarChar(sql.MAX), firstPaymentImg);
    request.input('inImgSecondPayment', sql.VarChar(sql.MAX), secondPaymentImg);

    const result = await request.execute('create_order');
    if(result.output.outResultCode !== null)
        res.status(200).send('Pedido enviado');
    else
        res.status(500).send('Error al enviar');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
  });

app.get("/order/:phone", async (req, res) => {
  try{
    await sql.connect(config);

    const phone = req.params.phone;
    const request = new sql.Request();
    
    request.output('outResultCode', sql.Int);
    request.input('inPhone', sql.VarChar(16), phone);
    
    const result = await request.execute('read_orders');
    // console.log(result.recordset)

    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching daaaataaaa.');
  } finally {
    sql.close();
  }
  });
  