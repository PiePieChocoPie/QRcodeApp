import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { ActivityIndicator } from "react-native-paper";
import CustomModal from "src/components/custom-modal";
import { getUserById } from "src/requests/userData";
import { projColors } from "src/stores/styles"; // Импортируем projColors
import useLoading from "src/useLoading";
import * as Icons from '../../assets';


const ItineraryItems = ({ item }) => {
    const [depDate, setDepDate] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [creator, setCreator] = React.useState<any>(null)
    const {loading, startLoading, stopLoading} = useLoading();

    React.useEffect(() => {
        
        const onlyDate = item.createdTime.split('T')[0];
        setDepDate(onlyDate);
    }, [item]);

    const toggleMore = async() => {
        setModalVisible(!modalVisible);
        startLoading();
        const creatorData = await getUserById(item.createdBy);
        setCreator(creatorData[0]);
        stopLoading();
    };

    const openMaps = () => {
        Linking.openURL(item.ufCrm6RoutingRouteYandex)
    };

    const call = () => {
        console.log(creator.PERSONAL_MOBILE)
        Linking.openURL(`tel:${creator.PERSONAL_MOBILE}`)
    };

    return (
        <TouchableOpacity onPress={toggleMore}>
            <View key={item.id} style={styles.listElementContainer}>
                <Text style={styles.Title}>{item.title}</Text>
                <Text style={styles.Text}>Стоимость: {item.cost}</Text>
                {/* <Text style={styles.Text}>Постановщик: {item.responsibleData.NAME} {item.responsibleData.LAST_NAME}</Text> */}
                <CustomModal
                    visible={modalVisible}
                    onClose={toggleMore}
                    title={item.title}
                    marginTOP={0.2}
                    content=
                        {loading?(
                            <View style={styles.containerCentrallityFromUpper}>
                            <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                            </View>
                        ):(
                        <View style={styles.containerCentrallityFromUpper}>
                            <Text style={styles.Text}></Text>
                            <Text style={styles.Title}>{item.title}</Text>
                            <Text style={styles.Text}>Стоимость: {item.cost}</Text>
                            {creator&&<Text style={styles.Text}>Постановщик: {creator.NAME} {creator.LAST_NAME}</Text>}
                            <Text style={styles.Text}>Точек: {item.ufCrm6Upd.length}</Text>
                            <Text style={styles.Text}>дата постановки: {depDate}</Text>
                            <Text style={styles.Text}></Text>
                            {creator&&<TouchableOpacity
                                onPress={() => call()}
                                style={[styles.socialContainer, { backgroundColor: '#8c60c3' }]}
                            >
                                 <View style={{ flexDirection: 'row' }}>
                                    <Icons.mobile height={30} width={40}/>
                                    <Text style={[styles.TitleSocialOnModal,{color:projColors.currentVerse.border}]}>позвонить </Text>
                                </View>
                            </TouchableOpacity>}
                            {item.ufCrm6RoutingRouteYandex&&<TouchableOpacity
                                onPress={() => openMaps()}
                                style={[styles.socialContainer, { backgroundColor: 'white' }]}
                            >
                                 <View style={{ flexDirection: 'row' }}>
                                    <Icons.yandex height={30} width={40}/>
                                    <Text style={[styles.TitleSocialOnModal,{color:projColors.currentVerse.fontAccent}]}>открыть маршрут</Text>
                                </View>
                            </TouchableOpacity>}
                        </View>)
                    }
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    listElementContainer: {
        backgroundColor: projColors.currentVerse.extrasecond,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        gap: 5,
        padding: 23,
    },
    socialContainer: {
        backgroundColor: projColors.currentVerse.redro,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        padding: 9,
        alignItems:'baseline',
        width: '80%'
    },
    TitleSocialOnModal: {
        fontSize: 19,
        fontWeight: 'bold',
        color: projColors.currentVerse.extra,
        textAlign:'center',
        width:'89%'
    },
    Title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: projColors.currentVerse.font,
    },
    Text: {
        fontSize: 16,
        color: projColors.currentVerse.font,
        marginVertical: 5,
    },
    link: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    containerCentrallityFromUpper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ItineraryItems;
