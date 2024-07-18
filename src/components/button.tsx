import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const Button = ({ handlePress, title, disabled = false}) => {
  return (
    <Pressable disabled = {disabled} style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Button;