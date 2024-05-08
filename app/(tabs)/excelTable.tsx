import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Store from 'src/stores/mobx';
import { getTestExcel } from 'src/http';

export default function DownloadFileFromResponse() {
  const [downloadedFilePath, setDownloadedFilePath] = useState(null);

  const downloadFileFromResponse = async () => {
    try {     
        await getTestExcel();
      if (Store.excelBinData) {
        const fileUri = FileSystem.documentDirectory + 'binFile'; // Путь для сохранения файла
        await FileSystem.writeAsStringAsync(fileUri, Store.excelBinData, { encoding: FileSystem.EncodingType.UTF8 });

        setDownloadedFilePath(fileUri);
        console.log('File downloaded successfully:', fileUri);
      } else {
        console.error('Empty response or data');
        Alert.alert('Ошибка', 'Ответ сервера пустой или отсутствуют данные');
      }
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при загрузке файла');
    }
  };

  const openDownloadedFile = async () => {
    if (downloadedFilePath) {
      try {
        // const { type, uri } = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
        // console.log('Got type:', type);
        // console.log('Got URI:', uri);
        // Здесь вы можете выполнить дополнительные действия в зависимости от типа файла и его URI
      } catch (error) {
        console.error('Ошибка при открытии файла:', error);
        Alert.alert('Ошибка', 'Произошла ошибка при открытии файла');
      }
    } else {
      Alert.alert('Предупреждение', 'Файл еще не загружен');
    }
  };

  return (
    <View>
      <Button title="Скачать файл из ответа" onPress={downloadFileFromResponse} />
      {downloadedFilePath && (
        <Button title="Открыть скачанный файл" onPress={openDownloadedFile} />
      )}
    </View>
  );
}
