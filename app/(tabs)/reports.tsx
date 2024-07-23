import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList, View } from 'react-native';
import ModalForm from "src/modals/newModal";
import { styles } from 'src/stores/styles';
import { getReports } from 'src/requests/timeManagement';
import * as Icons from '../../assets/icons'; 
import { usePopupContext } from "src/PopupContext";

const Home = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportKey, setReportKey] = useState(null);
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const {showPopup} = usePopupContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReports();
        console.log(response.data)
        setReports(response.data);
        // console.log('Fetched reports:', response.data);
      } catch (error) {
        showPopup(`Ошибка:\n${error}`, "error")
          console.error('Ошибка:', error);
      }
    };

    fetchData();
  }, []);

  const onPressReport = (key) => {
    const selectedReport = reports[key];
    setReportKey(key);
    setSelectedReport(selectedReport);
    toggleModal();
  };

  const toggleModal = () => {
    
    setModalVisible(!modalVisible);
  };

  const renderItem = ({ item, index }) => {
    const key = Object.keys(reports)[index];
    const Icon = Icons[key];  
    if (!Icon) {
      console.warn(`Icon for key "${key}" not found`);
      return null;
    }
    return (
      <TouchableOpacity
        key={key}
        style={[styles.listElementContainer, { width: "45%", alignContent:"center", alignItems:"center"}]}
        onPress={() => onPressReport(key)}
      >
        <Icon width={50} height={50} />
        <Text style={[styles.Text,{textAlign:"center"}]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginTop:"7%"}}
        data={Object.values(reports)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}  
      />
      <ModalForm
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        reportName={selectedReport}
        reportKey={reportKey}
        reports={reports}
      />
    </View>
  );
};



export default Home;
