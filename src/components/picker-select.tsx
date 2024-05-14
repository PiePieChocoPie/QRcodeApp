import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import CustomModal from 'src/components/custom-modal';

const MultiSelect = ({ storages, title }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleItem = (item) => {
    const index = selectedItems.indexOf(item);
    if (index === -1) {
      setSelectedItems([...selectedItems, item]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
        <View style={styles.selectedItemsContainer}>
          {selectedItems.map((item, index) => (
            <Text key={index} style={styles.selectedItem}>{item}</Text>
          ))}
        </View>
        <Text style={styles.inputText}>{selectedItems.length > 0 ? '' : 'Выберите элементы'}</Text>
      </TouchableOpacity>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        content={
          <ScrollView style={styles.modalContent}>
            <Text style={styles.title}> {title}</Text>
            {storages.map((storage, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.option, selectedItems.includes(storage) && styles.selectedOption]}
                onPress={() => toggleItem(storage)}
              >
                <Text>{storage}</Text>
              </TouchableOpacity>
            ))}

          </ScrollView>
        }
      />
    </View>
  );
};

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
    width: '80%'
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: 'lightblue',
    
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