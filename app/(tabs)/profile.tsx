import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import { storeAuthStatus } from 'src/secStore';
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";

import { router } from "expo-router";
import Store from "src/stores/mobx";
import { projColors, styles } from "src/stores/styles";

import { useFocusEffect } from '@react-navigation/native';


let userData = '';

function profile() {
    const [userData, setUserdata] = React.useState(null);
    useFocusEffect(
        
        React.useCallback(() => {
            const secName = Store.userData.SECOND_NAME === undefined ? ' ' : Store.userData.SECOND_NAME;
            setUserdata(`${Store.userData.LAST_NAME} ${Store.userData.NAME} ${secName}\n${Store.userData.WORK_POSITION}`);
            return () => {
            };
        }, []) 
    );
    return (
        <View>
            <Text>{userData}</Text>
        </View>
    );

}


export default profile;
