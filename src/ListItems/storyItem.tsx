import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from "src/func";
import { projColors } from "src/stores/styles";
import * as Icons from '../../assets/dosStatuses';
const AttorneysItem = ({ item }) => 
{
    return (
        (item.type=="onWork" ? 
        <View key={item.id} style={styles.listElementContainer}>
            <View style={{flexDirection:"row", flex:1}}>
                <Icons.onWork width={35} height={35} fill={projColors.currentVerse.extra} />
                <Text style={styles.Title}>{item.id}</Text>
            </View>
        </View>:
        <View key={item.ufCrm10ProxyNumber} style={styles.listElementContainer}>
                <View style={{flexDirection:"row", flex:1}}>
                    {item.status === 'accept' ? (
                        <Icons.accept width={35} height={35} fill="#83AD00"/>
                    ) : item.status === 'error' ? (
                        <Icons.error width={35} height={35} fill="#BB1E2F" />
                    ) : (
                        <Icons.warning width={35} height={35} fill={projColors.currentVerse.extra} />
                    )}
                    <View>
                        <Text style={styles.Title}>{item.Title}</Text>
                        <Text style={styles.Text}>{item.stageId}</Text> 
                        <Text style={styles.Text}>{item.scanTime}</Text> 
                    </View>
                </View>
            </View>
            )
        
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
    }
});

export default AttorneysItem;
