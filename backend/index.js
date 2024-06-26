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

// Allows the access to the directory public(the project files)
app.use(express.static('public'));
// To allow the request from the app 
app.use(cors());
// Limits the request size to 50mb
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
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

    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.put("/update/state/:id", async (req,res) => {
  try{
    await sql.connect(config);
    const id = req.params.id
    const {state, userId} = req.body
    const request = new sql.Request();
    request.input('inIdOrder', sql.Int, id);
    request.input('inUserId', sql.Int, userId);
    request.input('inName', sql.VarChar(32), state);
    request.output('outResultCode', sql.Int);
    const result = await request.execute('change_state');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }

});


app.get("/clients", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    const result = await request.execute('read_clients');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** UPDATE CLIENT
 * 
 * @description Updates the client information (phone, name, direction)
 * 
 * @satisfies Update order 
 */
app.post("/update/client/:phone", async (req, res) => {
  try{
    const {name, phone, direction} = req.body
    const oldPhone = req.params.phone
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    request.input('inNewName', sql.VarChar(64), name);
    request.input('inNewPhone', sql.VarChar(16), phone);
    request.input('inOldPhone', sql.VarChar(16), oldPhone);
    request.input('inNewDirection', sql.VarChar(128), direction);
    
    const result = await request.execute('update_client');
    if(result.output.outResultCode !== null)
        res.status(200).send('Client updated');
    else
        res.status(500).send('Error while updating');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** UPDATE UNIT
 * 
 * @description Updates the unit information (Size, neckType, description)
 * 
 * @satisfies Update order 
 */
app.post("/update/unit/:id", async (req, res) => {
  try{
    const {size, neckType, description} = req.body
    const id = req.params.id
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    request.input('inNewSize', sql.VarChar(5), size);
    request.input('inNewNecktType', sql.VarChar(16), neckType);
    request.input('inNewDescription', sql.VarChar(256), description);
    request.input('inId', sql.Int, id);
    
    const result = await request.execute('update_unit');
    if(result.output.outResultCode !== null)
        res.status(200).send('Order updated');
    else
        res.status(500).send('Error updating');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});
  

/** UPLOAD SECOND PAYMENT IMAGE
 * 
 * @description Uploads the image of the second payment
 * 
 * @satisfies Payment management
 * 
 */
app.post("/secondPayment/:id", async (req, res) => {
  try{
    const {img, phone} = req.body
    const id = req.params.id
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    request.input('inPhone', sql.VarChar(16), phone);
    request.input('inId', sql.Int, id);
    request.input('inImgSecondPayment', sql.VarChar(sql.MAX), img);
    
    const result = await request.execute('upload_second_payment');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** LOGIN
 * 
 * 
 */
app.post("/login", async (req, res) => {
  try{
    const {name, password} = req.body
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    request.input('inName', sql.VarChar(16), name);
    request.input('inPassword', sql.VarChar(16), password);
    
    const result = await request.execute('login');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
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
 * @description Gets all the orders pending
 * 
 * @satisfies READ ORDER
 */
app.get("/orders_pending", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    const result = await request.execute('read_orders_pending');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.get("/orders_delivered", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    const result = await request.execute('read_orders_delivered');
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


app.post("/order/:id/cancel", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const id = req.params.id
    const {reason, date} = req.body
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    request.input('inDate', sql.Date, date);
    request.input('inReason', sql.VarChar(64), reason);
    const result = await request.execute('create_cancelation');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** DELETE ORDER
 * 
 * @description Deletes the order and all the images that correspond to that image
 * 
 * @satisfies Delete order
 */
app.delete("/order/:id/:reason", async (req, res) => {
  try{
    const id = req.params.id
    const reason = req.params.reason
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    const result = await request.execute('delete_order');

    // DELETE IMAGE OF THE DESIGN
    const requestDeleteDesign = new sql.Request(); 
    requestDeleteDesign.output('outResultCode', sql.Int);
    requestDeleteDesign.input('inId', sql.Int, result.recordset[0]["idImgDesign"]);
    await requestDeleteDesign.execute('delete_image');

    // DELETE THE IMAGE OF THE FIRST PAYMENT
    const requestDeleteFirstPayment = new sql.Request(); 
    requestDeleteFirstPayment.output('outResultCode', sql.Int);
    requestDeleteFirstPayment.input('inId', sql.Int, result.recordset[0]["idImgFirstPayment"]);
    await requestDeleteFirstPayment.execute('delete_image');

    // DELETE THE IMAGE OF THE SECOND PAYMENT
    if(result.recordset[0]["idImgSecondPayment"] !== null){
      const requestDeleteSecondPayment = new sql.Request(); 
      requestDeleteSecondPayment.output('outResultCode', sql.Int);
      requestDeleteSecondPayment.input('inId', sql.Int, result.recordset[0]["idImgSecondPayment"]);
      await requestDeleteSecondPayment.execute('delete_image');
    }
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.get("/order/:id/cancel/reason", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const id = req.params.id
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    const result = await request.execute('read_reason');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.put("/order/cancel/:id/reject", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const id = req.params.id
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    const result = await request.execute('reject_cancelation');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.put("/order/cancel/:id/accept", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const id = req.params.id
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    const result = await request.execute('accept_cancelation');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** GET A REPORT OF THE ORDERS RECIEVED ORDERS
 * 
 */
app.post("/orders/date_range", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const {start, end} = req.body
    request.output('outResultCode', sql.Int);
    request.input('inStart', sql.Date, start);
    request.input('inEnd', sql.Date, end);
    const result = await request.execute('read_order_date_range');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});

/** GET THE COUNT OF ORDERS RECIEVED PER DAY
 * 
 */
app.post("/orders/count", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const {start, end} = req.body
    request.output('outResultCode', sql.Int);
    request.input('inStart', sql.Date, start);
    request.input('inEnd', sql.Date, end);
    const result = await request.execute('read_order_count');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** SET CLIENT DELETED 
 * 
 * @description Sets the active column of the client in 0
 * 
 * @satisfies Delete client
 */
app.delete("/client/:phone", async (req, res) => {
  try{
    const phone = req.params.phone
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    request.input('inPhone', sql.VarChar(16), phone);
    const result = await request.execute('set_client_deleted');

    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.get("/payment/:id", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const id = req.params.id
    request.output('outResultCode', sql.Int);
    request.input('inId', sql.Int, id);
    const result = await request.execute('read_payment');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.post("/payment", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const id = req.params.id
    const {date, amount, code, name, idImgPayment, isFirstPayment} = req.body
    request.input('inDate', sql.Date, date);
    request.input('inAmount', sql.Money, amount);
    request.input('inId', sql.Int, code);
    request.input('inName', sql.VarChar(32), name);
    request.input('inIdImg', sql.Int, idImgPayment);
    request.input('inIsFirstPayment', sql.Bit, isFirstPayment);
    request.output('outResultCode', sql.Int);
    const result = await request.execute('create_payment');
    res.json(result.recordset);
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** GET PAYMENT DATA
 * 
 */
app.post("/payments/sum", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const {start, end} = req.body
    request.output('outResultCode', sql.Int);
    request.input('inStart', sql.Date, start);
    request.input('inEnd', sql.Date, end);
    const result = await request.execute('read_payment_sum');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/** GET PAYMENT DATA
 * 
 */
app.post("/payments", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    const {start, end} = req.body
    request.output('outResultCode', sql.Int);
    request.input('inStart', sql.Date, start);
    request.input('inEnd', sql.Date, end);
    const result = await request.execute('read_payments_date_range');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


/**
 * 
 */
app.get("/payments", async (req, res) => {
  try{
    await sql.connect(config);
    const request = new sql.Request();
    request.output('outResultCode', sql.Int);
    const result = await request.execute('read_payments');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.delete("/payment/:id", async (req, res) => {
  try{
    await sql.connect(config);
    const id = req.params.id
    const request = new sql.Request();
    request.input('inId', sql.Int, id)
    request.output('outResultCode', sql.Int);
    const result = await request.execute('delete_payment');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});


app.put("/payment/:id", async (req, res) => {
  try{
    await sql.connect(config);
    const id = req.params.id
    const { amount } = req.body;
    const request = new sql.Request();
    request.input('inId', sql.Int, id)
    request.input('inAmount', sql.Money, amount)
    request.output('outResultCode', sql.Int);
    const result = await request.execute('update_payment');
    res.json(result.recordset);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data.');
  } finally {
    sql.close();
  }
});
