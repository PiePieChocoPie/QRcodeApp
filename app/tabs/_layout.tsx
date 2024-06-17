import { Tabs } from "expo-router"; // Импортируем компонент Layout
import { TouchableOpacity } from "react-native";
import { projColors, styles } from "../styles";
import { View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from "react";
import UserDataDialog from "../Modals/UserDataDialog";

const TabsLayout =()=>{
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <Tabs>
            {/* Используем Layout для настройки headerRight */}
            <Tabs.Screen name="tasks" options={{
                headerTitle:"задачи",
                headerRight:() => {
                    return  <TouchableOpacity style={styles.userB} onPress={toggleModal}>
                        <View style={styles.avatarContainer}>
                            <Icon name="user-o" size={40} color={projColors.currentVerse.font}/>
                        </View>
                        <UserDataDialog visible={modalVisible} onClose={toggleModal}/>
                    </TouchableOpacity>;
                },
            }}>
            
            </Tabs.Screen>
            <Tabs.Screen name="reader" options={{
                headerTitle: "сканер",
                headerRight:() => {
                    return  <TouchableOpacity style={styles.userB} onPress={toggleModal}>
                        <View style={styles.avatarContainer}>
                            <Icon name="user-o" size={40} color={projColors.currentVerse.font}/>
                        </View>
                        <UserDataDialog visible={modalVisible} onClose={toggleModal}/>
                    </TouchableOpacity>;
                },
            }}>
            </Tabs.Screen>
        </Tabs>
    );
}
export default TabsLayout;
