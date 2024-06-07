import React, {useState} from 'react';
import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    tabla: {
        display: "table"
        ,width: "90%" 
        ,borderStyle: "solid"
        ,borderColor: "#000"
        , borderRightWidth: 0
        , borderBottomWidth: 0
        , marginTop: "20px"
    },
    tablaFila: {
        margin: "auto",
        flexDirection: "row"
    }, 
    tablaColumna1: {
        width: "25%"
        ,borderStyle: "solid"
        ,borderColor: "#000"
        , borderBottomColor: "#000"
        , borderWidth: 1
    },
    tablaCeldaHeader:{
        margin: 5,
        fontSize: 10,
        fontWeight: 500
    }, 
    anchoColumna1:{
        width: "25%"
        ,borderStyle: "solid"
        ,borderColor: "#000"
        , borderBottomColor: "#000"
        , borderWidth: 1
        , borderLeftWidth: 0
        , borderTopWidth: 0
    },
    anchoColumna2:{
        width: "20%"
        ,borderStyle: "solid"
        ,borderColor: "#000"
        , borderBottomColor: "#000"
        , borderWidth: 1
        , borderLeftWidth: 0
        , borderTopWidth: 0
    },
    tablaCelda:{
        margin: 5,
        fontSize: 10
    }


})

export const PaymentPDFDocument = (props)=> {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // Months are 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const formattedDateToday = `${day}/${month}/${year}`;
    let acumulator = 0
    for(let i = 0; i<props.data.length; i++)
        acumulator += props.data[i].amount
    
    
    return(
<Document>
    <Page size="A4" >
        <View style={{ padding:"60px"} }>
            <View style={{ display:"flex", flexDirection:"row", marginTop: "15px"} }>
                <View style={{ flex:1 } }>
                    <Text style={{fontSize:"12px", fontWeight:"bold"}}>Reporte de ordenes recibidas</Text>
                    <Text style={{fontSize:"12px", fontWeight:"bold"}}>Empresa de sublimación de camisetas</Text>
                    <Text style={{fontSize:"12px", fontWeight:"bold"}}>Dirección: Residencias del TEC</Text>
                    <Text style={{fontSize:"12px", fontWeight:"bold"}}>Fecha de inicio de recolección de datos: {props.start}</Text>
                    <Text style={{fontSize:"12px", fontWeight:"bold"}}>Fecha de final de recolección de datos: {props.end}</Text>
                    <Text style={{fontSize:"12px", fontWeight:"bold"}}>Fecha de emisión: {formattedDateToday}</Text>
                </View>
            </View>
            <View style={styles.tabla }>
                <View style={styles.tablaFila }>
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCeldaHeader }>Codigo de orden</Text>
                    </View>
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCeldaHeader }>Fecha</Text>
                    </View>
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCeldaHeader }>Teléfono</Text>
                    </View>
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCeldaHeader }>Monto</Text>
                    </View>
                </View>
                {props.data.map((row, index) => (<>
                
                <View style={styles.tablaFila }>
                
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCelda}>{row.idOrder}</Text>
                    </View>
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCelda}>{row.date.substring(0,10)}</Text>
                    </View>
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCelda}>{row.phone}</Text>
                    </View>
                    <View style={styles.tablaColumna1 }>
                        <Text style={styles.tablaCelda}>{row.amount}</Text>
                    </View>
                </View>
                </>))}
            </View>
            <View
                style={{
                    display:"flex",
                    flexDirection:"row",
                    marginTop: "35px",
                    marginBottom: "70px",
                    justifyContent:"flex-start"
                }}>
                    <Text style={{fontSize:"10px", fontWeight:"bold"}}>
                        Ganancia total: {acumulator}
                    </Text>
            </View>
        </View>
    </Page>
</Document>
)};
