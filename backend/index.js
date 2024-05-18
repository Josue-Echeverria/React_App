// server/index.js

const express = require("express");
const cors = require('cors')
const app = express();
const sql = require('mssql');

// Config for the db
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

// Allows the access to the public
app.use(express.static('public'));

// To allow the request from the app 
app.use(cors());
// Limits the request size to 50mb
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


/**POST ORDER
 * 
 * @description Takes all the data to send it to the db an register the order 
 * 
 * @satisfies CREATE ORDER
 */
app.post("/order", async (req, res) => {
  try{
    const {name, phone, direction, quantity, unitsInfo, total, design, firstPaymentImg, secondPaymentImg} = req.body
    await sql.connect(config);
    const request = new sql.Request();
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


/** GET ORDERS
 * 
 * @description Gets all the orders from the db registered to the number 
 * 
 * @satisfies READ ORDER
 */
app.get("/orders/:phone", async (req, res) => {
  try{
    await sql.connect(config);

    const phone = req.params.phone;
    const request = new sql.Request();
    
    request.output('outResultCode', sql.Int);
    request.input('inPhone', sql.VarChar(16), phone);
    const result = await request.execute('read_orders_by_phone');

    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
  });


/** GET ORDER
 * 
 * @description Gets the order from the db saved with the id
 * 
 * @satisfies READ ORDER
 */
app.get("/order/:id", async (req, res) => {
  try{
    await sql.connect(config);

    const id = req.params.id;
    const request = new sql.Request();
    
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    
    const result = await request.execute('read_order_by_id');

    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
  });


/** GET IMAGE
 * 
 * @description Gets the image from the db saved with the id
 * 
 * @satisfies READ ORDER
 */
app.get("/image/:id", async (req, res) => {
  try{
    await sql.connect(config);

    const id = req.params.id;
    const request = new sql.Request();
    
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    
    const result = await request.execute('read_image_by_id');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
  });


/** GET UNITS
 * 
 * @description Gets all the units correspondent to the order id
 * 
 * @satisfies READ ORDER
 */
app.get("/unit/:id", async (req, res) => {
  try{
    await sql.connect(config);

    const id = req.params.id;
    const request = new sql.Request();
    
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    
    const result = await request.execute('read_units_by_order_id');
    console.log(result.recordset)
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
  });

  
