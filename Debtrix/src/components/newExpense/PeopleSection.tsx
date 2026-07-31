import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PersonInput } from '../../types/newExpense';

type Props = {
    numPeople: string;
    people: PersonInput[];
    onNumPeopleChange: (value: string) => void;
    onPersonNameChange: (personId: string, value: string) => void;
};

export default function PeopleSection({ numPeople, people, onNumPeopleChange, onPersonNameChange }: Props) {
    return (
        <>
            <View>
                <Text style={styles.label}>
                    How many people?{" "}
                    <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter number of people"
                    keyboardType="number-pad"
                    value={numPeople}
                    onChangeText={onNumPeopleChange}
                    maxLength={2}
                />
            </View>

            {people.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.label}>
                        Who is splitting the expense?{" "}
                        <Text style={styles.required}>*</Text>
                    </Text>

                    {people.map((person, index) => (
                        <TextInput
                            key={person.id}
                            style={styles.input}
                            placeholder={`Person ${index + 1} name`}
                            value={person.name}
                            onChangeText={(value) => onPersonNameChange(person.id, value)}
                            autoCapitalize="words"
                        />
                    ))}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: "#d7d9ce",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    color: "#0c7489",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#ff3b30",
  },
  input: {
    backgroundColor: "#d7d9ce",
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
});