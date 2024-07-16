import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const SelectedItemsList = ({ selectedItem, handleRemoveItem }) => {
  return (
    <View style={styles.selectedItemsContainer}>
      <Text style={styles.selectedItemsTitle}>Выбранные элементы:</Text>
      <FlatList
        data={selectedItem}
        keyExtractor={item => item.GUID || item.ID}
        renderItem={({ item }) => (
          <View style={styles.selectedItemContainer}>
            <Text style={styles.selectedItem} numberOfLines={1} ellipsizeMode="tail">{item.NAME}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item.GUID)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ maxHeight: 200 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectedItemsContainer: {
    padding: 10,
  },
  selectedItemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default SelectedItemsList;