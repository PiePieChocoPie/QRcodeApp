import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { projColors, styles } from "../styles";
import { View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from "react";
import UserDataDialog from "../Modals/UserDataDialog";

const TabsLayout =()=>{
    const [modalVisible, setModalVisible] = useState(false);
    // const [photoUrl, setPhotoUrl] = useState('');


    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return <Tabs>
        <Tabs.Screen name="tasks" options={{
            headerTitle:"задачи",
            headerRight(props) {
                return  <TouchableOpacity style={styles.userB} onPress={toggleModal}>
                <View style={styles.avatarContainer}>
                    {/* {photoUrl ? (
                        <Image source={{ uri: photoUrl }} style={styles.avatar} />
                    ) : ( */}
                        <Icon name="user-o" size={40} color={projColors.currentVerse.font}/>
                    {/* )} */}
                </View>
            </TouchableOpacity>;
            },
        }}/>
        <Tabs.Screen name="reader" options={{
            headerTitle: "сканер",
        }}/>
            <UserDataDialog visible={modalVisible} onClose={toggleModal}/>
    </Tabs>
}
export default TabsLayout;