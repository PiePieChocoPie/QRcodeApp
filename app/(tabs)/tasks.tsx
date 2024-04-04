import React from "react";
import {View, Text, TouchableOpacity, Animated, RefreshControl} from 'react-native';
import Icon3 from 'react-native-vector-icons/Feather';
import Store from "../stores/mobx";
import ScrollView = Animated.ScrollView;
import { projColors } from "../styles";
import { getAllStaticData } from "../stores/http";
import { styles } from "../styles";


let fullName = '';
export default function MainPage () {
    const [taskCount] = React.useState(Store.taskData && Store.taskData.length > 0);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);
        // Ваш код обновления данных здесь
        console.log('обновляем')
        await getAllStaticData(Store.tokenData);
        // Завершение обновления
        setRefreshing(false);
    }, []);



    const elements = Store.taskData.map(item => {
        const [detailVisible, setDetailVisible] = React.useState(false);
        const [depDate, setDepDate] = React.useState('');
        const [depDLDate, setDepDLDate] = React.useState('');
        React.useEffect(() => {
            const onlyDate = item.createdDate.split('T')[0]
            setDepDate(onlyDate);
            const onlyDLDate = item.deadline ? item.deadline.split('T')[0] : "не установлен";
            setDepDLDate(onlyDLDate);
        }, [Store.taskData[0]]);
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
                <View style={styles.infoButtonContainer}>
                </View>
        </View>
    );
}

