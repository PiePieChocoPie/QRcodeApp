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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
                  {isExpanded ? '▼ ' : '► '}
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
    openExcelFile()
  };
  if (!reportName) {
    return null; 
  }
  const openExcelFile = async () => {
    if (!link) {
      return;
    }

    try {
      const fileUri = `${FileSystem.documentDirectory}yourfile.xlsx`;

      const downloadResumable = FileSystem.createDownloadResumable(
        link,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
      }
    } catch (err) {
      console.error('Произошла ошибка', err);
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
          <View style={styles.selectedItemsContainer}>
            <Text style={styles.selectedItemsTitle}>Выбранные элементы:</Text>
            {selectedItem.slice(0, 3).map(item => (
              <View key={item.GUID || item.ID} style={styles.selectedItemContainer}>
                <Text style={styles.selectedItem}>{item.NAME}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(item.GUID)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Удалить</Text>
                </TouchableOpacity>
              </View>
            ))}
            {selectedItem.length > 5 && (
              <TouchableOpacity style={styles.moreItemsButton}>
                <Text style={styles.moreItemsText}>и еще {selectedItem.length - 5} элементов</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
              onPress={buttonHandler}
              disabled={selectedItem.length === 0}  
              style={[styles.button, { opacity: selectedItem.length === 0 ? 0.5 : 1 }]}
            >
              <Text style={styles.buttonText}>Получить</Text>
          </TouchableOpacity>
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
      }
    />
  );
};
export default ModalForm;