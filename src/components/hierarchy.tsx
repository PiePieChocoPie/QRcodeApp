import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from "src/stores/styles"; // Предполагается, что styles и projColors не используются в данном компоненте

const RecursiveItem = ({ item, expandedItems, setExpandedItems, path, handlePressGuid }) => {
  const handleToggleExpand = (key, value) => {
    const currentPath = [...path, key].join('/');
    if (typeof value === 'string') {
      handlePressGuid(value);
    } else {
      setExpandedItems(prevExpandedItems => {
        if (prevExpandedItems.includes(currentPath)) {
          return prevExpandedItems.filter(item => item !== currentPath);
        } else {
          return [...prevExpandedItems, currentPath];
        }
      });
    }
  };
  
  if (typeof item === 'object') {
    return (
      <FlatList
        data={Object.entries(item)}
        renderItem={({ item }) => {
          const [key, value] = item;
          const currentPath = [...path, key].join('/');
          const isExpanded = expandedItems.includes(currentPath);
          return (
            <View style={styles.itemContainer2}>
              <TouchableOpacity onPress={() => handleToggleExpand(key, value)}>
                <Text style={styles.itemTitle}>
                  {isExpanded ? '+ ' : '- '}
                  {key}
                </Text>
              </TouchableOpacity>
              {isExpanded && typeof value !== 'string' && (
                <RecursiveItem 
                  item={value} 
                  expandedItems={expandedItems} 
                  setExpandedItems={setExpandedItems} 
                  path={[...path, key]} 
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
      <View style={styles.itemContainer2}>
        <TouchableOpacity onPress={() => handlePressGuid(item)}>
          <Text style={styles.itemValue}>Выбрать клиентов</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const ItemList = ({ hierarchy, expandedItems, setExpandedItems, path, handlePressGuid }) => {
  return (
    <FlatList
    data={Object.entries(hierarchy)}
    renderItem={({item}) => {
      const isExpanded = expandedItems.includes(item[0]);
      return (
          <View style={styles.itemContainer2}> 
            <TouchableOpacity onPress={() => setExpandedItems([item[0]])}>
              <Text style={styles.itemTitle}>
                {isExpanded ? '+ ' : '- '}
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
  );
};

export default ItemList;