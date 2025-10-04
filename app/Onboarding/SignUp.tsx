// components/SimpleSignupScreen.tsx
import SocialSignInButton from "@/components/SocialMediaButtons/SigninGoogle";
import { AppDispatch } from "@/lib/store";
import { SignupUser } from "@/lib/store/slices/UserSlice";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useDispatch } from "react-redux";

const { height } = Dimensions.get("window");

export default function SimpleSignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const onTogglePassword = () => setShowPassword(!showPassword);
  const onToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await dispatch(
        SignupUser({ name, email, password })
      ).unwrap();

      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)"); 
    } catch (err: any) {
      // Signup failed
      setError(err || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onNavigateToLogin = () => router.push("/Onboarding/Login");

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
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign up to start your journey with SageSpeaks
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.form}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#667eea" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password *</Text>
                <View style={styles.inputContainer}>
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
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={onTogglePassword}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#667eea"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#667eea"
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={onToggleConfirmPassword}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#667eea"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  isLoading && styles.signupButtonDisabled,
                ]}
                onPress={onSignup}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.signupButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.signupButtonText}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </Text>
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

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={onNavigateToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
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
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
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
  inputGroup: { marginBottom: 20 },
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
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
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
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  errorText: { color: "#FF6B6B", fontSize: 14, marginLeft: 8, flex: 1 },
  signupButton: {
    borderRadius: 12,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupButtonDisabled: { opacity: 0.7 },
  signupButtonGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  signupButtonText: { color: "white", fontSize: 18, fontWeight: "700" },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  SocialLoginContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { color: "#666", fontSize: 15, marginVertical: 10 },
  OptionsText: {
    color: "#666",
    fontSize: 23,
    marginVertical: 10,
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
