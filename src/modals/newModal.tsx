import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { projColors, styles } from 'src/stores/styles';
import CalendarPickerModal from 'src/components/calendarPicker';
import Store from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import ClientSelect from 'src/components/clients-select';
import CustomModal from 'src/components/custom-modal';
import { Button } from 'react-native-paper';
import { getHierarchy, getClients, getStorages, getUserStoragesID, getReportsTest } from 'src/http';
import { useFocusEffect } from 'expo-router';

const ModalForm = ({ modalVisible, toggleModal, reportName, reportKey }) => {
  const [isPeriod, setPeriod] = useState(false);



  const ReqReport = async () => {
    // const response = await getHierarchy();
    await getUserStoragesID();
    let parameter = isPeriod?[Store.mainDate.toISOString(), Store.extraDate.toISOString()]:[Store.mainDate.toISOString()];
    console.log(Store.userStorageData)
    let jsonBody = {
      "name": reportKey,
      "storageID": Store.userStorageData[0].ID,
      "filter":{
        "value": Store.filterItems,
        "name": reportName.filters[0].inXml,
      },
      "parameter":{
        "name":reportName.parameters[0].inXml,
        "value":parameter
      }
    };
    console.log(jsonBody);
    getReportsTest(jsonBody);
  };

  useEffect(() => {
    getClients('ee4874d1-db5d-11e9-8160-e03f4980f4ff');
    // console.log(Store.clients)
  }, []);
  useFocusEffect(() => {
    if(reportName)
      {
        setPeriod(reportName.parameters[0].view=="Период")
        // console.log("[hfybkbof =",Object.values(Store.storages.result[0]['PROPERTY_108'])[0])
        // console.log("[hfybkbof =",Store.clients.body||Store.clients.result);
        // console.log("[hfybkbof ==",Store.clients)
      }
      console.log("period ---- ",isPeriod)
      getStorages(Store.userData.UF_USR_STORAGES);
    // console.log(Store.userData.UF_USR_STORAGES)
    // console.log(Store.storages)
  },);
 

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
            <Text style={styles.Text}>{reportName.filters[0].view}</Text>
              <View style={{height: '15%'}}>
              {reportName.filters[0].view === "Склады" ? (
                  <MultiSelect jsonData={Store.storages} title={'Выберите склады'}/>
              ) : (
                  <MultiSelect jsonData={Store.clients} title={'Выберите клиентов'}/>

              )}
              </View>
            </View>

            {reportName.parameters.map((parameter, index) => (
              <View key={index}>
                <Text style={styles.Text}>{parameter.view}:</Text>

                  <CalendarPickerModal parameter={parameter.view}/>


              </View>
            ))}

            <Button onPress={ReqReport}>
              <Text style={[styles.Title]}>Запросить отчет</Text>
            </Button>
          </View>
        )
      }
    />
  );
};

export default ModalForm;
