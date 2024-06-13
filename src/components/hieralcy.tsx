import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getClients } from 'src/requests/storages';
import MultiSelect from 'src/components/picker-select';

const data = {
    "РМ00001": {
        "СУП00001": {
            "ТП00001": "ee4874d1-db5d-11e9-8160-e03f4980f4ff",
            "ТП00019": "854c627a-e49c-11ee-8117-ac1f6b727abf",
            "ТП00020": "a0a4e9f0-e49c-11ee-8117-ac1f6b727abf",
            "ТП00094": "107b1237-e769-11ee-8117-ac1f6b727abf"
        },
    },
};

const RecursiveItem = ({ item, expandedItems, setExpandedItems, path, handlePressGuid }) => {
    const handleToggleExpand = (key) => {
        const currentPath = [...path, key].join('/');
        setExpandedItems(prevExpandedItems => {
            if (prevExpandedItems.includes(currentPath)) {
                return prevExpandedItems.filter(item => item !== currentPath);
            } else {
                return [...prevExpandedItems, currentPath];
            }
        });
    };

    if (typeof item === 'object') {
        return (
            <FlatList
                data={Object.entries(item)}
                renderItem={({ item }) => {
                    const currentPath = [...path, item[0]].join('/');
                    const isExpanded = expandedItems.includes(currentPath);
                    return (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity onPress={() => handleToggleExpand(item[0])}>
                                <Text style={styles.itemTitle}>
                                    {isExpanded ? '▼ ' : '► '}
                                    {item[0]}
                                </Text>
                            </TouchableOpacity>
                            {isExpanded && (
                                <RecursiveItem 
                                    item={item[1]} 
                                    expandedItems={expandedItems} 
                                    setExpandedItems={setExpandedItems} 
                                    path={[...path, item[0]]} 
                                    handlePressGuid={handlePressGuid}
                                />
                            )}
                        </View>
                    );
                }}
                keyExtractor={item => item[0]}
            />
        );
    } else {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity onPress={() => handlePressGuid(item)}>
                    <Text style={styles.itemValue}>{item}</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

const App = (onSelectionChange) => {
    const [expandedItems, setExpandedItems] = useState([]);
    const [selectedGuidData, setSelectedGuidData] = useState([]);
    const [isMultiSelectVisible, setMultiSelectVisible] = useState(false);
    const [selectedItem, setSelectedItems] = useState([]);

    const handleCloseMultiSelect = () => {
        setMultiSelectVisible(false);
        if (typeof onSelectionChange === 'function') {
            onSelectionChange(selectedItem);
          }
    };

    const handleSelectionChange = (selectedItems) => {
        setSelectedItems(selectedItems);
    };

    const handlePressGuid = async (guid) => {
        // console.log(guid);
        try {
            const response = await getClients(guid);  
            setSelectedGuidData(response.data.body); 
            setMultiSelectVisible(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={Object.entries(data)}
                renderItem={({ item }) => {
                    const isExpanded = expandedItems.includes(item[0]);
                    return (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity onPress={() => setExpandedItems([item[0]])}>
                                <Text style={styles.itemTitle}>
                                    {isExpanded ? '▼ ' : '► '}
                                    {item[0]}
                                </Text>
                            </TouchableOpacity>
                            {isExpanded && (
                                <RecursiveItem 
                                    item={item[1]} 
                                    expandedItems={expandedItems} 
                                    setExpandedItems={setExpandedItems} 
                                    path={[item[0]]} 
                                    handlePressGuid={handlePressGuid}
                                />
                            )}
                        </View>
                    );
                }}
                keyExtractor={item => item[0]}
            />
            {selectedGuidData.length > 0 && (
                <MultiSelect
                    jsonData={selectedGuidData} 
                    title="Выборка реквизитов" 
                    visible={isMultiSelectVisible}
                    onSelectionChange={handleSelectionChange} 
                    onClose={handleCloseMultiSelect} 
                />
            )}
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
        paddingLeft: 20,
    },
    dataContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    dataTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default App;