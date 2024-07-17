import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

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
      <ScrollView style={styles.scrollContainer}>
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
                    {isExpanded ? '- ' : '+ '}
                    <Text style={styles.itemText}>{key}</Text>
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
      </ScrollView>
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

export const renderRecursiveList = ({ data, expandedItems, setExpandedItems, handlePressGuid }) => {
  return (
    <FlatList
      data={[{ key: 'Выбрать менеджера', value: data }]}
      renderItem={({ item }) => {
        const { key, value } = item;
        const isExpanded = expandedItems.includes(key);
        return (
          <View style={styles.scrollContainer}>
            <TouchableOpacity onPress={() => setExpandedItems(isExpanded ? [] : [key])}>
              <Text style={styles.itemTitle}>
                {isExpanded ? '- ' : '+ '}
                <Text style={styles.itemText}>{key}</Text>
              </Text>
            </TouchableOpacity>
            {isExpanded && (
              <FlatList
                data={Object.entries(value)}
                renderItem={({ item }) => {
                  const [subKey, subValue] = item;
                  const subPath = [key, subKey];
                  const isSubExpanded = expandedItems.includes(subPath.join('/'));
                  return (
                    <View style={styles.itemContainer2}>
                      <TouchableOpacity onPress={() => setExpandedItems(isSubExpanded ? expandedItems.filter(p => p !== subPath.join('/')) : [...expandedItems, subPath.join('/')])}>
                        <Text style={styles.itemTitle}>
                          {isSubExpanded ? '- ' : '+ '}
                          <Text style={styles.itemText}>{subKey}</Text>
                        </Text>
                      </TouchableOpacity>
                      {isSubExpanded && (
                        <RecursiveItem
                          item={subValue}
                          expandedItems={expandedItems}
                          setExpandedItems={setExpandedItems}
                          path={subPath}
                          handlePressGuid={handlePressGuid}
                        />
                      )}
                    </View>
                  );
                }}
                keyExtractor={item => item[0]}
              />
            )}
          </View>
        );
      }}
      keyExtractor={item => item.key}
    />
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1, 
    
  },
  itemContainer2: {
    marginVertical: 5,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderColor: '#ccc',

  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16, // Matching font size to ensure it looks consistent
  },
  itemValue: {
    fontSize: 14,
    paddingLeft: 20,
  },
});

export default RecursiveItem;