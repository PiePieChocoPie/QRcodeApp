import React, { useState, useEffect } from "react";
import {Text, TouchableOpacity, View,Alert, ActivityIndicator, Button, Dimensions } from 'react-native';
import { CameraView, Camera } from "expo-camera/next";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStateDialog from "src/modals/chooseStateDialog";
import { getAllStaticData, getDataAboutDocs } from "src/http"; 
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";



export default function Reader() {
    const [modalVisibleState, setModalVisibleState] = useState(false);
    const [modalText, setModalText] = useState('');
    const [docNumber, setDocNumber] = useState(0);
    const {loading, startLoading, stopLoading} = useLoading()
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    // const [qrBounds, setQrBounds] = useState({origin:{x:0,y:0},size:{height:0,width:0}});
    const [qrBounds, setQrBounds] = useState([]);

    const handleBarcodeScanned = (BarcodeScanningResult) => {
        // BarcodeScanningResult.bounds
        // setQrBounds(
        //     {
        //         origin: { x: Dimensions.get("window").height * BarcodeScanningResult.bounds.origin.x, y: Dimensions.get("window").width * BarcodeScanningResult.bounds.origin.y },
        //         size: { height: Dimensions.get("window").height * BarcodeScanningResult.bounds.size.height, width: Dimensions.get("window").width * BarcodeScanningResult.bounds.size.width}
        //     }
        // );
        setQrBounds(BarcodeScanningResult.cornerPoints);
        //     setQrBounds(
        //     {
        //         origin: { x: screenHeight * BarcodeScanningResult.bounds.origin.x, y: screenWidth * BarcodeScanningResult.bounds.origin.y }
        //     }
        // );
        console.log(qrBounds);
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

        {/* {scanned ?
            (   */}
                <CameraView style={styles.camera}
                    facing={'back'}
                    onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                    barcodeScannerSettings={{barcodeTypes: ["qr", "pdf417"], interval:20} }
                    mute={true} 
                    
                >

{qrBounds && (
        <View style={styles.container2}>
        {/* <View style={[styles.element, { right: qrBounds.origin.y, top: qrBounds.origin.x }]} /> */}
        {/* Элемент будет расположен в точке, находящейся на 25% от левого края экрана и 25% от верхнего края экрана */}
        {qrBounds.map((point, index) => (
                <View key={index} style={[styles.element, { right: point.y * screenWidth * 0.85, top: point.x * screenHeight *0.8}]} />
        ))}
        </View>
    )}
                </CameraView>
            {/* )
        :(
            <View style={styles.containerCentrallity}>
                {scanned && (
                    <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
                )}
            </View>
        )}       */}


                <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState}  docData={modalText} docNumber={docNumber}/>


        </View>
        )}
      </View>
    );
  }