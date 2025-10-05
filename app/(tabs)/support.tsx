// app/(tabs)/support.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Contact Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Us</Text>
          <Text style={styles.cardSubtitle}>We're here to help you 24/7</Text>

          <TouchableOpacity style={styles.contactButton}>
            <View style={styles.contactIcon}>
              <Ionicons name="chatbubble-outline" size={24} color="#4A90E2" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactSubtitle}>Average response time: 2 min</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail-outline" size={24} color="#50C878" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>support@example.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton}>
            <View style={styles.contactIcon}>
              <Ionicons name="call-outline" size={24} color="#FFA500" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Phone</Text>
              <Text style={styles.contactSubtitle}>+1 (555) 123-4567</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequently Asked Questions</Text>

          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I reset my password?</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I update my profile?</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I delete my account?</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I enable notifications?</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>
        </View>

        {/* Resources */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resources</Text>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="book-outline" size={24} color="#9B59B6" />
            <Text style={styles.resourceText}>Documentation</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="videocam-outline" size={24} color="#E74C3C" />
            <Text style={styles.resourceText}>Video Tutorials</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="people-outline" size={24} color="#4A90E2" />
            <Text style={styles.resourceText}>Community Forum</Text>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  faqQuestion: {
    fontSize: 15,
    color: '#2C3E50',
    flex: 1,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  resourceText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 15,
  },
});