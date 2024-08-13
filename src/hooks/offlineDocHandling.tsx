import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNetworkStatus from './networkStatus/useNetworkStatus';

const useProcessPendingDocuments = (processDocument) => {
  const isConnected = useNetworkStatus();
  const [pendingDocuments, setPendingDocuments] = useState([]);

  useEffect(() => {
    // Функция для извлечения и фильтрации документов из AsyncStorage
    const fetchPendingDocuments = async () => {
      try {
        const jsonArray = await AsyncStorage.getItem('documents');
        let documents = jsonArray ? JSON.parse(jsonArray) : [];
        
        // Выборка документов без поля title
        const pending = documents.filter(doc => !doc.title);
        setPendingDocuments(pending);
      } catch (error) {
        console.error('Ошибка при получении документов из AsyncStorage:', error);
      }
    };

    // Функция для обработки документов при подключении к сети
    const processPending = async () => {
      try {
        if (isConnected && pendingDocuments.length > 0) {
          for (const document of pendingDocuments) {
            // Обработка каждого документа
            await processDocument(document);

            // Обновление документа после обработки (например, добавление поля title)
            await updateDocumentInStorage(document.id, { title: 'Processed Title' });
          }

          // Обновление списка ожидающих документов после обработки
          await fetchPendingDocuments();
        }
      } catch (error) {
        console.error('Ошибка при обработке документов:', error);
      }
    };

    fetchPendingDocuments();

    if (isConnected) {
      processPending();
    }
  }, [isConnected, pendingDocuments]);

  // Функция для обновления документа в AsyncStorage
  const updateDocumentInStorage = async (id, updatedFields) => {
    try {
      const jsonArray = await AsyncStorage.getItem('documents');
      let documents = jsonArray ? JSON.parse(jsonArray) : [];

      // Обновление конкретного документа
      documents = documents.map(doc => 
        doc.id === id ? { ...doc, ...updatedFields } : doc
      );

      // Сохранение обновленного массива обратно в AsyncStorage
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
    } catch (error) {
      console.error('Ошибка при обновлении документа в AsyncStorage:', error);
    }
  };

  return { pendingDocuments };
};

export default useProcessPendingDocuments;
