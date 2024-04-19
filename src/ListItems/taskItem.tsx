import React from "react";
import { View, Text, TouchableOpacity} from 'react-native';
import Icon3 from 'react-native-vector-icons/Feather';
import { styles } from "src/stores/styles";

const TaskItem = ({ item }) => {
    const [detailVisible, setDetailVisible] = React.useState(false);
    const [depDate, setDepDate] = React.useState('');
    const [depDLDate, setDepDLDate] = React.useState('');
    
    React.useEffect(() => {
        const onlyDate = item.createdDate.split('T')[0];
        setDepDate(onlyDate);
        const onlyDLDate = item.deadline ? item.deadline.split('T')[0] : "не установлен";
        setDepDLDate(onlyDLDate);
    }, [item]);

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
    );
};

export default TaskItem