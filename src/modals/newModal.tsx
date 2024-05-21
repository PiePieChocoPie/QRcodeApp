import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { projColors, styles } from 'src/stores/styles';
import CalendarPickerModal from 'src/components/calendarPicker';
import Store from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import ClientSelect from 'src/components/clients-select';
import CustomModal from 'src/components/custom-modal';
import { Button } from 'react-native-paper';
import { getHierarchy, getClients, getStorages } from 'src/http';
import { useFocusEffect } from 'expo-router';

const ModalForm = ({ modalVisible, toggleModal, reportName, reportKey }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isPeriod, setPeriod] = useState(false);




  const ReqReport = async () => {
    const response = await getHierarchy();
    let parameter = isPeriod?[Store.mainDate, Store.extraDate]:[Store.mainDate];
    let jsonBody = {
      name: reportKey,
      filter:{
        value: Store.filterItems,
        name: reportName.filters[0].inXml,
      },
      parameter:{
        name:reportName.parameters[0].inXml,
        value:parameter
      }
    };
    console.log(jsonBody);
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
      content={
        reportName && (
          <View style={{ width: '80%', flex: 1 }}>
            <Text style={styles.modalTitle}>{reportName.name}</Text>
            <View style={styles.filterContainer}>
            <Text>{reportName.filters[0].view}</Text>
            {reportName.filters[0].view === "Склады" ? (
                <MultiSelect jsonData={Store.storages} title={'Выберите склады'}/>
            ) : (
                // <ClientSelect/>
                <MultiSelect jsonData={Store.clients} title={'Выберите клиентов'}/>
            )}

            </View>

            {reportName.parameters.map((parameter, index) => (
              <View key={index}>
                <Text>{parameter.view}:</Text>

                  <CalendarPickerModal parameter={parameter.view}/>


              </View>
            ))}

            <Button onPress={ReqReport}>
              <Text>Запросить отчет</Text>
            </Button>

          </View>
        )
      }
    />
  );
};

export default ModalForm;
