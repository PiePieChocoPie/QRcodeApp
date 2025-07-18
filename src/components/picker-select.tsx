import React, { useEffect, useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, TextInput } from 'react-native';
import CustomModal from 'src/components/custom-modal';
import Store from 'src/stores/mobx';


const MultiSelect = ({ jsonData, title, visible, onClose, onSelectionChange }) => {
  // const [modalVisible, setModalVisible] = useState(visible);
  const [items, setItems] = useState(jsonData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(
      items.filter(item => item.NAME.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, items]);

  const toggleItem = (key) => {
    const updatedItems = items.map(item =>
      item.GUID === key || item.ID === key ? { ...item, selected: !item.selected } : item
    );
    setItems(updatedItems);
  };

  const renderItem = useCallback(({ item }) => (
    <MemoizedItem item={item} toggleItem={toggleItem} />
  ), [toggleItem]);

  const selectedItems = items.filter(item => item.selected);
  const displayedItems = selectedItems.slice(-3);
  const additionalCount = selectedItems.length - displayedItems.length;

  const extractGuids = (data) => {
    if (Array.isArray(data)) {
      return data
        .filter(item => item.selected)
        .map(item => {
          if (item.GUID || item.ID) {
            return item.GUID || item.ID;
          } else if (item.PROPERTY_108) {
            const propertyValues = Object.values(item.PROPERTY_108);
            return propertyValues.length > 0 ? propertyValues[0] : undefined;
          }
          return undefined;
        })
        .filter(guid => guid !== undefined);
    }
    return [];
  };

  const handleCloseModal = () => {
    const guids = extractGuids(items);
    Store.setFilterItems(guids);
    onClose()
    if (typeof onSelectionChange === 'function') {
      onSelectionChange(selectedItems);
    }
  };

  return (
    <View style={styles.container}>
      <CustomModal
        visible={visible}
        onClose={handleCloseModal}
        marginTOP={0.24}
        title={title}
        content={
          <View>
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={item => item.GUID || item.ID}
              style={styles.modalContent}
            />
          </View>
        }
      />
    </View>
  );
};

const Item = ({ item, toggleItem }) => (
  <TouchableOpacity
    style={[styles.option, item.selected && styles.selectedOption]}
    onPress={() => toggleItem(item.GUID || item.ID)}
  >
    <Text>{item.NAME}</Text>
  </TouchableOpacity>
);

const MemoizedItem = memo(Item);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', 
  },
  searchInput: { 
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    padding: 10,
    marginBottom: 10,
    height: 50,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1, 
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedItem: {
    backgroundColor: 'lightblue',
    padding: 5,
    margin: 2,
    borderRadius: 5,
    flexGrow: 1
  },
  inputText: {
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
    width: '100%',
  },
  selectedOption: {
    backgroundColor: 'lightblue',
    width: '100%',
  },
  additionalText: {
    backgroundColor: 'lightgray',
    padding: 5,
    margin: 2,
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#333',
  },
});

export default MultiSelect;