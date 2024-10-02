import * as Contacts from 'expo-contacts';
import * as FileSystem from 'expo-file-system';


async function requestContactsPermission() {
    const { status } = await Contacts.requestPermissionsAsync();
  
    if (status === 'granted') {
      console.log('Доступ получен');
      return true;
    } else {
      Alert.alert(
        "Приложению необходим доступ к списку контактов",
        "Для работы телефонного справочника необходим доступ к списку контактов."
      );
      return false;
    }
  }

//   async function downloadImageToFile(uri) {
//     try {
//       const fileUri = FileSystem.documentDirectory + 'contact_image.jpg'; // Сохраняем изображение с подходящим расширением
//       await FileSystem.downloadAsync(uri, fileUri);
//       return fileUri;
//     } catch (error) {
//       console.error('Error downloading image:', error);
//       return null;
//     }
//   }

   // Функция для добавления контакта
   async function addContact(colleague) {
    const contact = {
        [Contacts.Fields.FirstName]: `${colleague.NAME} ${colleague.SECOND_NAME}`,
        [Contacts.Fields.LastName]: colleague.LAST_NAME,
        [Contacts.Fields.Emails]: [{ label: 'work', email: colleague.EMAIL }],
        [Contacts.Fields.PhoneNumbers]: [
          { label: 'mobile', number: colleague.PERSONAL_MOBILE },
          { label: colleague.UF_PHONE_INNER, number: '+79292692259' }
        ],
        [Contacts.Fields.JobTitle]: colleague.WORK_POSITION,
        [Contacts.Fields.Addresses]: [{
          street: colleague.PERSONAL_STREET,
          city: colleague.PERSONAL_CITY,
          region: colleague.PERSONAL_STATE,
          country: colleague.PERSONAL_COUNTRY,
          postalCode: colleague.PERSONAL_ZIP
        }],
        [Contacts.Fields.UrlAddresses]: [{ label: 'web', url: colleague.PERSONAL_WWW }]
    };

    // Проверяем корректность даты рождения
    const birthDate = new Date(colleague.PERSONAL_BIRTHDAY);
    if (!isNaN(birthDate.getTime())) { // Проверяем, что дата валидна
        contact[Contacts.Fields.Birthday] = {
            day: birthDate.getDate(),
            month: birthDate.getMonth() + 1, // Месяцы отсчитываются с 0, поэтому +1
            year: birthDate.getFullYear()
        };
    }

    try {
        const contactId = await Contacts.addContactAsync(contact);
        console.log('Contact added:', contactId);
        return '1';
    } catch (error) {
        console.log('Error adding contact:', error);
        return '0';
    }
}

  
  // Функция для изменения контакта
  async function updateContact(contactId, colleague) {
    const updatedContact = {
        id: contactId,
        [Contacts.Fields.FirstName]: `${colleague.NAME} ${colleague.SECOND_NAME}`,
        [Contacts.Fields.LastName]: colleague.LAST_NAME,
        [Contacts.Fields.Emails]: [{ label: 'work', email: colleague.EMAIL }],
        [Contacts.Fields.PhoneNumbers]: [
          { label: 'mobile', number: colleague.PERSONAL_MOBILE },
          { label: colleague.UF_PHONE_INNER, number: '+79292692259' }
        ],
        [Contacts.Fields.JobTitle]: colleague.WORK_POSITION,
        [Contacts.Fields.Addresses]: [{
          street: colleague.PERSONAL_STREET,
          city: colleague.PERSONAL_CITY,
          region: colleague.PERSONAL_STATE,
          country: colleague.PERSONAL_COUNTRY,
          postalCode: colleague.PERSONAL_ZIP
        }],
        [Contacts.Fields.UrlAddresses]: [{ label: 'web', url: colleague.PERSONAL_WWW }]
    };

    // Проверяем корректность даты рождения
    const birthDate = new Date(colleague.PERSONAL_BIRTHDAY);
    if (!isNaN(birthDate.getTime())) { // Проверяем, что дата валидна
        updatedContact[Contacts.Fields.Birthday] = {
            day: birthDate.getDate(),
            month: birthDate.getMonth() + 1,
            year: birthDate.getFullYear()
        };
    }

    try {
        await Contacts.updateContactAsync(updatedContact);
        console.log('Contact updated:', contactId);
        return '2';
    } catch (error) {
        console.log('Error updating contact:', error);
        return '0';
    }
}


  export async function findAndModifyContact(colleague) {
    const permissionGranted = await requestContactsPermission();
    if (!permissionGranted) return;
  
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
    });
    let result;
    if (data.length > 0) {
      const contact = data.find(c => c.phoneNumbers && c.phoneNumbers.some(phone=>phone.number.includes(colleague.PERSONAL_MOBILE)));
      if (contact) {
        // Обновить найденный контакт
        console.log(contact)
        result = await updateContact(contact.id, colleague);
      }
      else{
        //создать новый контакт
        result = await addContact(colleague)
      }
      console.log(result)
      return result
    }
  }