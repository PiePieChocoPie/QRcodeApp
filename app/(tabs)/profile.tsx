import React from "react";
import {View, Text, Alert, Dimensions, TouchableOpacity,ActivityIndicator, Image} from 'react-native';
import { storeAuthStatus } from 'src/secStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from "expo-router";
import Store from "src/stores/mobx";
import { projColors, styles } from "src/stores/styles";
import { useFocusEffect} from '@react-navigation/native';
import { getAllStaticData } from "src/http";
import useLoading from "src/useLoading";
import QRCode from "react-native-qrcode-svg";

function profile() {
    const [userData, setUserdata] = React.useState('');
    const [qrValue] = React.useState(Store.tokenData);
    const {loading, startLoading, stopLoading} = useLoading();
    const [photoUrl, setPhotoUrl] = React.useState('');

    const handleLogout = async () => {

        router.dismissAll();
    };

    useFocusEffect(
        
        React.useCallback(() => {
        const fetchData = async () => { 
                
            try {
                startLoading();  
                await getAllStaticData(Store.tokenData, false, true, false, false)
                .then(async (res) => {
                    if(res.status){  
                        setUserdata(`${Store.userData.NAME} ${Store.userData.LAST_NAME}\n${Store.userData.WORK_POSITION}\n${Store.depData.NAME}`);
                        setPhotoUrl(Store.userPhoto);
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
    return (
        <View style={styles.containerCentrallity}>
        {loading ?(
            <View style={styles.containerCentrallity}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
            </View> 
        ):
           
        (
        <View style = {styles.containerCentrallity}>
            <View  style={{ 
                alignItems: "center", 
                justifyContent: "center",
                borderColor:projColors.currentVerse.border,
                borderWidth:3}}>
                <QRCode 
                    value={qrValue}
                    size={Dimensions.get("window").width - 90}
                    backgroundColor={projColors.currentVerse.main}
                    color={projColors.currentVerse.font}
                    logoBackgroundColor="transparent"
                    ecl="H" // Установите уровень H (High) для более круглого QR-кода
                />   
            </View>
            <View style={styles.overlayWithUser}>
                        <View style={styles.avatarContainer}>
                            {photoUrl ? (
                                <Image source={{ uri: photoUrl }} style={styles.avatar} />
                            ) : (
                                <Icon name="user-o" size={40} color={projColors.currentVerse.font}
                                />)}
                        </View>
                </View>
            <Text style={styles.textProfile}>{userData}</Text>
            <TouchableOpacity   style={styles.opacities} onPress={handleLogout}>
                            <Icon name="user-times" size={40} color={projColors.currentVerse.font}/>
                            <Text style={styles.text}>выход</Text>
            </TouchableOpacity>   
            </View>
            )}      
        </View>
    );

}


export default profile;
