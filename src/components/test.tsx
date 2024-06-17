import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Sample Data
const data = {
    "Дирекция": {
        "РМ00001": {
            "СУП00001": {
                "ТП00001": "ee4874d1-db5d-11e9-8160-e03f4980f4ff",
                "ТП00002": "fefc75c4-e498-11ee-8117-ac1f6b727abf",
                "ТП00003": "12034845-e499-11ee-8117-ac1f6b727abf",
                "ТП00004": "4326f4f9-e499-11ee-8117-ac1f6b727abf"
            },
            // Other subgroups
        },
        // Other RMs
    }
};

// Recursive component to render nested items
const RecursiveItem = ({ item }) => {
    if (typeof item === 'object') {
        return (
            <FlatList
                data={Object.entries(item)}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>{item[0]}</Text>
                        <RecursiveItem item={item[1]} />
                    </View>
                )}
                keyExtractor={item => item[0]}
            />
        );
    } else {
        return <Text style={styles.itemValue}>{item}</Text>;
    }
};

// Main component to render the top-level data
const App = () => {
    
    return (
        <View style={styles.container}>
            <FlatList
                data={Object.entries(data)}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>{item[0]}</Text>
                        <RecursiveItem item={item[1]} />
                    </View>
                )}
                keyExtractor={item => item[0]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    itemContainer: {
        marginVertical: 5,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderColor: '#ccc',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemValue: {
        fontSize: 14,
    },
});

export default App;