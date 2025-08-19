/**
 * Notification Debugging Utilities
 * Use these functions to test and diagnose notification issues in development
 */

import * as Notifications from 'expo-notifications';
import { AlarmScheduler } from '../services/AlarmScheduler';
import { Alert } from 'react-native';

/**
 * Log all currently scheduled notifications with detailed timing
 */
export const logAllScheduledNotifications = async (): Promise<void> => {
  try {
    console.log('📋 ===============================================');
    console.log('📋 ALL SCHEDULED NOTIFICATIONS');
    console.log('📋 ===============================================');
    
    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    const now = new Date();
    
    console.log(`📋 Current time: ${now.toLocaleString()}`);
    console.log(`📋 Total scheduled notifications: ${allScheduled.length}`);
    
    if (allScheduled.length === 0) {
      console.log('📋 No notifications currently scheduled');
    } else {
      allScheduled.forEach((notification: any, index: number) => {
        const trigger = notification.trigger as any;
        const triggerDate = trigger?.date ? new Date(trigger.date) : null;
        const timeUntil = triggerDate ? Math.round((triggerDate.getTime() - now.getTime()) / 60000) : null;
        
        console.log(`📋 ${index + 1}. ${notification.identifier}`);
        console.log(`    Title: ${notification.content.title}`);
        console.log(`    Trigger: ${triggerDate ? triggerDate.toLocaleString() : 'Unknown'}`);
        console.log(`    Time until: ${timeUntil !== null ? timeUntil + ' minutes' : 'Unknown'}`);
        console.log(`    Data: ${JSON.stringify(notification.content.data, null, 4)}`);
        console.log('');
      });
    }
    
    console.log('📋 ===============================================');
    
  } catch (error) {
    console.error('❌ Error logging scheduled notifications:', error);
  }
};

/**
 * Run comprehensive notification diagnostics
 */
export const runNotificationDiagnostics = async (): Promise<void> => {
  console.log('🔍 Running comprehensive notification diagnostics...');
  
  try {
    // Get full diagnostic info
    const diagnostics = await AlarmScheduler.getDiagnosticInfo();
    
    // Display summary in alert
    const summary = `
Notification Diagnostics:
• Permissions: ${diagnostics.permissions?.status || 'Unknown'}
• System Scheduled: ${diagnostics.systemScheduledCount}
• Tracked Alarms: ${diagnostics.trackedAlarmsCount}
• Stored Alarms: ${diagnostics.storedAlarmsCount}

Check console for full details.
    `;
    
    Alert.alert('Notification Diagnostics', summary, [{ text: 'OK' }]);
    
  } catch (error) {
    console.error('❌ Error running diagnostics:', error);
    Alert.alert('Diagnostics Error', 'Failed to run diagnostics. Check console for details.');
  }
};

/**
 * Test immediate notification
 */
export const testImmediateNotification = async (): Promise<void> => {
  console.log('🧪 Testing immediate notification...');
  
  try {
    const notificationId = await AlarmScheduler.testImmediateNotification();
    
    if (notificationId) {
      Alert.alert(
        'Test Sent', 
        'Immediate notification sent! You should see it now.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Test Failed', 
        'Failed to send immediate notification. Check console for details.',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('❌ Error testing immediate notification:', error);
    Alert.alert('Test Error', 'Error testing notification. Check console for details.');
  }
};

/**
 * Test scheduled notification
 */
export const testScheduledNotification = async (delaySeconds: number = 10): Promise<void> => {
  console.log(`🧪 Testing scheduled notification in ${delaySeconds} seconds...`);
  
  try {
    const notificationId = await AlarmScheduler.testScheduledNotification(delaySeconds);
    
    if (notificationId) {
      Alert.alert(
        'Test Scheduled', 
        `Notification scheduled for ${delaySeconds} seconds from now. Wait for it!`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Test Failed', 
        'Failed to schedule test notification. Check console for details.',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('❌ Error testing scheduled notification:', error);
    Alert.alert('Test Error', 'Error scheduling test notification. Check console for details.');
  }
};

/**
 * Force refresh all alarm scheduling
 */
export const forceRefreshScheduling = async (): Promise<void> => {
  console.log('🔄 Force refreshing all alarm scheduling...');
  
  try {
    await AlarmScheduler.forceRefreshScheduling();
    
    Alert.alert(
      'Refresh Complete', 
      'All alarm scheduling has been refreshed. Check console for details.',
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('❌ Error force refreshing scheduling:', error);
    Alert.alert('Refresh Error', 'Error refreshing scheduling. Check console for details.');
  }
};

/**
 * Clean up orphaned notifications
 */
export const cleanupOrphanedNotifications = async (): Promise<void> => {
  console.log('🧹 Cleaning up orphaned notifications...');
  
  try {
    await AlarmScheduler.cleanupOrphanedNotifications();
    
    Alert.alert(
      'Cleanup Complete', 
      'Orphaned notifications have been cleaned up. Check console for details.',
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('❌ Error cleaning up notifications:', error);
    Alert.alert('Cleanup Error', 'Error cleaning up notifications. Check console for details.');
  }
};

/**
 * Quick debug session - runs multiple tests
 */
export const quickDebugSession = async (): Promise<void> => {
  console.log('🚀 Starting quick debug session...');
  
  Alert.alert(
    'Debug Session',
    'This will run multiple tests. Check the console for detailed logs.',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Start', 
        onPress: async () => {
          try {
            // Test immediate notification
            await testImmediateNotification();
            
            // Wait a moment
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Test scheduled notification
            await testScheduledNotification(5);
            
            // Run diagnostics
            await runNotificationDiagnostics();
            
            console.log('✅ Quick debug session complete');
          } catch (error) {
            console.error('❌ Error in debug session:', error);
          }
        }
      }
    ]
  );
};

// Global functions for easy console access
if (__DEV__) {
  (global as any).testNotifications = testImmediateNotification;
  (global as any).testScheduled = testScheduledNotification;
  (global as any).refreshAlarms = forceRefreshScheduling;
  (global as any).debugAlarms = runNotificationDiagnostics;
  (global as any).cleanupNotifications = cleanupOrphanedNotifications;
  (global as any).quickDebug = quickDebugSession;
  (global as any).logScheduled = logAllScheduledNotifications;
  
  console.log('🔧 Debug functions available globally:');
  console.log('  testNotifications() - Test immediate notification');
  console.log('  testScheduled(10) - Test scheduled notification in 10 seconds');
  console.log('  refreshAlarms() - Force refresh all alarm scheduling');
  console.log('  debugAlarms() - Run full diagnostics');
  console.log('  cleanupNotifications() - Clean up orphaned notifications');
  console.log('  quickDebug() - Run quick debug session');
  console.log('  logScheduled() - Log all currently scheduled notifications');
}
