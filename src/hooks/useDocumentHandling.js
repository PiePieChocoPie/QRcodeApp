import { useState } from 'react';
import Store from 'src/stores/mobx';
import { updAttorneyStatus, updItineraryStatus, updUpdStatus } from 'src/requests/docs';
import useLoading from 'src/hooks/useLoading';
import { usePopupContext } from 'src/hooks/popup/PopupContext';

export const useDocumentHandling = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const { showPopup } = usePopupContext();
  const [comment, setComment] = useState(null);
  const [rejectStatus, setRejectStatus] = useState(null);
  const [isRejected, setRejected] = useState(false);
  const [docNumber, setDocNumber] = useState(0);

  const handleStatusUpdate = async (updateFunc, docData, getNextStatus, statuses) => {
    try {
      startLoading();
      let assignableStatus = getNextStatus(docData, statuses);
      let messageType = 'ufCrm5AcceptComment';
      let alertMes = ':(\nдокумент не был отправлен';

      if (docNumber === 1 && isRejected) {
        assignableStatus = statuses[statuses.length - 1];
        messageType = 'ufCrm5RejectionComment';
      }

      if (assignableStatus.error) {
        alertMes = assignableStatus.error;
        showPopup(alertMes, 'error');
      } else {
        await updateFunc(docData.id, assignableStatus.STATUS_ID, Store.userData.ID, rejectStatus, messageType, comment);
        alertMes = `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${assignableStatus.NAME}:)`;
        showPopup(alertMes, 'success');
      }
    } catch (e) {
      alert(e);
      showPopup(`непредвиденная ошибка:\n${e}`, 'error');
    } finally {
      stopLoading();
    }
  };

  const getNextStatus = (docData, statuses) => {
    if (!docData) return { error: 'Изменение статуса документа невозможно' };
    if (!docData.stageId) return { error: 'Изменение статуса документа невозможно' };

    const curStatus = docData.stageId;

    if (docNumber === 1) {
      for (let i = 0; i < statuses.updStatuses.length; i++) {
        if (statuses.updStatuses[i].STATUS_ID === curStatus && i !== statuses.updStatuses.length - 2) {
          return statuses.updStatuses[i + 1];
        }
      }
    } else if (docNumber === 2 && (docData.ufCrm6Driver == Store.userData.ID || Store.isWarehouse && curStatus === 'DT133_10:PREPARATION')) {
      for (let i = 0; i < statuses.itineraryStatuses.length; i++) {
        if (statuses.itineraryStatuses[i].STATUS_ID === curStatus) {
          return statuses.itineraryStatuses[i + 1];
        }
      }
    } else if (docNumber === 3) {
      let i = statuses.attorneyStatuses.length;
      return statuses.attorneyStatuses[i - 2];
    }

    return { error: 'Изменение статуса документа невозможно' };
  };

  const acceptAxios = async (docData, getNextStatus, statuses) => {
    try {
      startLoading();
      if (docData.entityTypeId === '168') {
        await handleStatusUpdate(updUpdStatus, docData, getNextStatus, statuses);
      } else if (docData.entityTypeId === '133') {
        await handleStatusUpdate(updItineraryStatus, docData, getNextStatus, statuses);
      } else if (docData.entityTypeId === '166') {
        await handleStatusUpdate(updAttorneyStatus, docData, getNextStatus, statuses);
      }
    } catch (e) {
      showPopup(`непредвиденная ошибка:\n${e}`, 'error');
    } finally {
      stopLoading();
    }
  };

  return {
    comment,
    setComment,
    rejectStatus,
    setRejectStatus,
    isRejected,
    setRejected,
    docNumber,
    setDocNumber,
    acceptAxios,
    getNextStatus,
    handleStatusUpdate,
  };
};
