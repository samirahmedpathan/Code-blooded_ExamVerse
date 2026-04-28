import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useColors } from "@/hooks/useColors";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function Input({ label, error, isPassword, style, ...props }: InputProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.destructive : isFocused ? colors.primary : colors.input,
            backgroundColor: colors.background,
            borderRadius: colors.radius,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: colors.foreground },
            style,
          ]}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={!showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    fontFamily: "Inter_500Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  eyeIcon: {
    paddingHorizontal: 16,
    justifyContent: "center",
    height: "100%",
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Inter_400Regular",
  },
});