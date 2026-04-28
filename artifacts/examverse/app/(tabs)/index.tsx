import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";
import { router } from "expo-router";

export default function TabOneScreen() {
  const colors = useColors();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="book-open" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Welcome to Examverse</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Learn. Practice. Succeed.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardText, { color: colors.foreground }]}>
          Your quiet study companion is ready. This is where your upcoming exams, study streak, and daily practice sessions will live.
        </Text>
      </View>

      <Button 
        title="Sign Out" 
        variant="outline" 
        onPress={handleSignOut}
        style={styles.signOutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  card: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 48,
  },
  cardText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    textAlign: "center",
  },
  signOutButton: {
    marginTop: "auto",
  },
});
