import React, {} from "react";
import {Text, TouchableOpacity, View,Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStateDialog from "src/modals/chooseStateDialog";
import { getAllStaticData, getDataAboutDocs } from "src/http"; 
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";
import { useState } from 'react';
import Toast from 'react-native-root-toast';

import LottieView from 'lottie-react-native';
import anim from 'src/anim.json';
import anim2 from 'src/anim2.json';


export default function Reader() {
    const [scanned, setScanned] = useState(false);
    const [modalVisibleState, setModalVisibleState] = useState(false);
    const [modalText, setModalText] = useState('');
    const [docNumber, setDocNumber] = useState(0);
    const {loading, startLoading, stopLoading} = useLoading()
    const [permission, requestPermission] = useCameraPermissions();
    
    React.useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await requestPermission();
            return status === "granted";
        };
        getCameraPermissions().then(requestPermission);

    }, []);

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


    const handleBarCodeScanned = async ({ data}) => {
        try{
            setScanned(true)
            await getDataAboutDocs(data)
            .then((res) => {
                if(res.data.result.items[0]){
                    const item = res.data.result.items[0];
                    if(item.entityTypeId=="168") setDocNumber(1);
                    else if(item.entityTypeId=="133"&&item.stageId!="DT133_10:SUCCESS"&&item.stageId!="DT133_10:FAIL") setDocNumber(2);
                    else return Alert.alert("Неверный тип или этап документа", "Невозможно обработать дoкумент")
                    setModalVisibleState(true);
                    Store.setUpdData(res.data.result.items[0]);
                    setModalText(res.data.result.items[0]);
                }
                else{
                    let toast = Toast.show(`ошибка получения документа`, {
                        duration: Toast.durations.LONG,
                        position:Toast.positions.TOP
                    });
                    
                    setTimeout(function hideToast() {
                        Toast.hide(toast);
                      }, 15000);
                }
            })
            .catch((err) =>{
                console.log(err);
            })
            
        }
        catch(e){
            let toast = Toast.show(`ошибка получения документа - ${e}`, {
                        position:Toast.positions.TOP,
                        duration: Toast.durations.LONG,
            });
            
            setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 500);
            console.log(`ошибка получения документа - ${e}`);
        }
        setScanned(false);
     };

    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(false)
    };
    

    

  
    return (
        <View style={styles.container}>
        {loading ?(
            <View style={styles.containerCentrallity}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
            </View> 
        ):
           
        (
      <View style={styles.overlay}>

        {!scanned ?
            (  
                <CameraView style={styles.camera} facing={'back'} onBarcodeScanned={handleBarCodeScanned} mute>
                <View style={styles.overlay}/>
                <View style={styles.horizontalBorders}>
                    <View style={styles.overlay}/>
                    <View style={styles.cameraContainer}>
                <LottieView 
                    source={anim2} 
                    style={{width: "100%", height: "100%"}} 
                    autoPlay 
                    loop
                    />
                    </View>
                    <View style={styles.overlay}/>
                </View>
                <View style={styles.overlay}/>
                

                    
                </CameraView>
            )
        :(
            <View style={styles.containerCentrallity}>
                <TouchableOpacity style={styles.opacities} onPress={() => setScanned(false)}>
                    <Icon2 name="refresh"  size={40} color={projColors.currentVerse.main}/>
                    <Text style={styles.text}>сканировать снова</Text>
                </TouchableOpacity>
            </View>
        )}      


            <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState}  docData={modalText} docNumber={docNumber}/>


        </View>
        )}
      </View>
    );
  }