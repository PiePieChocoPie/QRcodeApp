import React from "react";
import {Text, View, StyleSheet, Button, Dimensions, TouchableOpacity, ImageBackground, Image} from "react-native";
import { Camera } from "expo-camera";
import QRCodeDialog from "../QRCodeDialog";
import {bitrixUserRequest, sendTo1cData} from "../http";
import authStore from "../authStoreDir";
import {getAuthStatus} from "../store";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";
import {useNavigation} from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';


type ReaderNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Reader'>
export default function Reader() {
    const [hasPermission, setHasPermission] = React.useState(null);
    const [scanned, setScanned] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const navigation = useNavigation<ReaderNavigationProp>();
    const nonBlurCameraSize = Dimensions.get("window").width - 30;
    const [image, setImage] = React.useState(null); // Состояние для хранения изображения с камеры
    const [photoUrl, setPhotoUrl] = React.useState('');

    React.useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            return status === "granted";
        };
        getCameraPermissions().then(setHasPermission);

    }, []);

    React.useEffect(() => {
        setPhotoUrl(authStore.userData[0].PERSONAL_PHOTO);
    }, [authStore.userData[0]]);

    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true);
        const token = await getAuthStatus();

    await sendTo1cData(data).then((res)=>{
             alert(res);
             console.log(res);
         })
         .catch((err) =>{
            console.log(err);
         })
        alert(`Отправлено ${data}`);
    };

    const handleBack = async() =>{
       navigation.replace('QRPage');
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    if (hasPermission === null) {
        return <Text>Запрос на использование камеры</Text>;
    }
    if (hasPermission === false) {
        return <Text>Нет доступа к камере</Text>;
    }



    return (
        <View style={styles.container}>
            <Camera style={styles.camera} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}>
                <View style={styles.overlay}>
                <TouchableOpacity style={styles.userB} onPress={toggleModal}>
                    <View style={styles.avatarContainer}>
                        {photoUrl ? (
                                <Image source={{ uri: photoUrl }} style={styles.avatar} />
                            ) : (
                                <Icon name="user-o" size={40} color="#fff"
                            />)}
                        </View>
                </TouchableOpacity>
                </View>
            {/* Верхняя часть: камера */}
                    <View style={styles.horizontalBorders}>
                        <View style={styles.overlay} />
                        <View style={styles.cameraContainer}/>
                        <View style={styles.overlay} />
                    </View>
                <View style={styles.infoButtonContainer}>
                    <TouchableOpacity  style={styles.opacities} onPress={handleBack}>
                        <Icon2 name="qrcode" size={50} color="#FFF"/>
                        <Text style={styles.text}>показать</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.overlay} >
                    {scanned && (
                        <TouchableOpacity style={styles.opacities} onPress={() => setScanned(false)}>
                            <Icon2 name="refresh"  size={40} color="#47f"/>
                            <Text style={styles.text}>сканировать снова</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Camera>

            <QRCodeDialog visible={modalVisible} onClose={toggleModal}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        width: Dimensions.get('window').width - 60,
        height: Dimensions.get('window').width - 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FFF',
        overflow: 'hidden',
    },
    cameraBorder: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderWidth: 5, // Толщина рамки по углам
        borderColor: '#FFF',
    },
    camera: {
        flex:1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height ,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачное черное наложение
    },
    horizontalBorders:{
        flexDirection: "row"
    },
    infoButtonContainer: {
        margin: 0,
        flexDirection: 'row',
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачное черное наложение

        gap: 150,
    },
    text: {
        color: '#FFF',
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    opacities:{
        alignItems: "center",
        marginTop:30,
    },
    userB:{
        margin:10,
        alignItems:"flex-end",
        flexDirection: "row",
        alignContent:"center"
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 50, // Радиус для создания кружка
        overflow: 'hidden', // Обрезаем изображение по границам кружка
        alignItems:"flex-end",
    },
    avatar: {
        flex: 1,
            width: '100%',
            height: '100%',
    },
});
