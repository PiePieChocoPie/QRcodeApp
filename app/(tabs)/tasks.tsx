import React from "react";
import {View, Text, TouchableOpacity, Image, Animated, RefreshControl} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Feather';
import ScrollView = Animated.ScrollView;
import styles from "../styles";
import { getAllStaticData } from "../../http";
import authStore from "../../stores/authStore";
import taskStore from "../../stores/taskStore";
import projColors from "../../stores/staticColors";
import UserDataDialog from "../../Modals/UserDataDialog";


let fullName = '';
export default function tasks () {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [taskCount, setTaskCount] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);
        // Ваш код обновления данных здесь
        console.log('обновляем')
        await getAllStaticData(authStore.tokenData);
        // Завершение обновления
        setRefreshing(false);
    }, []);

    React.useEffect(() => {
        setPhotoUrl(authStore.userData[0].PERSONAL_PHOTO);
    }, [authStore.userData[0]]);




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
                    <Text style={{fontSize: 16, textAlign: "center"}}>{item.title}</Text>
                    <View style={styles.taskInternalView}>
                        <View style={styles.internalTextRowView}>
                            <Text>постановщик: </Text>
                            <Text style={{fontSize: 16}}>{item.creator.name}</Text>
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
                    {detailVisible && (
                        <View>
                            {item.description ? (
                                <Text style={styles.descriptionText}>{item.description}</Text>
                            ) : (
                                <Text style={styles.descriptionText}>Дополнительная информация отсутствует</Text>
                            )}
                        </View>
                    )}
                </View>
        )
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

                        {taskCount?
                            (<ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[projColors.currentVerse.accent]}
                                    />}>
                                {elements}
                            </ScrollView>)
                            :(
                                <Text style={styles.noValueText}>Задачи не установлены</Text>
                            )
                        }

                </View>

            <UserDataDialog visible={modalVisible} onClose={toggleModal}/>
        </View>
    );
}
