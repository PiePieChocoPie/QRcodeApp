import {Stack} from "expo-router";
import { RootSiblingParent } from 'react-native-root-siblings';

const RootLayout = () => {
    return (
      
      <RootSiblingParent>
        <Stack>
          <Stack.Screen name={'index'}
          options={{
              headerShown:false,
          }}
          />
          <Stack.Screen name={'(tabs)'}
          options={{
              headerShown:false,
          }}
          />
        </Stack>
      </RootSiblingParent>
    );
};
export default RootLayout;