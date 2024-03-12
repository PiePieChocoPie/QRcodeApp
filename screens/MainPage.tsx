import React from "react";
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import QRCode from "react-native-qrcode-svg";
import authStore from "../authStoreDir";
import {useNavigation} from "@react-navigation/native";
import {storeAuthStatus} from "../store";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import UserDataDialog from "../Modals/UserDataDialog";


let fullName = '';
type QRNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainPage'>
export default function MainPage () {
    const [qrValue] = React.useState(authStore.userData[0].UF_USR_GUID);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [photoUrl, setPhotoUrl] = React.useState('');

    React.useEffect(() => {
        setPhotoUrl(authStore.userData[0].PERSONAL_PHOTO);
    }, [authStore.userData[0]]);

    const navigation = useNavigation<QRNavigationProp>()
    const handleBack = async () => {
        await storeAuthStatus('');
        navigation.replace('Reader');
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <View style={styles.container}>
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

                    <View style={styles.mainFrame}/>
                    <View style={styles.overlay} />
                </View>
                <View style={styles.infoButtonContainer}>
                    <TouchableOpacity style={styles.opacities} onPress={handleBack}>
                        <Icon2 name="qrcode-scan"  size={40} color="#111"/>
                    </TouchableOpacity>
                </View>

            <UserDataDialog visible={modalVisible} onClose={toggleModal}/>
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
    },
    overlayWithUser: {
        flex: 1,
        alignItems:"flex-end",
    },
    horizontalBorders:{
        flexDirection: "row"
    },
    infoButtonContainer: {
        margin: 0,
        flexDirection: 'row',
        justifyContent: "center",
        gap: 150,

    },
    text: {
        color: '#111',
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    opacities:{
        alignItems: "center",
        marginTop:30,
        marginBottom: 30,
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
        margin: 15
    },
    avatar: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mainFrame:{
        width: Dimensions.get('window').width - 60,
        height: Dimensions.get('window').width - 60
    }
});

