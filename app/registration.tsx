import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Для иконки глаз (показать/скрыть пароль)

const RegistrationForm = () => {
  // State для полей ввода
  const [phone, setPhone] = useState('');  // Номер телефона
  const [lastName, setLastName] = useState('');  // Фамилия
  const [firstName, setFirstName] = useState('');  // Имя
  const [password, setPassword] = useState('');  // Пароль

  // State для видимости пароля
  const [showPassword, setShowPassword] = useState(false);  // Флаг для показа/скрытия пароля

  // State для управления отправкой формы
  const [isSubmitting, setIsSubmitting] = useState(false);  // Флаг отправки формы

  // Функция для переключения видимости пароля
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Обработка отправки формы
  const handleSubmit = () => {
    setIsSubmitting(true);  // Отметим, что форма отправляется
    // Здесь можно добавить валидацию и логику отправки данных на сервер
    console.log({ phone, lastName, firstName, password });
    // После завершения процесса можно сбросить состояние
    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      {/* Логотип */}
      <View style={styles.logoContainer}>
        <Ionicons name="qr-code-outline" size={48} color="#A6210F" />
        <Text style={styles.logoText}>Mu Tools</Text>
      </View>

      {/* Заголовок */}
      <Text style={styles.title}>Зарегистрироваться</Text>

      {/* Поле ввода телефона */}
      <TextInput
        style={styles.input}
        placeholder="Номер телефона"
        value={phone}
        onChangeText={(text) => setPhone(text)}  // Обновляем state при изменении текста
        keyboardType="email-address"
        placeholderTextColor="#BFBFBF"
      />

      {/* Поле ввода фамилии */}
      <TextInput
        style={styles.input}
        placeholder="Введите вашу фамилию"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        placeholderTextColor="#BFBFBF"
      />

      {/* Поле ввода имени */}
      <TextInput
        style={styles.input}
        placeholder="Введите ваше имя"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        placeholderTextColor="#BFBFBF"
      />

      {/* Поле ввода пароля с кнопкой для показа/скрытия */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword}  // Показываем пароль или нет в зависимости от флага
          placeholderTextColor="#BFBFBF"
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Кнопка регистрации */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit}
        disabled={isSubmitting}  // Отключаем кнопку, если форма отправляется
      >
        <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>

      {/* Ссылка на логин */}
      <TouchableOpacity>
        <Text style={styles.linkText}>Есть аккаунт?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A6210F',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#A6210F',
    borderRadius: 8,
    marginBottom: 16,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  linkText: {
    color: '#A6210F',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default RegistrationForm;
