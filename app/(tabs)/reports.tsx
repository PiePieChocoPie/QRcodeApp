import { Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import React, { useEffect, useState } from "react";
import { getReports } from "src/http";
import ModalForm from "src/modals/newModal";

const home = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportKey, setReportKey] = useState(null);
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReports();
        setReports(response.data);
        console.log(response.data.storage)
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchData();
  }, []);

  const onPressReport = (Key) => {
    const selectedReport = reports[Key];
    console.log(Key)
    setReportKey(Key)
    setSelectedReport(selectedReport);
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(reports).map((key) => (
        <TouchableOpacity
          key={key}
          style={[styles.tile, styles.shadow]}
          onPress={() => onPressReport(key)}
        >
          <Text style={styles.tileText}>{reports[key].name}</Text>
        </TouchableOpacity>
      ))}
      <ModalForm modalVisible={modalVisible} toggleModal={toggleModal} reportName={selectedReport} reportKey={reportKey}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  tile: {
    width: '45%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileText: {
    fontSize: 16,
  },
  shadow: {
    elevation: 5,
  },
});

export default home;