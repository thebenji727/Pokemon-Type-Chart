import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

//Coding the type chart
const typeChart = {
  Normal: { strongAgainst: [], weakAgainst: ["Rock", "Steel", "Ghost"], weakTo: ["Fighting"], resistances: [], immunities: ["Ghost"] },
  Fire: { strongAgainst: ["Grass", "Bug", "Ice", "Steel"], weakAgainst: ["Fire", "Water", "Rock", "Dragon"], weakTo: ["Water", "Rock", "Ground"], resistances: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"], immunities: [] },
  Water: { strongAgainst: ["Fire", "Ground", "Rock"], weakAgainst: ["Water", "Grass", "Dragon"], weakTo: ["Grass", "Electric"], resistances: ["Fire", "Water", "Ice", "Steel"], immunities: [] },
  Grass: { strongAgainst: ["Water", "Ground", "Rock"], weakAgainst: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"], weakTo: ["Bug", "Fire", "Flying", "Poison", "Ice"], resistances: ["Water", "Electric", "Grass", "Ground"], immunities: [] },
  Electric: { strongAgainst: ["Water", "Flying"], weakAgainst: ["Electric", "Grass", "Dragon", "Ground"], weakTo: ["Ground"], resistances: ["Electric", "Flying", "Steel"], immunities: [] },
  Ice: { strongAgainst: ["Grass", "Ground", "Flying", "Dragon"], weakAgainst: ["Fire", "Water", "Ice", "Steel"], weakTo: ["Fire", "Steel", "Rock", "Fighting"], resistances: ["Ice"], immunities: [] },
  Fighting: { strongAgainst: ["Normal", "Ice", "Rock", "Dark", "Steel"], weakAgainst: ["Poison", "Flying", "Psychic", "Bug", "Fairy", "Ghost"], weakTo: ["Flying", "Psychic", "Fairy"], resistances: ["Bug", "Rock", "Dark"], immunities: [] },
  Poison: { strongAgainst: ["Grass", "Fairy"], weakAgainst: ["Poison", "Ground", "Rock", "Ghost", "Steel"], weakTo: ["Psychic", "Ground"], resistances: ["Grass", "Fighting", "Poison", "Bug", "Fairy"], immunities: [] },
  Ground: { strongAgainst: ["Fire", "Electric", "Poison", "Rock", "Steel"], weakAgainst: ["Grass", "Bug", "Flying"], weakTo: ["Water", "Grass", "Ice"], resistances: ["Poison", "Rock"], immunities: ["Electric"] },
  Flying: { strongAgainst: ["Grass", "Fighting", "Bug"], weakAgainst: ["Electric", "Rock", "Steel"], weakTo: ["Ice", "Electric"], resistances: ["Grass", "Fighting", "Bug"], immunities: ["Ground"] },
  Psychic: { strongAgainst: ["Fighting", "Poison"], weakAgainst: ["Psychic", "Steel", "Dark"], weakTo: ["Dark", "Ghost", "Bug"], resistances: ["Fighting", "Psychic"], immunities: [] },
  Bug: { strongAgainst: ["Grass", "Psychic", "Dark"], weakAgainst: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"], weakTo: ["Fire", "Rock", "Flying"], resistances: ["Grass", "Fighting", "Ground"], immunities: [] },
  Rock: { strongAgainst: ["Fire", "Ice", "Flying", "Bug"], weakAgainst: ["Fighting", "Ground", "Steel"], weakTo: ["Fighting", "Ground", "Steel", "Water", "Grass"], resistances: ["Normal", "Fire", "Poison", "Flying"], immunities: [] },
  Ghost: { strongAgainst: ["Psychic", "Ghost"], weakAgainst: ["Dark"], weakTo: ["Ghost", "Dark"], resistances: ["Poison", "Bug"], immunities: ["Normal", "Fighting"] },
  Dragon: { strongAgainst: ["Dragon"], weakAgainst: ["Steel", "Fairy"], weakTo: ["Dragon", "Fairy"], resistances: ["Fire", "Water", "Electric", "Grass"], immunities: [] },
  Dark: { strongAgainst: ["Psychic", "Ghost"], weakAgainst: ["Fighting", "Dark", "Fairy"], weakTo: ["Fighting", "Bug", "Fairy"], resistances: ["Ghost", "Dark"], immunities: ["Psychic"] },
  Steel: { strongAgainst: ["Ice", "Rock", "Fairy"], weakAgainst: ["Fire", "Water", "Electric", "Steel"], weakTo: ["Fighting", "Fire", "Ground"], resistances: ["Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy"], immunities: ["Poison"] },
  Fairy: { strongAgainst: ["Fighting", "Dragon", "Dark"], weakAgainst: ["Fire", "Poison", "Steel"], weakTo: ["Steel", "Poison"], resistances: ["Fighting", "Bug", "Dark"], immunities: ["Dragon"] },
};

const typeIcons = {
  Normal: "👤", Fire: "🔥", Water: "💧", Grass: "🌿", Electric: "⚡", Ice: "🧊",
  Fighting: "✊", Poison: "☠️", Ground: "🌍", Flying: "🌪", Psychic: "🧠",
  Bug: "🐛", Rock: "🪨", Ghost: "👻", Dragon: "🐲", Dark: "🌑", Steel: "⚙️", Fairy: "🧚",
};

export default function Index() {
  const [primaryType, setPrimaryType] = useState<keyof typeof typeChart>("Normal");
  const [secondaryType, setSecondaryType] = useState<keyof typeof typeChart | "None">("None");

  function getCombinedData() {
    const primary = typeChart[primaryType];
    const secondary = secondaryType !== "None" ? typeChart[secondaryType] : null;

    const combineArrays = (primaryArr: string[], secondaryArr?: string[]) => {
      if (!secondaryArr) return primaryArr;
      return Array.from(new Set([...primaryArr, ...secondaryArr]));
    };

    let strongAgainst = combineArrays(primary.strongAgainst, secondary?.strongAgainst);
    let weakAgainst = combineArrays(primary.weakAgainst, secondary?.weakAgainst);
    let weakTo = combineArrays(primary.weakTo, secondary?.weakTo);
    let resistances = combineArrays(primary.resistances, secondary?.resistances);
    let immunities = combineArrays(primary.immunities, secondary?.immunities);

    //Adding Immunities cancel out Weak To and Weak Against
    weakTo = weakTo.filter(type => !immunities.includes(type));
    weakAgainst = weakAgainst.filter(type => !immunities.includes(type));

    //Adding Balance Weak To and Resistances
    const balancedWeakTo = weakTo.filter(type => !resistances.includes(type));
    const balancedResistances = resistances.filter(type => !weakTo.includes(type));

    return {
      strongAgainst,
      weakAgainst,
      weakTo: balancedWeakTo,
      resistances: balancedResistances,
      immunities,
    };
  }

  const combinedData = getCombinedData();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pokémon Type Checker</Text>

      <Text style={styles.subheader}>Select Primary Type:</Text>
      <Picker
        selectedValue={primaryType}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setPrimaryType(itemValue)}
      >
        {Object.keys(typeChart).map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      <Text style={styles.subheader}>Select Secondary Type (optional):</Text>
      <Picker
        selectedValue={secondaryType}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setSecondaryType(itemValue)}
      >
        <Picker.Item label="None" value="None" />
        {Object.keys(typeChart).map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      {/* Weak To Section */}
      <Text style={styles.subheader}>Weak To:</Text>
      {combinedData.weakTo.map((type) => (
        <Text key={`weakto-${type}`} style={styles.text}>
          {typeIcons[type] || ""} {type}
        </Text>
      ))}

      <Text style={styles.subheader}>Strong Against:</Text>
      {combinedData.strongAgainst.map((type) => (
        <Text key={`strong-${type}`} style={styles.text}>
          {typeIcons[type] || ""} {type}
        </Text>
      ))}

      <Text style={styles.subheader}>Weak Against:</Text>
      {combinedData.weakAgainst.map((type) => (
        <Text key={`weak-${type}`} style={styles.text}>
          {typeIcons[type] || ""} {type}
        </Text>
      ))}

      <Text style={styles.subheader}>Resistances:</Text>
      {combinedData.resistances.map((type) => (
        <Text key={`resist-${type}`} style={styles.text}>
          {typeIcons[type] || ""} {type}
        </Text>
      ))}

      <Text style={styles.subheader}>Immunities:</Text>
      {combinedData.immunities.map((type) => (
        <Text key={`immune-${type}`} style={styles.text}>
          {typeIcons[type] || ""} {type}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
});
