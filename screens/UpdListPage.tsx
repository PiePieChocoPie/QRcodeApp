import React from "react";
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, Image, Animated} from 'react-native';
import authStore from "../stores/authStore";
import {useNavigation} from "@react-navigation/native";
import {storeAuthStatus} from "../secStore";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Feather';
import UserDataDialog from "../Modals/UserDataDialog";
import taskStore from "../stores/taskStore";
import ScrollView = Animated.ScrollView;
import projColors from "../stores/staticColors";


let fullName = '';
type QRNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainPage'>
export default function MainPage () {
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


    const elements = taskStore.taskData.map(item => {
        const [detailVisible, setDetailVisible] = React.useState(false);
        const [depDate, setDepDate] = React.useState('');
        const [depDLDate, setDepDLDate] = React.useState('');

        React.useEffect(() => {
            const onlyDate = item.createdDate.split('T')[0]
            setDepDate(onlyDate);
            const onlyDLDate = item.deadline ? item.deadline.split('T')[0] : "не установлен";
            setDepDLDate(onlyDLDate);
        }, [taskStore.taskData[0]]);
        const toggleMore = () => {
            setDetailVisible(!detailVisible);
        };

        return (
            <View key={item.id} style={styles.taskView}>
                <Text style={{fontSize:16,        textAlign:"center"
                }}>{item.title}</Text>
                <View style={styles.taskInternalView}>
                    <View style={styles.internalTextRowView}>
                        <Text>постановщик: </Text>
                        <Text style={{fontSize:16}}>{item.creator.name}</Text>
                    </View>
                    <View style={styles.internalTextRowView}>
                        <Text>дата постановки: </Text>
                        <Text style={styles.text}>{depDate}</Text>
                    </View>
                    <View style={styles.internalTextRowView}>
                        <Text>дедлайн: </Text>
                    {item.deadline ? (
                        <Text style={styles.text}>{depDLDate}</Text>
                    ) : (
                        <Text style={styles.text}>не установлен</Text>
                    )}
                    </View>
                    <TouchableOpacity style={styles.moreButton} onPress={toggleMore}>
                        <Icon3 name={'more-horizontal'} size={30}/>
                    </TouchableOpacity>
                </View>
                {detailVisible ? (
                    <View>
                        {item.description ? (
                            <Text style={styles.descriptionText}>{item.description}</Text>
                        ) : (
                            <Text style={styles.descriptionText}>Дополнительная информация отсутствует</Text>
                        )}
                    </View>
                ):(<View/>)}
            </View>
        );
    });


    return (
        <View style={styles.container}>
                <View style={styles.overlayWithUser}>
                    <TouchableOpacity style={styles.userB} onPress={toggleModal}>
                        <View style={styles.avatarContainer}>
                            {photoUrl ? (
                                <Image source={{ uri: photoUrl }} style={styles.avatar} />
                            ) : (
                                <Icon name="user-o" size={40} color={projColors.currentVerse.font}
                                />)}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.horizontalBorders}>
                    <ScrollView>
                    {elements}
                    </ScrollView>
                </View>
                <View style={styles.infoButtonContainer}>
                    <TouchableOpacity style={styles.opacities} onPress={handleBack}>
                        <Icon2 name="qrcode-scan"  size={40} color={projColors.currentVerse.font}/>
                    </TouchableOpacity>
                </View>

            <UserDataDialog visible={modalVisible} onClose={toggleModal}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projColors.currentVerse.main
    },
    cameraContainer: {
        width: Dimensions.get('window').width - 60,
        height: Dimensions.get('window').width - 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: projColors.currentVerse.second,
        overflow: 'hidden',
    },
    cameraBorder: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderWidth: 5, // Толщина рамки по углам
        borderColor: projColors.currentVerse.second,
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
        alignItems:"flex-end",
    },
    horizontalBorders:{
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    },
    infoButtonContainer: {
        margin: 0,
        flexDirection: 'row',
        justifyContent: "center",
        gap: 150,
    },
    text: {
        color: projColors.currentVerse.font,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    internalTextRowView: {
        color: projColors.currentVerse.font,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        textAlign: "center"
    },
    descriptionText: {
        color: projColors.currentVerse.font,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    opacities:{
        alignItems: "center",
        // marginTop:30,
        margin: 15,
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
    mainFrame:{
        width: Dimensions.get('window').width - 60,
        height: Dimensions.get('window').width - 60
    },
    itemContainer:{
        width: Dimensions.get("window").width-3,
        borderRadius: 5,
        backgroundColor:projColors.currentVerse.extra,
        flexDirection: "row",
        borderWidth:2,
        overflow: 'hidden',
        borderColor: projColors.currentVerse.main
    },
    moreButton:{
        borderRadius:50,
        backgroundColor:projColors.currentVerse.accent,
        alignItems:"center",
        margin:4
    },
    taskView:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: projColors.currentVerse.extra,
        borderRadius: 10,
        borderWidth:1,
        borderColor:projColors.currentVerse.border,
        width: Dimensions.get("window").width-8,
        overflow: 'hidden',
        marginTop:5,
        textAlign:"center"
    },
    taskInternalView:{
        alignItems:"center",
        justifyContent:"space-between",
        width: Dimensions.get("window").width-3,
        borderColor: projColors.currentVerse.border,
        backgroundColor:projColors.currentVerse.main,
        flex:1
    },
});

