import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNetworkStatus from './networkStatus/useNetworkStatus';
import { getDataAboutDocs, getUpdRejectStatuses } from 'src/requests/docs';
import Store from "src/stores/mobx";
import { useDocumentHandling } from './useDocumentHandling';
import { usePopupContext } from './popup/PopupContext';

const useProcessPendingDocuments = (processDocument) => {
  const isConnected = useNetworkStatus();
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [rejectStatuses, setRejectStatuses] = useState([]);
  const [rejectStatus, setRejectStatus] = useState(null); 
  const { showPopup } = usePopupContext();
  const { docNumber, setDocNumber, acceptAxios } = useDocumentHandling();

  useEffect(() => {
    const fetchRejectStatuses = async () => {
      const statuses = await getUpdRejectStatuses();
      setRejectStatuses(statuses);
      setRejectStatus("Принято без нареканий");
    };
    fetchRejectStatuses();
  }, []);

  useEffect(() => {
    const fetchPendingDocuments = async () => {
      try {
        const jsonArray = await AsyncStorage.getItem('documents');
        let documents = jsonArray ? JSON.parse(jsonArray) : [];

        const pending = documents.filter(doc => !doc.title);
        setPendingDocuments(pending);
      } catch (error) {
        console.error('Ошибка при получении документов из AsyncStorage:', error);
      }
    };

    const processPending = async () => {
      try {
        if (isConnected && pendingDocuments.length > 0) {
          for (const document of pendingDocuments) {
            let splitedId = JSON.stringify(document.id_time).split('_');
            let docId = splitedId[0];
            const res = await getDataAboutDocs(docId); 
            if (res && res.result && Array.isArray(res.result.items) && res.result.items.length > 0) {
              const item = res.result.items[0];
              setDocNumber(item.entityTypeId === "168" ? 1 : item.entityTypeId === "133" ? 2 : 3);

              Store.setUpdData(item);
              await processDocument(document);
              await updateDocumentInStorage(document.id, { title: 'Processed Title' });
            } else {
              showPopup('Документ не найден', 'warning');
            }
          }
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

  const updateDocumentInStorage = async (id, updatedFields) => {
    try {
      const jsonArray = await AsyncStorage.getItem('documents');
      let documents = jsonArray ? JSON.parse(jsonArray) : [];

      documents = documents.map(doc => doc.id === id ? { ...doc, ...updatedFields } : doc);

      await AsyncStorage.setItem('documents', JSON.stringify(documents));
    } catch (error) {
      console.error('Ошибка при обновлении документа в AsyncStorage:', error);
    }
  };

  return { pendingDocuments };
};

export default useProcessPendingDocuments;
