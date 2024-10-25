import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { projColors } from 'src/stores/styles';

const Button = ({ handlePress, title, disabled = false, icon = null, backgroundColor = null, fontColor=null }) => {
  return (
    <Pressable 
      disabled={disabled} 
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ?  projColors.currentVerse.extra : backgroundColor ? backgroundColor : projColors.currentVerse.redro,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.8 : 1, // Эффект нажатия
        },
      ]}
    >
      <View style={styles.buttonContent}>
        {title && (
          <Text style={[styles.buttonText,{
            color:fontColor? fontColor:projColors.currentVerse.main
        }]}>{title}</Text>
        )}
        {icon && (
          <Icon name={icon} size={20} color={projColors.currentVerse.main} style={styles.icon} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 40, // Более округлые углы
    marginVertical: 10,
    // marginHorizontal: 20,
    paddingVertical: 15, // Высота кнопки
    paddingHorizontal: 25, // Горизонтальные отступы
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowColor: '#000', // Эффект тени
  },
  buttonContent: {
    flexDirection: 'row', // Расположение текста и иконки
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: projColors.currentVerse.main, // Белый текст
    fontSize: 18, // Размер текста
    fontWeight: 'bold', // Жирный текст
    textAlign: 'center',
    marginRight: 10, // Отступ между текстом и иконкой
  },
  icon: {
    marginLeft: 5, // Отступ для иконки
  },
});

export default Button;