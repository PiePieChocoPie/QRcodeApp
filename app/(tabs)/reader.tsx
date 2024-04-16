import React, { useState, useEffect } from "react";
import {Text, TouchableOpacity, View,Alert, ActivityIndicator, Button, Dimensions, Image } from 'react-native';
import { CameraView, Camera } from "expo-camera/next";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStateDialog from "src/modals/chooseStateDialog";
import { getAllStaticData, getDataAboutDocs } from "src/http"; 
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";

// import image from "src/";

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');


export default function Reader() {
    const [modalVisibleState, setModalVisibleState] = useState(false);
    const [modalText, setModalText] = useState('');
    const [docNumber, setDocNumber] = useState(0);
    const {loading, startLoading, stopLoading} = useLoading()
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);


    const [cameraWidth, setCameraWidth] = useState(0);
    const [cameraHeight, setCameraHeight] = useState(0);


    const [qrBounds, setQrBounds] = useState([]);

    const handleBarcodeScanned = (BarcodeScanningResult) => {

        setQrBounds(BarcodeScanningResult.cornerPoints);
        console.log(cameraWidth + " = " + cameraHeight);
        // console.log(qrBounds);
    };

    
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

    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(false)
    };

    const onCameraLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setCameraWidth(width);
        setCameraHeight(height);

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

            <CameraView style={styles.camera}
                facing={'back'}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{barcodeTypes: ["qr", "pdf417"], interval:20} }
                mute={true}
                onLayout={onCameraLayout}
                >

            {
            qrBounds 
            && 
                (
                    <View style={styles.container2}>

                        <Image
                            source={require('src/qr-scan')} 
                            style={[
                                {
                                    position: 'absolute',
                                    right: qrBounds[0].y * cameraWidth,
                                    top: qrBounds[0].x * cameraHeight,
                                    width: (qrBounds[1].y - qrBounds[0].y) * cameraWidth,
                                    height: (qrBounds[2].x - qrBounds[0].x) * cameraHeight, 
                                }
                            ]}
                        />

                    </View>
                )
            }
            </CameraView>



            <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState}  docData={modalText} docNumber={docNumber}/>


        </View>
        )}
      </View>
    );
  }