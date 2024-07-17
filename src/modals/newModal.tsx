import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import CalendarPickerModal from 'src/components/calendarPicker';
import storeInstance from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import CustomModal from 'src/components/custom-modal';
import Button from 'src/components/button';
import SelectedItemsList from 'src/components/itemlist';
import { getClients, getStorages, getUserStoragesID } from 'src/requests/storages';
import { getReportsTest } from 'src/requests/docs';
import { getHierarchy } from 'src/requests/hierarchy';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { renderRecursiveList } from 'src/components/RecursiveItem';  

const ModalForm = ({ modalVisible, toggleModal, reportName, reports, reportKey }) => {
  const [selectedItem, setSelectedItems] = useState([]);
  const [isMultiSelectVisible, setMultiSelectVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedGuidData, setSelectedGuidData] = useState([]);
  const [hierarchy, setHierarchy] = useState(null);
  const [link, setLink] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const getLocalHierarchy = async () => {
        try {
          const hierarchy = await getHierarchy();
          setHierarchy(hierarchy);
        } catch (err) {
          console.log(err);
        }
      };

      const getUserStorages = async () => {
        try {
          await getUserStoragesID();
        } catch (err) {
          console.log(err);
        }
      };

      getLocalHierarchy();
      getUserStorages();
    }, [])
  );

  const handleCloseMultiSelect = () => {
    setMultiSelectVisible(false);
  };

  const handleSelectionChange = async (selectedItems) => {
    setSelectedItems((prevSelectedItems) => [...prevSelectedItems, ...selectedItems]);
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
    setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item.GUID !== guid));
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
    let filterArray = selectedItem.map(item => item.GUID);

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
        <View style={{ width: '100%', flex: 1 }}>
          <View style={styles.filterContainer}>
            {reportName.parameters.map((parameter, index) => (
              <View key={index}>
                <Text style={{ fontSize: 16 }}>{parameter.view}:</Text>
                <CalendarPickerModal parameter={parameter.view} />
              </View>
            ))}
            <SelectedItemsList selectedItem={selectedItem} handleRemoveItem={handleRemoveItem} />
            <Button
              title={'butt'}
              handlePress={buttonHandler}
            />
            <Text style={styles.Text}>{reportName.filters[0].view}</Text>
            <View style={styles.container2}>
              {hierarchy && renderRecursiveList({
                  data: hierarchy,
                  expandedItems,
                  setExpandedItems,
                  handlePressGuid
                })}
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