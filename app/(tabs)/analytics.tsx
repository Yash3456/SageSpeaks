// app/(tabs)/analytics.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Overview Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Ionicons name="trending-up" size={32} color="#50C878" />
              <Text style={styles.metricValue}>+24%</Text>
              <Text style={styles.metricLabel}>Growth</Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="eye-outline" size={32} color="#4A90E2" />
              <Text style={styles.metricValue}>1.2K</Text>
              <Text style={styles.metricLabel}>Views</Text>
            </View>
          </View>
        </View>

        {/* Performance Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance Metrics</Text>
          
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Completion Rate</Text>
              <Text style={styles.progressValue}>75%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%', backgroundColor: '#50C878' }]} />
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Engagement</Text>
              <Text style={styles.progressValue}>92%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '92%', backgroundColor: '#4A90E2' }]} />
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Response Time</Text>
              <Text style={styles.progressValue}>68%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '68%', backgroundColor: '#FFA500' }]} />
            </View>
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Reports</Text>
          
          <View style={styles.reportItem}>
            <Ionicons name="document-text-outline" size={24} color="#4A90E2" />
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Monthly Report</Text>
              <Text style={styles.reportDate}>Oct 1, 2025</Text>
            </View>
            <Ionicons name="download-outline" size={20} color="#4A90E2" />
          </View>

          <View style={styles.reportItem}>
            <Ionicons name="document-text-outline" size={24} color="#50C878" />
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Q3 Analytics</Text>
              <Text style={styles.reportDate}>Sep 30, 2025</Text>
            </View>
            <Ionicons name="download-outline" size={20} color="#50C878" />
          </View>
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
    marginBottom: 15,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#2C3E50',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  reportContent: {
    flex: 1,
    marginLeft: 15,
  },
  reportTitle: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#95A5A6',
  },
});