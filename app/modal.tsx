import {View,Text,Modal} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function Modalform() {
  const isPresented = router.canGoBack();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {}} // Мы можем оставить пустую функцию, так как это не обязательно для модальных окон
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        {!isPresented && <Link href="../">Dismiss</Link>}
        <StatusBar style="light" />
        <Text>123123</Text>
      </View>
    </Modal>
  );
}