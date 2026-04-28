import { StyleSheet, Text, View, Platform, ScrollView, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const { width } = Dimensions.get("window");

export function SharedAuthLayout({ children }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const isWeb = Platform.OS === "web";
  
  const paddingTop = isWeb ? 67 : Math.max(insets.top, 20);
  const paddingBottom = isWeb ? 34 : Math.max(insets.bottom, 20);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { paddingTop, backgroundColor: colors.card }]}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Feather name="book-open" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.wordmark, { color: colors.foreground }]}>Examverse</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>Learn. Practice. Succeed.</Text>
        </View>
        
        <View style={styles.tornPaperContainer}>
          <Svg height="24" width="100%" viewBox="0 0 1000 24" preserveAspectRatio="none">
            <Path
              d="M0,0 C150,20 250,-10 400,10 C550,30 650,-10 800,10 C900,30 1000,0 1000,0 L1000,24 L0,24 Z"
              fill={colors.background}
            />
          </Svg>
        </View>
      </View>
      
      <View style={[styles.body, { paddingBottom }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
    position: "relative",
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 12,
  },
  wordmark: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  tornPaperContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
  },
  body: {
    flex: 1,
  },
});