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
    // const localImageUri = await downloadImageToFile(colleague.PERSONAL_PHOTO);

    // if (!localImageUri) {
    //   throw new Error('Failed to download image');
    // }

    const contact = {
        [Contacts.Fields.FirstName]: `${colleague.NAME} ${colleague.SECOND_NAME}`,
        [Contacts.Fields.LastName]: colleague.LAST_NAME,
        // [Contacts.Fields.MiddleName]: colleague.SECOND_NAME,
        [Contacts.Fields.Emails]: [{ label: 'work', email: colleague.EMAIL }],
        [Contacts.Fields.PhoneNumbers]: [
          { label: 'mobile', number: colleague.PERSONAL_MOBILE },
          { label: colleague.UF_PHONE_INNER, number: '+79292692259' }
        ],
        [Contacts.Fields.JobTitle]: colleague.WORK_POSITION,
        // [Contacts.Fields.Company]: 'Мартин Урал', // если доступно
        [Contacts.Fields.Birthday]: { 
            day: new Date(colleague.PERSONAL_BIRTHDAY).getDate(),
            month: new Date(colleague.PERSONAL_BIRTHDAY).getMonth() + 1,
            year: new Date(colleague.PERSONAL_BIRTHDAY).getFullYear()
        },
        [Contacts.Fields.Addresses]: [{
          street: colleague.PERSONAL_STREET,
          city: colleague.PERSONAL_CITY,
          region: colleague.PERSONAL_STATE,
          country: colleague.PERSONAL_COUNTRY,
          postalCode: colleague.PERSONAL_ZIP
        }],
        [Contacts.Fields.UrlAddresses]: [{ label: 'web', url: colleague.PERSONAL_WWW }],
        // [Contacts.Fields.Image]: { uri: localImageUri }
      };
    
      try {
        const contactId = await Contacts.addContactAsync(contact);
        console.log('Contact added:', contactId);
        return '1'
      } catch (error) {
        console.error('Error adding contact:', error);
        return '0'
      }
  }
  
  // Функция для изменения контакта
  async function updateContact(contactId, colleague) {
    const permissionGranted = await requestContactsPermission();
    if (!permissionGranted) return;
    // const localImageUri = await downloadImageToFile(colleague.PERSONAL_PHOTO);

    // if (!localImageUri) {
    //   throw new Error('Failed to download image');
    // }
    const updatedContact = {
      id: contactId, // ID контакта, который нужно обновить
      [Contacts.Fields.FirstName]: `${colleague.NAME} ${colleague.SECOND_NAME}`,
        [Contacts.Fields.LastName]: colleague.LAST_NAME,
        [Contacts.Fields.MiddleName]: ``,
        [Contacts.Fields.Emails]: [{ label: 'work', email: colleague.EMAIL }],
        [Contacts.Fields.PhoneNumbers]: [
          { label: 'mobile', number: colleague.PERSONAL_MOBILE },
          { label: colleague.UF_PHONE_INNER, number: '+79292692259' }
        ],
        [Contacts.Fields.JobTitle]: colleague.WORK_POSITION,
        // [Contacts.Fields.Company]: 'Мартин Урал', // если доступно
        [Contacts.Fields.Birthday]: {
            day: isNaN(new Date(colleague.PERSONAL_BIRTHDAY).getDate()) ? undefined : new Date(colleague.PERSONAL_BIRTHDAY).getDate(),
            month: isNaN(new Date(colleague.PERSONAL_BIRTHDAY).getMonth() + 1) ? undefined : new Date(colleague.PERSONAL_BIRTHDAY).getMonth() + 1,
            year: isNaN(new Date(colleague.PERSONAL_BIRTHDAY).getFullYear()) ? undefined : new Date(colleague.PERSONAL_BIRTHDAY).getFullYear()
        },
        [Contacts.Fields.Addresses]: [{
          street: colleague.PERSONAL_STREET,
          city: colleague.PERSONAL_CITY,
          region: colleague.PERSONAL_STATE,
          country: colleague.PERSONAL_COUNTRY,
          postalCode: colleague.PERSONAL_ZIP
        }],
        [Contacts.Fields.UrlAddresses]: [{ label: 'web', url: colleague.PERSONAL_WWW }],
        // [Contacts.Fields.Image]: { uri: localImageUri }
    };
  
    try {
      await Contacts.updateContactAsync(updatedContact);
      console.log('Contact updated:', contactId);
      return '2'
    } catch (error) {
      console.error('Error updating contact:', error);
      return '0'

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