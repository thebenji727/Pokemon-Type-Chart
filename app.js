import { useState } from 'react';
import { Text, View, Picker, StyleSheet } from 'react-native';

const typeChart = {
  Fire: {
    strongAgainst: ['Grass', 'Bug', 'Ice', 'Steel'],
    weakAgainst: ['Water', 'Rock', 'Fire', 'Dragon'],
  },
  Water: {
    strongAgainst: ['Fire', 'Ground', 'Rock'],
    weakAgainst: ['Water', 'Grass', 'Dragon'],
  },
  Grass: {
    strongAgainst: ['Water', 'Ground', 'Rock'],
    weakAgainst: ['Fire', 'Bug', 'Flying', 'Poison', 'Ice'],
  },
  // Adding more types here
};

export default function App() {
  const [selectedType, setSelectedType] = useState('Fire');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pokémon Type Checker</Text>

      <Picker
        selectedValue={selectedType}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setSelectedType(itemValue)}
      >
        {Object.keys(typeChart).map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      <Text style={styles.subheader}>Strong Against:</Text>
      {typeChart[selectedType].strongAgainst.map((type) => (
        <Text key={type} style={styles.text}>{type}</Text>
      ))}

      <Text style={styles.subheader}>Weak Against:</Text>
      {typeChart[selectedType].weakAgainst.map((type) => (
        <Text key={type} style={styles.text}>{type}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
  },
});
