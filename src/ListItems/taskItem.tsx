import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import CustomModal from "src/components/custom-modal";
import { formatDate } from "src/scripts/attorneyScripts";
import { projColors } from "src/stores/styles"; // Импортируем projColors

const TaskItem = ({ item }) => {
    const [detailVisible, setDetailVisible] = React.useState(false);
    const [depDate, setDepDate] = React.useState('');
    const [depDLDate, setDepDLDate] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [linkFromTask, setLink] = React.useState('');

    React.useEffect(() => {
        const onlyDate = item.createdDate.split('T')[0];
        setDepDate(onlyDate);
        const onlyDLDate = item.deadline ? item.deadline.split('T')[0] : "не установлен";
        setDepDLDate(onlyDLDate);
    }, [item]);

    const toggleMore = () => {
        setModalVisible(!modalVisible);
    };

    const renderDescription = (description) => {
        let match = -1;
        let linkEnd = 0;
        const target = "[URL=";
        if ((description.indexOf(target, match + 1)) === -1) return description;
        const parts = [];
        while ((match = description.indexOf(target, match + 1)) !== -1) {
            if (match > 0) {
                let preLink = description.slice(linkEnd, match ? match : description.length);
                parts.push(<Text key={`text-${match}`}>{preLink}</Text>);
            }
            linkEnd = description.indexOf("]", match);
            let link = description.slice(match + 5, linkEnd);
            parts.push(
                <Text
                    key={`link-${match}`}
                    style={styles.link}
                    onPress={() => {
                        openURL(link);
                    }}
                >
                    {link}
                </Text>
            );
            linkEnd = description.indexOf('[/URL]', linkEnd) + 6;
        }
        return parts;
    };

    const openURL = (url) => {
        if (url) {
            Linking.openURL(url).catch((err) => {
                console.error("Failed to open URL:", err);
            });
        }
    };

    return (
        <TouchableOpacity onPress={toggleMore}>
            <View key={item.id} style={styles.listElementContainer}>
                <Text style={styles.Title}>{item.title}</Text>
                <Text style={styles.Text}>постановщик: {item.creator.name}</Text>
                <Text style={styles.Text}>дата постановки: {item.createdDate}</Text>
                {item.deadline ? (
                    <Text style={[styles.Text, { color: '#DE283B' }]}>дедлайн: {item.deadline}</Text>
                ) : (
                    <Text style={styles.Text}>дедлайн: не установлен</Text>
                )}

                {detailVisible && (
                    <View>
                        {/* Дополнительные детали, если необходимо */}
                    </View>
                )}
                <CustomModal
                    visible={modalVisible}
                    onClose={toggleMore}
                    title={item.title}
                    marginTOP={0.2}
                    content={
                        <View style={styles.containerCentrallityFromUpper}>
                            <Text style={styles.Text}></Text>
                            <Text style={styles.Text}>постановщик: {item.creator.name}</Text>
                            <Text style={styles.Text}></Text>
                            <Text style={styles.Text}>дата постановки: {depDate}</Text>
                            <Text style={styles.Text}></Text>
                            {item.deadline ? (
                                <Text style={[styles.Text, { color: '#DE283B' }]}>дедлайн: {depDLDate}</Text>
                            ) : (
                                <Text style={styles.Text}>дедлайн: не установлен</Text>
                            )}
                            <Text style={styles.Text}></Text>
                            {item.description ? (
                                <Text style={styles.Text}>{renderDescription(item.description)}</Text>
                            ) : (
                                <Text style={styles.Text}>Дополнительная информация отсутствует</Text>
                            )}
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

export default TaskItem;
