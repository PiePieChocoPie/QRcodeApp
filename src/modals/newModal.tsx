import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import CalendarPickerModal from 'src/components/calendarPicker';
import storeInstance from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import CustomModal from 'src/components/custom-modal';
import Button from 'src/components/button';
import SelectedItemsList from 'src/components/itemlist';
import { getClients, getStorages, getUserStoragesID } from 'src/requests/storages';
import { getReportsTest } from 'src/requests/docs';
import {getHierarchy} from 'src/requests/hierarchy'
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import HierarchyItem from 'src/components/hierarchy';

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
    if (!selectedItem || !Array.isArray(selectedItem)) {
        console.error("selectedItem is not defined or not an array");
        return;
    }
    if (!storeInstance || !storeInstance.mainDate || !storeInstance.userStorageData || storeInstance.userStorageData.length === 0) {
        console.error("storeInstance or its properties are not properly defined");
        return;
    }
    if (!reportName || !reportName.filters || reportName.filters.length === 0 || !reportName.parameters || reportName.parameters.length === 0) {
        console.error("reportName or its properties are not properly defined");
        return;
    }

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
        "name": reportKey,
        "parameter": {
            "name": reportName.parameters[0].inXml,
            "value": dateArray
        },
        "storageID": storeInstance.userStorageData[0].ID
    };

    console.log(JSON.stringify(jsonBody));
    try {
        const response = await getReportsTest(jsonBody);
        setLink(response);
        openExcelFile();
    } catch (error) {
        console.error("Error fetching report:", error);
    }
};

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
            console.error("Sharing is not available");
        }
    } catch (err) {
        console.error('Произошла ошибка', err);
    }
};

if (!reportName) {
    return null;
}

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
          <SelectedItemsList selectedItem={selectedItem} handleRemoveItem={handleRemoveItem} />
          <Button
            title={'Получить отчёт'}
            handlePress={buttonHandler}
          />
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container2: {
    padding: 20,
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
  Text: {
    fontSize: 16,
    color: 'black',
  },
  filterContainer: {
    marginTop: 10,
    borderRadius: 5,
    flex: 1,
  },
  itemValue: {
    fontSize: 14,
    paddingLeft: 20,
  },
});
export default ModalForm;