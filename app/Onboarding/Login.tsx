import SocialSignInButton from "@/components/SocialMediaButtons/SigninGoogle";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import {
  loginUser,
  selectError,
  selectIsAuthenticated,
  selectIsLoading
} from "@/lib/store/slices/UserSlice";

const { height } = Dimensions.get("window");

export default function SimpleLoginScreen() {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Local state
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle successful authentication
  useEffect(() => {
    
    if (isAuthenticated) {
      Alert.alert("Success", "Logged in successfully!");
      
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const onTogglePassword = () => setShowPassword(!showPassword);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter email and password");
      return;
    }
    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  const onForgotPassword = () => {
    Alert.alert("Forgot Password", "Forgot password pressed");
  };

  const onNavigateToSignup = () => {
    return router.push("/Onboarding/SignUp");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>SageSpeaks</Text>
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue to your account
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                  ]}
                >
                  <Ionicons name="mail-outline" size={20} color="#667eea" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => setEmailFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.inputLabel}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#667eea"
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={onTogglePassword}
                    style={styles.passwordToggle}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#667eea"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={onForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={onLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.loginButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.SocialLoginContainer}>
                <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.OptionsText}>OR</Text>
                  <View style={styles.line} />
                </View>
                <SocialSignInButton
                  title={"Sign up with Google"}
                  onPress={() => alert("Google Sign In pressed")}
                />
              </View>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={onNavigateToSignup} disabled={isLoading}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingVertical: 0 },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: { marginBottom: 20 },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
    paddingHorizontal: 25,
    minHeight: height * 0.6,
  },
  form: { flex: 1 },
  inputGroup: { marginBottom: 15 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputContainerFocused: {
    borderColor: "#667eea",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainerError: { borderColor: "#e0dfefff" },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    fontWeight: "500",
  },
  passwordToggle: { padding: 4 },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  errorText: { color: "#FF6B6B", fontSize: 14, marginLeft: 8, flex: 1 },
  forgotPasswordButton: { alignSelf: "flex-end", marginBottom: 10, padding: 5 },
  forgotPasswordText: { color: "#667eea", fontSize: 14, fontWeight: "600" },
  loginButton: {
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  signupText: { color: "#666", fontSize: 15 },
  signupLink: { color: "#667eea", fontSize: 15, fontWeight: "700" },
  SocialLoginContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { color: "#666", fontSize: 15, marginVertical: 10 },
  OptionsText: {
    color: "#666",
    fontSize: 23,
    marginVertical: 12,
    marginHorizontal: 9,
    fontWeight: "500",
  },
  loginLink: { color: "#667eea", fontSize: 15, fontWeight: "700" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
});
