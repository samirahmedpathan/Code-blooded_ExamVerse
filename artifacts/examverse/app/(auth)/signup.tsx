import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { SharedAuthLayout } from "@/components/SharedAuthLayout";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { StyleSheet, Text, View, Platform, TouchableOpacity, Alert } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Link, router } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { TextInput } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

function GoogleIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </Svg>
  );
}

export default function SignupScreen() {
  const colors = useColors();
  const { login } = useAuth();
  
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const shake = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: shake.value }
    ],
  }));

  const handleShake = () => {
    shake.value = withSequence(
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleSignup = () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      handleShake();
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      handleShake();
      return;
    }
    
    setIsLoading(true);
    // Fake network delay
    setTimeout(async () => {
      setIsLoading(false);
      await login();
      router.replace("/(tabs)");
    }, 1200);
  };

  const isFormValid = name && email && password && confirmPassword && agreed;

  return (
    <SharedAuthLayout>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        bottomOffset={40}
      >
        <Animated.View style={[styles.formContainer, animatedStyle]}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError("");
            }}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            autoCapitalize="words"
          />
          
          <Input
            ref={emailRef}
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            ref={passwordRef}
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError("");
            }}
            isPassword
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          
          <Input
            ref={confirmPasswordRef}
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) setError("");
            }}
            isPassword
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            error={error}
          />
          
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.checkbox,
              { 
                borderColor: agreed ? colors.primary : colors.input,
                backgroundColor: agreed ? colors.primary : colors.background 
              }
            ]}>
              {agreed && <Feather name="check" size={14} color={colors.primaryForeground} />}
            </View>
            <Text style={[styles.checkboxText, { color: colors.foreground }]}>
              I agree to the <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text> and <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Sign Up"
            onPress={handleSignup}
            isLoading={isLoading}
            disabled={!isFormValid}
            style={styles.submitButton}
          />
          
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground, backgroundColor: colors.background }]}>
              or
            </Text>
          </View>
          
          <Button
            title="Continue with Google"
            variant="outline"
            leftIcon={<GoogleIcon />}
            onPress={() => Alert.alert("Google Auth", "Not implemented in this demo")}
            style={styles.googleButton}
          />
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.footerLink, { color: colors.primary }]}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </KeyboardAwareScrollViewCompat>
    </SharedAuthLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  linkText: {
    fontFamily: "Inter_500Medium",
    textDecorationLine: "underline",
  },
  submitButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  divider: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  googleButton: {
    marginBottom: 32,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});