import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { Platform } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  title,
  variant = "primary",
  isLoading,
  leftIcon,
  disabled,
  style,
  onPress,
  ...props
}: ButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          bg: colors.secondary,
          text: colors.secondaryForeground,
          border: colors.border,
        };
      case "outline":
        return {
          bg: "transparent",
          text: colors.foreground,
          border: colors.border,
        };
      default:
        return {
          bg: colors.primary,
          text: colors.primaryForeground,
          border: colors.primary,
        };
    }
  };

  const vStyles = getVariantStyles();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = (e: any) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onPress) onPress(e);
  };

  return (
    <AnimatedTouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        {
          backgroundColor: vStyles.bg,
          borderColor: vStyles.border,
          borderWidth: variant === "outline" ? 1 : 1,
          borderRadius: colors.radius,
          opacity: disabled || isLoading ? 0.6 : 1,
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.text} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text
            style={[
              styles.text,
              { color: vStyles.text, marginLeft: leftIcon ? 8 : 0 },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});