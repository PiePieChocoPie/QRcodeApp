import * as SecureStore from 'expo-secure-store';

export async function storeAuthStatus(value: string): Promise<void> {
    await SecureStore.setItemAsync('authStatus', value)
}

export async function getAuthStatus(): Promise<string | null> {
    return  await SecureStore.getItemAsync('authStatus')
}