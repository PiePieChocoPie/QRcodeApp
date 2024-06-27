import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, FlatList, Linking} from 'react-native';
import { styles } from 'src/stores/styles';
import CalendarPickerModal from 'src/components/calendarPicker';
import storeInstance from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import CustomModal from 'src/components/custom-modal';
import { getClients, getStorages, getUserStoragesID } from 'src/requests/storages';
import { getReportsTest } from 'src/requests/docs';
import {getHierarchy} from 'src/requests/hierarchy'
import { useFocusEffect } from '@react-navigation/native';

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

const ModalForm = ({ modalVisible, toggleModal, reportName, reports, reportKey }) => {
  const [selectedItem, setSelectedItems] = useState([]);
  const [isMultiSelectVisible, setMultiSelectVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedGuidData, setSelectedGuidData] = useState([]);
  const [hierarchy, setHierarchy] = useState(null);
  const [link, setLink] = useState(null)

  useFocusEffect(
      React.useCallback(() => {
        try {
          const getLocalHierarchy = async () => {
            const hierarchy = await getHierarchy();
            console.log(hierarchy)
            setHierarchy(hierarchy);
          };
          const getUserStorages= async () =>{
            await getUserStoragesID()
          }
          getLocalHierarchy();
          getUserStorages();
        }
        catch (err) {
          console.log((err))
        }
      }, [])
  );



  const handleCloseMultiSelect = () => {
    setMultiSelectVisible(false);
  };

  const handleSelectionChange = async (selectedItems) => {
    setSelectedItems((selectedItem) => {
      return [...selectedItem, ...selectedItems];
    });
    const guids = selectedItems.map(item => item.GUID);
    try {
      const clientsData = await Promise.all(guids.map(guid => getClients(guid)));
      const clients = clientsData.flatMap(response => response.data.body);
      setSelectedGuidData(clients);
      setMultiSelectVisible(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePressGuid = async (guid) => {
    try {
      const response = await getClients(guid);
      setSelectedGuidData(response.data.body);
      setMultiSelectVisible(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRemoveItem = (guid) => {
    setSelectedItems(prevSelectedItems => {
      return prevSelectedItems.filter(item => item.GUID !== guid);
    });
  };

  const buttonHandler = async () => {
    let dateArray = [storeInstance.mainDate, storeInstance.extraDate && storeInstance.extraDate];
    let filterArray = [];

    for (let i = 0; i < selectedItem.length; i++) {
      filterArray.push(selectedItem[i].GUID);
    }

    const jsonBody = {
      "filter": {
         "name": reportName.filters[0].inXml,
        "value": filterArray
      },
      "name": reportKey, // И
      "parameter": {
        "name": reportName.parameters[0].inXml,
        "value": dateArray
      },
      "storageID": storeInstance.userStorageData[0].ID
    };

    console.log(JSON.stringify(jsonBody));
    const response = await getReportsTest(jsonBody);
    setLink(response)
  };
  if (!reportName) {
    return null; 
  }
  const handlePress = () => {
    if (link) {
      Linking.openURL(link).catch((err) => console.error('An error occurred', err));
    }
  };

  return (
    <CustomModal
      visible={modalVisible}
      onClose={toggleModal}
      marginTOP={0.2}
      title={reportName.name}
      content={
        <View style={{width: '100%', flex: 1}}>
          <View style={styles.filterContainer}>
            {reportName.parameters.map((parameter, index) => (
                <View key={index}>
                  <Text style={{fontSize: 16}}>{parameter.view}:</Text>
                  <CalendarPickerModal parameter={parameter.view}/>
                </View>
            ))}
      {link && (
                <Text style={styles.link} onPress={handlePress}>
                Download File
              </Text>
      )}
            {selectedItem.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                  <Text style={styles.selectedItemsTitle}>Выбранные элементы:</Text>
                  {selectedItem.map(item => (
                      <View key={item.GUID || item.ID} style={styles.selectedItemContainer}>
                        <Text style={styles.selectedItem}>{item.NAME}</Text>
                        <TouchableOpacity onPress={() => handleRemoveItem(item.GUID)} style={styles.deleteButton}>
                          <Text style={styles.deleteButtonText}>Удалить</Text>
                        </TouchableOpacity>
                      </View>
                  ))}
                </View>
            )}
            <Text style={styles.Text}>{reportName.filters[0].view}</Text>
            <View style={styles.container2}>
              {hierarchy && (
                  <FlatList
                      data={Object.entries(hierarchy)}
                      renderItem={({item}) => {
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

          <TouchableOpacity onPress={buttonHandler}
                            // disabled={selectedGuidData.length == 0 && selectedItem.length == 0}
                            style={styles.button}>
            <Text style={styles.buttonText}>Получить</Text>
          </TouchableOpacity>

        </View>
      }
    />
  );
};
export default ModalForm;