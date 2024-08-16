import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { projColors } from 'src/stores/styles';
import * as Icons from 'src/assets/dosStatuses';
import CustomModal from 'src/components/custom-modal';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput } from 'react-native-paper';
import useNetworkStatus from 'src/hooks/networkStatus/useNetworkStatus';
import { useDocumentHandling } from 'src/hooks/useDocumentHandling';

const StoryItem = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false); // Отображение модального окна
  const isConnected = useNetworkStatus(); // Проверка состояния сети
  const {
    comment,
    setComment,
    rejectStatus,
    setRejectStatus,
    isRejected,
    setRejected,
    acceptAxios,
  } = useDocumentHandling(); // Использование хука для работы с документом

  const toggleModal = () => {
    console.log(item);
    setModalVisible(!modalVisible);
  };

  const handleAcceptPress = async () => {
    if (item.stageId === "DT168_9:UC_YAHBD0" && isConnected) {
      if (rejectStatus.VALUE === "Другое" && !comment) {
        alert("Укажите причину отклонения документа");
        return;
      }
      await acceptAxios(item);
    }
    toggleModal();
  };

  return (
    item.type === "onWork" ? (
      <View key={item.id} style={styles.listElementContainer}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Icons.onWork width={35} height={35} fill={projColors.currentVerse.extra} />
          <Text style={styles.Title}>{item.id}</Text>
        </View>
      </View>
    ) : (
      <TouchableOpacity onPress={toggleModal}>
        <View key={item.ufCrm10ProxyNumber} style={styles.listElementContainer}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            {item.status === 'accept' ? (
              <Icons.accept width={35} height={35} fill="#83AD00" />
            ) : item.status === 'error' ? (
              <Icons.error width={35} height={35} fill="#BB1E2F" />
            ) : (
              <Icons.warning width={35} height={35} fill={projColors.currentVerse.extra} />
            )}
            <View>
              <Text style={styles.Title}>{item.Title}</Text>
              <Text style={styles.Text}>{item.stageId}</Text>
              <Text style={styles.Text}>{item.scanTime}</Text>
            </View>
          </View>
        </View>

        <CustomModal
          visible={modalVisible}
          onClose={toggleModal}
          marginTOP={0.2}
          title={item.Title}
          content={
            <>
              {item.stageId === "DT168_9:UC_YAHBD0" && isConnected && (
                <Dropdown
                  style={styles.dropdown}
                  data={rejectStatuses}
                  labelField="VALUE"
                  valueField="ID"
                  placeholder="Выберите статус"
                  value={rejectStatus?.ID}
                  onChange={async (selectedStatus) => {
                    await setRejectStatus(selectedStatus);
                    setRejected(selectedStatus.VALUE !== "Принято без нареканий");
                    if (selectedStatus.VALUE === "Другое") {
                      setComment('');
                    } else {
                      setComment(selectedStatus.VALUE);
                    }
                  }}
                />
              )}
              {rejectStatus?.VALUE === "Другое" && (
                <TextInput
                  style={styles.input}
                  value={comment}
                  placeholder="Комментарий"
                  onChangeText={setComment}
                  keyboardType="ascii-capable"
                  maxLength={50}
                />
              )}
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{ flex: 1, width: '40%' }}
                  onPress={handleAcceptPress}
                >
                  <View style={{ backgroundColor: '#d2ff41', margin: '10%', padding: 10, alignContent: "center", alignItems: "center", borderRadius: 20 }}>       
                    <Text style={styles.Title}>ОК</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, width: '40%' }}
                  onPress={toggleModal}
                >
                  <View style={{ backgroundColor: '#db6464', margin: '10%', padding: 10, alignContent: "center", alignItems: "center", borderRadius: 20 }}>    
                    <Text style={styles.Title}>Отмена</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          }
        />
      </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
    listElementContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: projColors.currentVerse.light,
    },
    Title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    Text: {
        fontSize: 14,
        color: projColors.currentVerse.dark,
    },
    dropdown: {
        margin: 16,
        height: 50,
        backgroundColor: projColors.currentVerse.light,
        borderRadius: 12,
        padding: 12,
    },
    button: {
        marginTop: 16,
        backgroundColor: projColors.currentVerse.main,
        color: '#FFF',
        padding: 12,
        textAlign: 'center',
        borderRadius: 8,
    },
    input: {
        marginTop: 20,
        width: 300,
        height: 50,
        borderStyle: 'solid',
        borderTopColor: 'red',
        borderTopWidth: 2,
        borderBottomColor: 'red',
        borderBottomWidth: 2,
      },
});

export default StoryItem;