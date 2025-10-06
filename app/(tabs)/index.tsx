import LoadingScreen from "@/components/loadingScreen";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DrawerNavigation = DrawerNavigationProp<any>;

const { width: screenWidth } = Dimensions.get("window");

// Mock dashboard data
const dashboardData = {
  totalBalance: 782123.56,
  balanceChange: 1.7,
  activeSales: 12.7,
  monthlySales: [15, 8, 4, 12, 6, 18, 14],
  salesLabels: ["JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  yearlyStats: [2.5, 2.0, 3.0, 2.2, 1.8, 2.8],
  yearLabels: ["2017", "2018", "2019", "2020", "2021", "2022"],
};

export default function HomeScreen() {
  const navigation = useNavigation<DrawerNavigation>();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<"Month" | "Year">(
    "Month"
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate initial loading (5 seconds)
    const timer = setTimeout(() => setIsLoading(false), 5000);

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Commented API calls — simulated data fetching
      // await Promise.all([
      //   fetchStats(),
      //   fetchActivity(),
      // ]);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate refresh delay
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 3,
    }).format(amount);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const SimpleChart = ({
    data,
    labels,
    color = "#ffffff",
    height = 120,
  }: any) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    return (
      <View style={[styles.chartContainer, { height }]}>
        <View style={styles.chartGrid}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.gridLine} />
          ))}
        </View>

        <View style={styles.chartLine}>
          {data.map((value: number, index: number) => {
            const normalizedHeight =
              ((value - minValue) / range) * (height - 40) + 10;
            const leftPosition =
              (index / (data.length - 1)) * (screenWidth - 80);

            return (
              <View key={index} style={styles.dataPointContainer}>
                <View
                  style={[
                    styles.dataPoint,
                    {
                      left: leftPosition,
                      bottom: normalizedHeight,
                      backgroundColor: color,
                    },
                  ]}
                />
                {index > 0 && (
                  <View
                    style={[
                      styles.connectionLine,
                      {
                        left:
                          ((index - 1) / (data.length - 1)) *
                            (screenWidth - 80) +
                          4,
                        bottom:
                          ((data[index - 1] - minValue) / range) *
                            (height - 40) +
                          14,
                        width: Math.sqrt(
                          Math.pow(
                            leftPosition -
                              ((index - 1) / (data.length - 1)) *
                                (screenWidth - 80),
                            2
                          ) +
                            Math.pow(
                              normalizedHeight -
                                ((data[index - 1] - minValue) / range) *
                                  (height - 40) -
                                10,
                              2
                            )
                        ),
                        transform: [
                          {
                            rotate: `${Math.atan2(
                              normalizedHeight -
                                ((data[index - 1] - minValue) / range) *
                                  (height - 40) -
                                10,
                              leftPosition -
                                ((index - 1) / (data.length - 1)) *
                                  (screenWidth - 80)
                            )}rad`,
                          },
                        ],
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Labels */}
        <View style={styles.chartLabels}>
          {labels.map((label: string, index: number) => (
            <Text key={index} style={styles.chartLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const BarChart = ({ data, labels, color = "#9B59B6" }: any) => {
    const maxValue = Math.max(...data);

    return (
      <View style={styles.barChartContainer}>
        <View style={styles.barsContainer}>
          {data.map((value: number, index: number) => (
            <View key={index} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (value / maxValue) * 120,
                    backgroundColor: color,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{labels[index]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) return <LoadingScreen />;

  if (refreshing) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      {/* Scrollable Content with Pull-to-Refresh */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4A90E2", "#50C878"]} // Android colors
            tintColor="#4A90E2" // iOS color
            progressBackgroundColor="#fff"
          />
        }
      >
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={["#4A90E2", "#357ABD", "#2E5F8A"]}
          style={styles.headerSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Top Navigation */}
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={styles.menuButton}
            >
              <Ionicons name="grid-outline" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/Notifications")}
              style={styles.notificationButton}
            >
              <Ionicons name="notifications-outline" size={26} color="#fff" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.welcomeSection}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Total Sales Till now</Text>
              <Text style={styles.balanceAmount}>
                {formatCurrency(dashboardData.totalBalance)}
              </Text>
              <View style={styles.balanceChange}>
                <Ionicons
                  name={
                    dashboardData.balanceChange > 0 ? "arrow-up" : "arrow-down"
                  }
                  size={12}
                  color="#ffffff"
                />
                <Text style={styles.changeText}>
                  {dashboardData.balanceChange}% This month
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="people-outline" size={16} color="#4A90E2" />
              <Text style={styles.actionButtonText}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="cube-outline" size={16} color="#4A90E2" />
              <Text style={styles.actionButtonText}>Product</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Active Sales Section */}
        <View style={styles.contentSection}>
          <View style={styles.salesHeader}>
            <View>
              <Text style={styles.sectionLabel}>Active Sales</Text>
              <View style={styles.salesValue}>
                <Text style={styles.salesAmount}>
                  ${dashboardData.activeSales}K
                </Text>
                <View style={styles.salesTrend}>
                  <View style={styles.trendDot} />
                  <Text style={styles.trendText}>VS LAST YEAR</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Monthly</Text>
              <Ionicons name="chevron-down" size={16} color="#7F8C8D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statisticsSection}>
          <View style={styles.statsHeader}>
            <View>
              <Text style={styles.sectionLabel}>Statistics</Text>
              <Text style={styles.statsTitle}>Sales statistic</Text>
            </View>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>Annual</Text>
              <Ionicons name="chevron-down" size={16} color="#7F8C8D" />
            </TouchableOpacity>
          </View>

          {/* Yearly Bar Chart */}
          <BarChart
            data={dashboardData.yearlyStats}
            labels={dashboardData.yearLabels}
            color="#9B59B6"
          />
        </View>

        {/* Recent Activity Section - keeping your original */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.welcomeSubtitle}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Text>

          <View style={styles.activityItem}>
            <Ionicons name="document-text-outline" size={24} color="#4A90E2" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New document uploaded</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="person-add-outline" size={24} color="#50C878" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New team member joined</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="checkmark-done-outline" size={24} color="#9B59B6" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Task completed</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Updated styles with dashboard design
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  content: { flex: 1 },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  menuButton: {
    padding: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  signalBar: {
    width: 3,
    backgroundColor: "#ffffff",
    marginHorizontal: 1,
    borderRadius: 1,
  },
  bar1: { height: 4 },
  bar2: { height: 6 },
  bar3: { height: 8 },
  bar4: { height: 10 },
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 6,
    top: 6,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  balanceChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  activePeriod: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  periodText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  activePeriodText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  refreshButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "600",
  },
  chartSection: {
    position: "relative",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  chartContainer: {
    position: "relative",
    width: "100%",
  },
  chartGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 30,
    justifyContent: "space-between",
  },
  gridLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  chartLine: {
    position: "relative",
    height: "100%",
  },
  dataPointContainer: {
    position: "absolute",
  },
  dataPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
  },
  connectionLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#ffffff",
  },
  chartLabels: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  chartLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  currentPoint: {
    position: "absolute",
    top: 60,
    left: "35%",
    backgroundColor: "#2C3E50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentPointText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  contentSection: {
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  salesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionLabel: {
    color: "#BDC3C7",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  salesValue: {
    marginTop: 4,
  },
  salesAmount: {
    color: "#2C3E50",
    fontSize: 20,
    fontWeight: "700",
  },
  salesTrend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  trendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#27AE60",
  },
  trendText: {
    color: "#BDC3C7",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dropdownText: {
    color: "#7F8C8D",
    fontSize: 14,
  },
  statisticsSection: {
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  statsTitle: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  barChartContainer: {
    alignItems: "center",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    height: 140,
    paddingBottom: 20,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    color: "#7F8C8D",
    fontSize: 12,
  },
  // Keep original styles for activity section
  welcomeCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: { fontSize: 24, fontWeight: "bold", color: "#2C3E50" },
  welcomeSubtitle: { fontSize: 14, color: "#7F8C8D", marginTop: 8 },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 8,
  },
  statLabel: { fontSize: 12, color: "#7F8C8D", marginTop: 4 },
  section: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  activityContent: { marginLeft: 15, flex: 1 },
  activityTitle: { fontSize: 14, color: "#2C3E50", marginBottom: 4 },
  activityTime: { fontSize: 12, color: "#95A5A6" },
});
