import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { projColors } from "src/stores/styles"; // Импортируем projColors
import CustomModal from 'src/components/custom-modal';
import Icon from 'react-native-vector-icons/FontAwesome6'
import { Colors } from 'react-native/Libraries/NewAppScreen';
const colleaguesItem = ({ item }) => {
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    useEffect(() => {
        // Проверка доступности приложений для звонков
        const checkAvailability = async () => {
            const options = [{ label: 'Мобильный звонок', value: 'mobile' }];
            const messengers = [
                { name: 'Telegram', url: `tg://msg?text=&to=${item.PERSONAL_MOBILE}`, value: '0', color:'#2c7bf2'},
                { name: 'VK', url: `vk://vk.com/write${item.PERSONAL_MOBILE}`, value: '1', color:'#0831ff' },
                { name: 'WhatsApp', url: `whatsapp://send?phone=${item.PERSONAL_MOBILE}`, value: '2', color:'#12ad03' },
                { name: 'Viber', url: `viber://contact?number=${item.PERSONAL_MOBILE}`, value: '3', color:'#a008ff' },
                { name: 'Skype', url: `skype:${item.PERSONAL_MOBILE}?call`, value: '4', color:'#1ebbeb' },
            ];

            for (const messenger of messengers) {
                const supported = await Linking.canOpenURL(messenger.url);
                if (supported) {
                    options.push({ label: messenger.name, value: messenger.value });
                }
            }

            setAvailableOptions(options);
            setSelectedOption(options[0].value);
        };

        checkAvailability();
    }, [item.PERSONAL_MOBILE]);

    const call = () => {
        const option = availableOptions.find(opt => opt.value === selectedOption);

        if (option && option.value === 'mobile') {
            Linking.openURL(`tel:${item.PERSONAL_MOBILE}`).catch(err =>
                console.error('Failed to make mobile call:', err)
            );
        } else if (option) {
            Linking.openURL(option.url).catch(err =>
                console.error(`Failed to open ${option.label}:`, err)
            );
        }
    };
     const showPhone = () => {
        const option = availableOptions.find(opt => opt.value === selectedOption);

        if (option && option.value === 'mobile') {
            Linking.openURL(`tel:${item.PERSONAL_MOBILE}`).catch(err =>
                console.error('Failed to make mobile call:', err)
            );
        } else if (option) {
            Linking.openURL(option.url).catch(err =>
                console.error(`Failed to open ${option.label}:`, err)
            );
        }
    };

    const toggleMore = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <TouchableOpacity onPress={call} onLongPress={showPhone}>
            <View key={item.id} style={[styles.listElementContainer, item.IS_ONLINE == 'Y' && { backgroundColor: "#f7f9f7" }]}>
                <Text style={styles.Title}>{item.NAME} {item.LAST_NAME}</Text>
                <View style={{flexDirection: 'row'}}>
                <Text style={styles.Text}>{item.WORK_POSITION}</Text>
                <Text style={styles.Text}>{item.PERSONAL_MOBILE}</Text>
                </View>
                <CustomModal
                    visible={modalVisible}
                    onClose={toggleMore}
                    title={item.title}
                    marginTOP={0.2}
                    content={
                        <View style={styles.containerCentrallityFromUpper}>
                            <Text style={styles.Title}>{item.NAME} {item.LAST_NAME}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.Text}>{item.WORK_POSITION}</Text>
                                <Text style={styles.Text}>{item.PERSONAL_MOBILE}</Text>
                                <View style={{ flex: 1 }}>
                                    {availableOptions.map(option => <View style={[styles.listElementContainer,{flexDirection:'row'}]} key = {option.name}>
                                        <Icon name={option.value} size={20} color={option.color}/>
                                        <Text style={styles.Title}>{option.name}</Text>
                                        </View>
                                        )}
                                </View>
                            </View>
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
    containerCentrallityFromUpper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default colleaguesItem;
