import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import CustomModal from "src/components/custom-modal";
import { projColors } from "src/stores/styles"; // Импортируем projColors

const ItineraryItems = ({ item }) => {
    const [depDate, setDepDate] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    React.useEffect(() => {
        
        const onlyDate = item.createdTime.split('T')[0];
        setDepDate(onlyDate);
    }, [item]);

    const toggleMore = () => {
        setModalVisible(!modalVisible);
    };

    const openURL = (url) => {
        if (url) {
            Linking.openURL(url).catch((err) => {
                console.error("Failed to open URL:", err);
            });
        }
    };
    const getDataAboutItinerary = async() =>{

    }

    return (
        <TouchableOpacity onPress={toggleMore}>
            <View key={item.id} style={styles.listElementContainer}>
                <Text style={styles.Title}>{item.title}</Text>
                <Text style={styles.Text}>Стоимость: {item.cost}</Text>
                <Text style={styles.Text}>Постановщик: {item.responsibleData.NAME} {item.responsibleData.LAST_NAME}</Text>
                <CustomModal
                    visible={modalVisible}
                    onClose={toggleMore}
                    title={item.title}
                    marginTOP={0.2}
                    content={
                        <View style={styles.containerCentrallityFromUpper}>
                            <Text style={styles.Text}></Text>
                            <Text style={styles.Title}>{item.title}</Text>
                            <Text style={styles.Text}>Стоимость: {item.cost}</Text>
                            <Text style={styles.Text}>Постановщик: {item.responsibleData.NAME} {item.responsibleData.LAST_NAME}</Text>
                            <Text style={styles.Text}></Text>
                            <Text style={styles.Text}>дата постановки: {depDate}</Text>
                            <Text style={styles.Text}></Text>
                        </View>
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
