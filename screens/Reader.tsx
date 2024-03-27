import React from "react";
import {Text, View, StyleSheet, Button, Dimensions, TouchableOpacity, ImageBackground, Image} from "react-native";
import { Camera } from "expo-camera";
import UserDataDialog from "../Modals/UserDataDialog";
import authStore from "../stores/authStore";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";
import {useNavigation} from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseStateDialog from "../Modals/chooseStateDialog";
import Svg,{Polyline} from "react-native-svg";
import {getDataAboutDocs} from "../http";
import updStore from "../stores/updStore";
const { width, height } = Dimensions.get('window');

type ReaderNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Reader'>
export default function Reader() {
    const [hasPermission, setHasPermission] = React.useState(null);
    const [scanned, setScanned] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisibleState, setModalVisibleState] = React.useState(false);
    const navigation = useNavigation<ReaderNavigationProp>();
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [modalText, setModalText] = React.useState('');


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
        setModalVisibleState(true);
        let isItinerary = true;
        await getDataAboutDocs(data).then((res) => {
            updStore.setUpdData(res.data);
            console.log(res.data)
            setModalText(res.data);
        })
        .catch((err) =>{
            console.log(err);
        })
    };

    const handleBack = async() =>{
       navigation.replace('MainPage');
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(!scanned)
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text style={styles.text}>Запрос на использование камеры</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text style={styles.text}>Нет доступа к камере</Text></View>;
    }



    return (
        <View style={styles.container}>
            <Camera style={styles.camera} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} >
                <View style={styles.overlayWithUser}>
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
                        <View style={styles.cameraContainer}>
                            <Svg   width="100%"
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
                    </View><View style={styles.overlay} >
                {scanned && (
                    <TouchableOpacity style={styles.opacities} onPress={() => setScanned(false)}>
                        <Icon2 name="refresh"  size={40} color="#fff"/>
                        <Text style={styles.text}>сканировать снова</Text>
                    </TouchableOpacity>
                )}
            </View>
                <View style={styles.infoButtonContainer}>
                    <TouchableOpacity  style={styles.opacities} onPress={handleBack}>
                        <Icon name="list-alt" size={50} color="#FFF"/>
                    </TouchableOpacity>
                </View>

            </Camera>
            <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState}  docData={modalText}/>
            <UserDataDialog visible={modalVisible} onClose={toggleModal}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        width: width - 60,
        height: width - 60,
        alignItems: 'center',
        justifyContent: 'center',
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
        margin:15,
    },
    userB:{
        margin:10,
        flexDirection: "row",
        alignContent:"center"
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 50,
        overflow: 'hidden',
        marginTop: 15,
        alignItems: "center"
    },
    avatar: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlayWithUser: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачное черное наложение
        alignItems:"flex-end",
    },
    border: {
        width: 200,
        height: 200,
        borderWidth: 1,
        borderColor: 'black',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'dashed',
    },
    topLeft: {
        top: -5,
        left: -5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    topRight: {
        top: -5,
        right: -5,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomLeft: {
        bottom: -5,
        left: -5,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomRight: {
        bottom: -5,
        right: -5,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
});
