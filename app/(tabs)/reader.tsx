import React from "react";
import {Text, View, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import { Camera } from "expo-camera";
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStateDialog from "src/modals/chooseStateDialog";
import Svg,{Polyline} from "react-native-svg";
import { getAllStaticData, getDataAboutDocs } from "src/http"; 
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";

export default function Reader() {
    const [hasPermission, setHasPermission] = React.useState(null);
    const [scanned, setScanned] = React.useState(false);
    const [modalVisibleState, setModalVisibleState] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [docNumber, setDocNumber] = React.useState(0);
    const {loading, startLoading, stopLoading} = useLoading();
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

    React.useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            return status === "granted";
        };
        getCameraPermissions().then(setHasPermission);

    }, []);

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
                //console.log(err);
            })
        }
        catch(e){
            //console.log(`ошибка получения документа - ${e}`);
        }
     };

    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(false)
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text style={styles.text}>Запрос на использование камеры</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text style={styles.text}>Нет доступа к камере</Text></View>;
    }



    return <View style={styles.container}>
        {loading ?
            (
            <View style={styles.containerCentrallity}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
            </View> 
            ):
           
        (
        <View style={styles.overlay} >
                <Camera style={styles.camera} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} >
                {/* Верхняя часть: камера */}
                    <View style={{flex:1}}>
                        <View style={styles.overlay}></View>
                    <View style={styles.horizontalBorders}>
                        <View style={styles.overlay} />
                            <View style={styles.cameraContainer}>
                                <Svg    width="100%"
                                        height="100%"
                                        viewBox={'0 0 60 60'}
                                        style={{overflow:'visible'}}
                                >
                                    <Polyline
                                        points="0,20 0,0 20,0"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="6"
                                    />
                                    <Polyline
                                        points="40,0 60,0 60,20"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="6"
                                    />
                                    <Polyline
                                        points="0,40 0,60 20,60"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="6"
                                    />
                                    <Polyline
                                        points="40,60 60,60 60,40"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="6"
                                    />
                                </Svg>
                            </View>
                            <View style={styles.overlay} />
                            </View>
                            <View style={styles.overlay} >
                            {scanned && (
                            <TouchableOpacity style={styles.opacities} onPress={() => setScanned(false)}>
                                <Icon2 name="refresh"  size={40} color="#fff"/>
                                <Text style={styles.text}>сканировать снова</Text>
                            </TouchableOpacity>
                            )}
                        </View>
                    <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState}  docData={modalText} docNumber={docNumber}/>
                </View>
            </Camera>
        </View>
        )
    }    
    </View>
}

