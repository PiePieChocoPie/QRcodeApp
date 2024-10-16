import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from "src/func/func";
import { projColors } from "src/stores/styles"; // Импортируем projColors

const AttorneysItem = ({ item }) => {
    return (
        <View key={item.ufCrm10ProxyNumber} style={styles.listElementContainer}>
            <Text style={styles.Title}>{item.ufCrm10ProxyNumber}</Text>
            <Text style={styles.Text}>физ.лиц.: {item.ufCrm10ProxyResponsibleText}</Text>
            <Text style={styles.Text}>
                от: {formatDate(item.ufCrm10ProxyDate)}    до: {formatDate(item.ufCrm10ProxyValidityEnd)}
            </Text>
            <View style={{ width: "auto" }}>
                <Text style={styles.sumText}>сумма: {item.ufCrm10ProxySum}</Text>
            </View>
        </View>
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
    sumText: {
        fontSize: 16,
        color: 'green',
        backgroundColor: 'rgba(0, 164, 66, 0.3)',
        paddingVertical: 2,
        paddingHorizontal: 4,
    },
});

export default AttorneysItem;
