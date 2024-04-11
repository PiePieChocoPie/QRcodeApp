import React, { useState, useEffect } from "react";
import {Text, TouchableOpacity, View,Alert, ActivityIndicator, Button } from 'react-native';
import { CameraView, Camera } from "expo-camera/next";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStateDialog from "src/modals/chooseStateDialog";
import { getAllStaticData, getDataAboutDocs } from "src/http"; 
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";

import LottieView from 'lottie-react-native';
import anim from 'src/anim.json';
import anim2 from 'src/anim2.json';


export default function Reader() {
    const [modalVisibleState, setModalVisibleState] = useState(false);
    const [modalText, setModalText] = useState('');
    const [docNumber, setDocNumber] = useState(0);
    const {loading, startLoading, stopLoading} = useLoading()
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    
    useEffect(() => {
        const getCameraPermissions = async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
        };
    
        getCameraPermissions();
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


    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      };

    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(false)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }
    

  
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
                <CameraView style={styles.camera}
                    facing={'back'}
                    // onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    onBarcodeScanned={(scanningResult) => console.log(scanningResult.bounds)}
                    barcodeScannerSettings={{barcodeTypes: ["qr", "pdf417"], interval:20} }
                    mute={true} 
                    
                >
                <View style={styles.overlay}/>
                <View style={styles.horizontalBorders}>
                <View style={styles.overlay}/>
                <LottieView 
                    source={anim2} 
                    style={{width: "100%", height: "100%"}} 
                    autoPlay 
                    loop
                    />
                    <View style={styles.overlay}/>
                </View>
                <View style={styles.overlay}/>
                

                    
                </CameraView>
            )
        :(
            <View style={styles.containerCentrallity}>
                {scanned && (
                    <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
                )}
            </View>
        )}      


                <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState}  docData={modalText} docNumber={docNumber}/>


        </View>
        )}
      </View>
    );
  }