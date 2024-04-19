import React from "react";
import { View, Text} from 'react-native';
import { styles } from "src/stores/styles";

const calendarItem = ({ item }) => {
    const [detailVisible, setDetailVisible] = React.useState(false);
    const [startTime, setStartTime] = React.useState('');
    const [finishTime, setfinishTime] = React.useState('');
    
    React.useEffect(() => {
        const startOnlyTime = item.workday_date_start.split('T')[1];
        const setableStartTime = startOnlyTime.split('+')[0];
        setStartTime(setableStartTime);
        const finishOnlyTime = item.workday_complete?item.workday_date_finish.split('T')[1].split('+')[0]:'';
        const setableFinishTime = finishOnlyTime.split('+')[0];
        setfinishTime(setableFinishTime);
    }, [item]);

    const toggleMore = () => {
        setDetailVisible(!detailVisible);
    };

    return (
        <View key={item.id} style={styles.taskView}>
            <Text style={{fontSize: 16, textAlign: "center"}}>{item.day_title}</Text>
            <View style={styles.taskInternalView}>
                <View style={styles.internalTextRowView}>
                    <Text>начало дня: </Text>
                    <Text style={{fontSize: 16}}>{startTime}</Text>
                </View>
                {item.workday_complete && <View style={styles.internalTextRowView}>
                    <Text>конец дня: </Text>
                    <Text style={styles.text}>{finishTime}</Text>
                </View>}   
            </View>
        </View>
    );
};

export default calendarItem