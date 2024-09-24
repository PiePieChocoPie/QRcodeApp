import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList, View } from 'react-native';
import ModalForm from "src/modals/newModal";
import { projColors } from 'src/stores/styles'; // Цвета из общего файла стилей
import { getReports } from 'src/requests/timeManagement';
import { usePopupContext } from "src/PopupContext";

const Home = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportKey, setReportKey] = useState(null);
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { showPopup } = usePopupContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReports();
        console.log(response.data);
        setReports(response.data);
      } catch (error) {
        showPopup(`Ошибка:\n${error}`, "error");
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

    return (
      <TouchableOpacity
        key={key}
        style={localStyles.listElementContainer} // Используем стандартный стиль
        onPress={() => onPressReport(key)}
      >
        <Text style={[localStyles.Text, { textAlign: "center" }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={localStyles.container}>
      <FlatList
        data={Object.values(reports)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={1} // Изменяем на 1 столбец для списка
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

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: projColors.currentVerse.main,
    padding: 10,
  },
  listElementContainer: {
    backgroundColor: projColors.currentVerse.listElementBackground,
    borderRadius: 10,
    marginVertical: 5, // Уменьшаем отступы между элементами
    padding: 15, // Уменьшаем внутренний отступ
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60, // Уменьшаем минимальную высоту контейнера
  },
  Text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: projColors.currentVerse.font,
  },
});

export default Home;
