import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getHierarchy } from 'src/http';
import CustomModal from 'src/components/custom-modal';
const ClientSelect = () => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.input}>
      </TouchableOpacity>
        <CustomModal
        visible={expanded}
        onClose={() => setExpanded(false)}
        marginTOP={0.6}
        content={
          <View>
            <Text>123123</Text>
          </View>
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

export default ClientSelect;