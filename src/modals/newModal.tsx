import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { projColors, styles } from 'src/stores/styles';
import CalendarPickerModal from 'src/components/calendarPicker';
import Store from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import ClientSelect from 'src/components/clients-select';
import CustomModal from 'src/components/custom-modal';
import App from 'src/components/hieralcy';
import { useFocusEffect } from 'expo-router';
import { getClients, getStorages, getUserStoragesID } from 'src/requests/storages';
import { getReportsTest } from 'src/requests/docs';


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
                      <View style={styles.itemContainer2}>
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
          <View style={styles.itemContainer2}>
              <TouchableOpacity onPress={() => handlePressGuid(item)}>
                  <Text style={styles.itemValue}>{item}</Text>
              </TouchableOpacity>
          </View>
      );
  }
};

const ModalForm = ({ modalVisible, toggleModal, reportName, reportKey }) => {
  const [isPeriod, setPeriod] = useState(false);
  const [selectedItem, setSelectedItems] = useState([]);
  const [isMultiSelectVisible, setMultiSelectVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedGuidData, setSelectedGuidData] = useState([]);

  const handleOpenMultiSelect = () => {
    setMultiSelectVisible(true);
  };

  const handleCloseMultiSelect = () => {
    setMultiSelectVisible(false);
  };


  const handleSelectionChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  useFocusEffect(() => {
    if(reportName)
      {
        setPeriod(reportName.parameters[0].view=="Период")
      }
      console.log("period ---- ",isPeriod)
      getStorages(Store.userData.UF_USR_STORAGES);
  },);
 
  const handlePressGuid = async (guid) => {
    console.log(guid);
    try {
        const response = await getClients(guid);  
        setSelectedGuidData(response.data.body); 
        setMultiSelectVisible(true);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
  return (
    <CustomModal
      visible={modalVisible}
      onClose={toggleModal}
      marginTOP={0.2}
      content={
        reportName && (
          <View style={{ width: '80%', flex: 1,}}>
            <Text style={styles.Title}>{reportName.name}</Text>
            <View style={styles.filterContainer}>
            {reportName.parameters.map((parameter, index) => (
              <View key={index}>
                <Text style={styles.Text}>{parameter.view}:</Text>

                  <CalendarPickerModal parameter={parameter.view}/>


              </View>
            ))}
            <Text style={styles.Text}>{reportName.filters[0].view}</Text>
              <View style={styles.container2}>

              <FlatList
                data={Object.entries(data)}
                renderItem={({ item }) => {
                    const isExpanded = expandedItems.includes(item[0]);
                    return (
                        <View style={styles.itemContainer2}>
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
                {selectedItem.length > 0 && (
                  <View style={styles.selectedItemsContainer}>
                    <Text style={styles.selectedItemsTitle}>Выбранные элементы:</Text>
                    {selectedItem.map(item => (
                      <Text key={item.GUID || item.ID} style={styles.selectedItem}>
                        {item.NAME}
                      </Text>
                ))}

                </View>
              )}

              </View>
            </View>
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
        )
      }
    />
  );
};

export default ModalForm;
