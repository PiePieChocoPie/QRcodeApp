import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert, Image } from 'react-native';
import { projColors } from "src/stores/styles";
import CustomModal from 'src/components/custom-modal';
import * as Icons from '../../assets';
import * as socialIcons from '../../assets/social';
import { findAndModifyContact } from 'src/contactsHandler';

const ColleaguesItem = ({ item, availableOptions }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const MUPhone='+79292692259';

    const iconMap: { [key: string]: React.ComponentType<any> } = {
        work: socialIcons.work,
        mobile: socialIcons.mobile,
        telegram: socialIcons.telegram,
        skype: socialIcons.skype,
        viber: socialIcons.viber,
        whatsapp: socialIcons.whatsapp,
        vk: socialIcons.vk,
    };

    const call = (url,number) => {
        // //console.log(url, number)
        Linking.openURL(`${url}${number}`)
        // .catch(err => console.error('Failed to open URL:', err)
        // );
    };

    const showPhone = () => {
        Alert.alert('Позвонить по номеру:', item.PERSONAL_MOBILE, [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Звонок', onPress: () => call(`tel:`,`${item.PERSONAL_MOBILE}`), style: 'default' }
        ]);
    };

    const toggleMore = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <TouchableOpacity onPress={toggleMore} onLongPress={showPhone}>
            <View key={item.id} style={[styles.listElementContainer, item.IS_ONLINE == 'Y' && { backgroundColor: projColors.currentVerse.accent }]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.avatarContainer}>
                        {item.PERSONAL_PHOTO ? (
                            <Image source={{ uri: item.PERSONAL_PHOTO }} style={styles.avatar} />
                        ) : (
                            <Icons.plug width={60} height={60}/>
                        )}
                    </View>
                    <View>
                        <Text style={styles.Title}>{item.LAST_NAME} {item.NAME} {item.SECOND_NAME}</Text>
                        {item.UF_PHONE_INNER &&<Text style={styles.Title}>внутренний номер - {item.UF_PHONE_INNER}</Text>}
                        <Text style={styles.Text}>{item.WORK_POSITION}</Text>
                        <Text style={[styles.Title, { color: projColors.currentVerse.extra, fontStyle: 'italic' }]}>{item.PERSONAL_MOBILE}</Text>
                    </View>
                </View>
            </View>
            <CustomModal
                visible={modalVisible}
                onClose={toggleMore}
                title={item.PERSONAL_MOBILE}
                marginTOP={0.2}
                content={
                    <View style={styles.containerCentrallityFromUpper}>
                        <Text style={styles.TitleOnModal}>{`${item.NAME} ${item.SECOND_NAME} ${item.LAST_NAME}`}</Text>

                        <TouchableOpacity onPress={()=>findAndModifyContact(item)}>
                            <View style={styles.avatarContainer}>
                                {item.PERSONAL_PHOTO ? (
                                    <Image source={{ uri: item.PERSONAL_PHOTO }} style={[styles.avatar,{width:140,height:140}]} />
                                ) : (
                                    <Icons.plug width={140} height={140}/>
                                )}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.TextOnModal}>{item.WORK_POSITION}</Text>
                        {item.UF_PHONE_INNER && 
                         <TouchableOpacity
                        onPress={() => call(`tel:`,MUPhone)}
                        style={[styles.socialContainer, { backgroundColor: projColors.currentVerse.redro }]}
                    >
                         <View style={{ flexDirection: 'row' }}>
                            <socialIcons.work height={30} width={40} color={projColors.currentVerse.extrasecond} />
                            <Text style={[styles.TitleSocialOnModal,{color:projColors.currentVerse.main}]}>Рабочий телефон: {item.UF_PHONE_INNER}</Text>
                        </View>
                    </TouchableOpacity>}
                        
                       <View style={{ flex: 1 }}>
                                 {availableOptions.map(option => {
                                const IconComponent = iconMap[option.value];
                                return (
                                    <TouchableOpacity
                                        onPress={() => call(option.url, item.PERSONAL_MOBILE)}
                                        style={[styles.socialContainer, { backgroundColor: option.color }]}
                                        key={option.value}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            {IconComponent && <IconComponent height={30} width={40} backgroundColor={projColors.currentVerse.main} />}
                                            <Text style={[styles.TitleSocialOnModal, { color: projColors.currentVerse.main }]}>{option.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                }
            />
        </TouchableOpacity>
    );
};

// Стили для компонентов
const styles = StyleSheet.create({
    listElementContainer: {
        backgroundColor: projColors.currentVerse.extrasecond,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        gap: 5,
        padding: 13,
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
    Title: {
        flex:1,
        fontSize: 17,
        fontWeight: 'bold',
        color: projColors.currentVerse.extra,
        flexWrap:'wrap',   
        width:'90%'
    },
    TitleOnModal: {
        fontSize: 19,
        fontWeight: 'bold',
        color: projColors.currentVerse.extra,
        flexWrap:'wrap',
        textAlign:'center'
    },
    TitleSocialOnModal: {
        fontSize: 19,
        fontWeight: 'bold',
        color: projColors.currentVerse.extra,
        textAlign:'center',
        width:'89%'
    },
    Text: {
        fontSize: 15,
        color: projColors.currentVerse.extra,
        marginVertical: 5,
        width:'90%'

    },
    TextOnModal: {
        fontSize: 16,
        color: projColors.currentVerse.extra,
        marginVertical: 5,
        textAlign:'center'
    },
    containerCentrallityFromUpper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        // borderWidth: 4,
        // borderColor: projColors.currentVerse.border,
        borderRadius: 100,
        overflow: 'hidden',
        margin:5
        // marginBottom: 16,
        
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 60,
    },
});

export default ColleaguesItem;
