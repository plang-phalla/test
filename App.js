import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const WORKSHOP_OPTIONS = ["Woodworking", "Metalworking", "Electronics", "3D Printing"];

const initialFormState = {
  name: "",
  email: "",
  workshop: WORKSHOP_OPTIONS[0],
  notes: "",
};

export default function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [checkIns, setCheckIns] = useState([]);

  const totalCheckIns = useMemo(() => checkIns.length, [checkIns]);

  const updateField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formState.name.trim()) {
      return;
    }

    setCheckIns((current) => [
      {
        id: `${Date.now()}`,
        name: formState.name.trim(),
        email: formState.email.trim(),
        workshop: formState.workshop,
        notes: formState.notes.trim(),
        checkedInAt: new Date().toLocaleTimeString(),
      },
      ...current,
    ]);

    setFormState(initialFormState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workshop Check-In</Text>
          <Text style={styles.subtitle}>{totalCheckIns} attendees checked in</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>New Check-In</Text>
          <TextInput
            placeholder="Full name"
            value={formState.name}
            onChangeText={(value) => updateField("name", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Email (optional)"
            value={formState.email}
            onChangeText={(value) => updateField("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <View style={styles.workshopRow}>
            {WORKSHOP_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => updateField("workshop", option)}
                style={[
                  styles.workshopOption,
                  formState.workshop === option && styles.workshopOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.workshopText,
                    formState.workshop === option && styles.workshopTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            placeholder="Safety notes or equipment needs"
            value={formState.notes}
            onChangeText={(value) => updateField("notes", value)}
            style={[styles.input, styles.notesInput]}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Check In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Recent Check-Ins</Text>
          <Text style={styles.mutedText}>Most recent first</Text>
        </View>
        <FlatList
          data={checkIns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyState}>No check-ins yet. Add the first attendee.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemName}>{item.name}</Text>
                <Text style={styles.listItemTime}>{item.checkedInAt}</Text>
              </View>
              <Text style={styles.listItemMeta}>{item.workshop}</Text>
              {item.email ? <Text style={styles.listItemMeta}>{item.email}</Text> : null}
              {item.notes ? <Text style={styles.listItemNotes}>{item.notes}</Text> : null}
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 12,
    backgroundColor: "#F9FAFB",
  },
  notesInput: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  workshopRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  workshopOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  workshopOptionActive: {
    backgroundColor: "#2563EB",
  },
  workshopText: {
    color: "#4B5563",
    fontSize: 14,
  },
  workshopTextActive: {
    color: "#FFFFFF",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listHeader: {
    marginBottom: 8,
  },
  mutedText: {
    color: "#9CA3AF",
    marginTop: 2,
  },
  list: {
    paddingBottom: 24,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  listItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  listItemTime: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  listItemMeta: {
    color: "#4B5563",
    marginTop: 4,
  },
  listItemNotes: {
    color: "#6B7280",
    marginTop: 6,
    fontStyle: "italic",
  },
  emptyState: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 12,
  },
});
