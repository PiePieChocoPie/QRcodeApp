import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View,Alert } from 'react-native';
import { CameraView,useCameraPermissions  } from "expo-camera/next";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStateDialog from "src/modals/chooseStateDialog";
import Svg,{Polyline} from "react-native-svg";
import { getAllStaticData, getDataAboutDocs } from "src/http"; 
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";
import { useState } from 'react';


export default function Reader() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = React.useState(false);
    const [modalVisibleState, setModalVisibleState] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [docNumber, setDocNumber] = React.useState(0);
    const {loading, startLoading, stopLoading} = useLoading()
    useFocusEffect(
        React.useCallback(() => {
        const fetchData = async () => { 
                
            try {
                startLoading();  
                await getAllStaticData(Store.tokenData, false, false, false, true)
                .then(async (res) => {
                    if(res.status)  
                    {

                    }
                    else 
                        Alert.alert("Ошибка", res.curError);
                 })
                 .catch(err =>{
                 Alert.alert("ошибка",'Ошибка: \n' +err);
             })
            } catch (error) {
                console.error('ошибка:', error);
            }
            finally{
                stopLoading();                
            }
        };        
        fetchData();        
        }, []) 
    );


    const handleBarCodeScanned = async ({ data }) => {
        try{
            setScanned(true)
            await getDataAboutDocs(data)
            .then((res) => {
                if(res.data.result.items[0]){
                    const item = res.data.result.items[0];
                    let docIndex = 0;
                    if(item.entityTypeId=="168"&&item.stageId=="DT168_9:NEW") setDocNumber(1);
                    else if(item.entityTypeId=="133"&&item.stageId!="DT133_10:SUCCESS"&&item.stageId!="DT133_10:FAIL") setDocNumber(2);
                    else return Alert.alert("Неверный тип или этап документа", "Невозможно обработать дoкумент")
                    setModalVisibleState(true);
                    Store.setUpdData(res.data.result.items[0]);
                    setModalText(res.data.result.items[0]);
                }
                else{
                    alert(`ошибка получения документа`);
                    
                }
            })
            .catch((err) =>{
                console.log(err);
            })
        }
        catch(e){
            console.log(`ошибка получения документа - ${e}`);
        }
     };

    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(false)
    };
    

    

  
    return (

      <View style={styles.overlay}>

        <CameraView style={styles.camera} facing={'back'} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>

            <View>


            {scanned && (
                <TouchableOpacity style={styles.opacities} onPress={() => setScanned(false)}>
                    <Icon2 name="refresh"  size={40} color="#fff"/>
                    <Text style={styles.text}>сканировать снова</Text>
                </TouchableOpacity>
            )}
            </View>
            <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState}  docData={modalText} docNumber={docNumber}/>
        </CameraView>

      </View>
    );
  }