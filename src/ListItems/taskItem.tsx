import React from "react";
import { View, Text, TouchableOpacity, Linking} from 'react-native';
import Icon3 from 'react-native-vector-icons/Feather';
import { styles } from "src/stores/styles";
import CustomModal from "src/components/custom-modal";

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
        if(modalVisible)
        console.log(item);
    };

    const renderDescription = (description) => {
        const urlRegex = /\[URL=([^\]]+)\]([^\[]+)\[\/URL\]/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = urlRegex.exec(description)) !== null) {
            // console.log(match);
            // console.log(match[1]);
            const beforeText = description.substring(lastIndex, match.index);
            if (beforeText) {
                parts.push(<Text key={`text-${lastIndex}`}>{beforeText}</Text>);
            }
            parts.push(
                <Text key={`link-${match.index}`} style={styles.link} onPress={() => {openURL(match[1]); console.log(match[1])}}>
                    {match[1]}
                </Text>
            );
            lastIndex = match.index + match[0].length;
        }

        const afterText = description.substring(lastIndex);
        if (afterText) {
            parts.push(<Text key={`text-${lastIndex}`}>{afterText}</Text>);
        }

        return parts;
    };

    const openURL = (url) => {
        if (url) {
            console.log(url)
            Linking.openURL(url).catch((err) => {
                console.error("Failed to open URL:", err);
              //  Alert.alert("Ошибка", "Не удалось открыть ссылку. Попробуйте еще раз.");
            });
        } else {
           // Alert.alert("Ошибка", "Некорректный URL.");
        }
    };

    return (
        <TouchableOpacity onPress={toggleMore}>
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
            </View>

            {detailVisible && (
                <View>
                   
                </View>
            )}
            <CustomModal 
                visible={modalVisible}
                onClose={toggleMore} 
                content={
                    <View>
                    <Text style={styles.modalTitle}>{item.title}</Text>
                    <Text style={styles.textProfile}>постановщик:</Text>
                    <Text style={styles.textProfile}>{item.creator.name}</Text>
                    <View style={styles.line} />
                    <Text style={styles.textProfile}>дата постановки: </Text>
                    <Text style={styles.textProfile}>{depDate}</Text>
                    <View style={styles.line} />
                    <Text style={styles.textProfile}>дедлайн: </Text>
                    {item.deadline ? (
                        <Text style={styles.textProfile}>{depDLDate}</Text>
                    ) : (
                        <Text style={styles.textProfile}>не установлен</Text>
                    )}
                    <View style={styles.line} />
                    {item.description ? (
                       <Text style={styles.descriptionText}>{renderDescription(item.description)}</Text>
                    ) : (
                        <Text style={styles.textProfile}>Дополнительная информация отсутствует</Text>
                    )}
                    </View>
                }
            />
        </View>
        </TouchableOpacity>

    );
};

export default TaskItem