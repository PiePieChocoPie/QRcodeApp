import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Button = ({ handlePress, title, disabled = false, icon=null }) => {
  return (
    <Pressable 
      disabled={disabled} 
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { 
          backgroundColor: disabled ? '#D3D3D3' : '#DE283B',
          transform: [{ scale: pressed ? 0.98 : 1 }],
        }
      ]}
    >
      <View style={styles.buttonContent}>
        {title && (
        <Text style={styles.buttonText}>{title}</Text>
        )}
        { icon && (
          <Icon name={icon} size={30} color={'#FFFFFF'} />
        )
        }
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal:20,
    paddingVertical: 5,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonContent: {
    borderRadius: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Button;