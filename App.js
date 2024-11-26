import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) setIsLoggedIn(true);
    })();
  }, []);

  const handleLogin = async () => {
    const savedUsername = await AsyncStorage.getItem('username');
    const savedPassword = await AsyncStorage.getItem('password');
    if (username === savedUsername && password === savedPassword) {
      setIsLoggedIn(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Nome de usuário ou senha incorretos');
    }
  };

  const handleSignUp = async () => {
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', password);
    setIsSignUp(false);
    setErrorMessage('Conta criada! Faça login.');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const addItem = () => {
    if (item) {
      setItems([...items, item]);
      setItem('');
    }
  };

  const removeItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoggedIn ? (
        <View style={styles.marketContainer}>
          <Text style={styles.title}>Lista de Mercado</Text>
          <TextInput
            style={styles.input}
            placeholder="Adicionar item"
            value={item}
            onChangeText={setItem}
          />
          <TouchableOpacity style={styles.button} onPress={addItem}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
          <ScrollView style={styles.scrollView}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => removeItem(index)}
              >
                <Text style={styles.itemText}>{item}</Text>
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.title}>infinitLIST</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={isSignUp ? handleSignUp : handleLogin}>
            <Text style={styles.buttonText}>{isSignUp ? 'Cadastrar' : 'Login'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.link}>{isSignUp ? 'Voltar ao Login' : 'Criar nova conta'}</Text>
          </TouchableOpacity>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 16,
  },
  formContainer: {
    alignItems: 'center',
  },
  marketContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: 'purple',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    backgroundColor: 'purple',
    padding: 12,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    color: 'blue',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  scrollView: {
    marginTop: 20,
    width: '80%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
  deleteText: {
    fontSize: 16,
    color: 'red',
  },
});
