import React from "react";
import { View, Text, TouchableOpacity, Linking} from 'react-native';
import { styles } from "src/stores/styles";
import { formatDate } from "src/func";

const AttorneysItem = ({ item }) => {   
    return (
        <View key={item.ufCrm10ProxyNumber} style={styles.listElementContainer}>            
            <Text style={styles.Title}>{item.ufCrm10ProxyNumber}</Text>            
            <Text style={styles.Text}>физ.лиц.: {item.ufCrm10ProxyResponsibleText}</Text>
            <Text style={styles.Text}>от: {formatDate(item.ufCrm10ProxyDate)}    до: {formatDate(item.ufCrm10ProxyValidityEnd)}</Text>
            <Text style={[styles.Text,{width:"auto",backgroundColor:'rgba(0, 164, 66, 0.3)'}]}>сумма: {item.ufCrm10ProxySum}</Text>
            
        </View>

    );
};

export default AttorneysItem