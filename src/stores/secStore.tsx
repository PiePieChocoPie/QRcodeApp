import * as SecureStore from 'expo-secure-store';

// Универсальная функция для сохранения данных
async function setItem(key: string, value: any): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }
  
  // Универсальная функция для получения данных
  async function getItem<T>(key: string): Promise<T | null> {
    const result = await SecureStore.getItemAsync(key);
    return result ? JSON.parse(result) : null;
  }

  export async function removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

export async function storeAuthStatus(value: string): Promise<void> {
    await setItem('authStatus', value);
  }
  
  export async function getAuthStatus(): Promise<string | null> {
    return await getItem<string>('authStatus');
  }
