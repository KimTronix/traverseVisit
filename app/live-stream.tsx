import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LiveStreamScreen() {
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isLive) {
      // Simulate live stream updates
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        setViewerCount(prev => prev + Math.floor(Math.random() * 3));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const startLiveStream = () => {
    setIsLive(true);
    Alert.alert('Live Started!', 'Your live stream has begun.');
  };

  const endLiveStream = () => {
    Alert.alert(
      'End Live Stream',
      'Are you sure you want to end your live stream?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Live', 
          style: 'destructive',
          onPress: () => {
            setIsLive(false);
            Alert.alert('Live Ended', 'Your live stream has ended and will be available for 24 hours.');
            router.back();
          }
        },
      ]
    );
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.viewerCount}>
          <Ionicons name="eye" size={16} color="#fff" />
          <Text style={styles.viewerText}>{viewerCount}</Text>
        </View>
      </View>

      {/* Live Stream Content */}
      <View style={styles.streamContainer}>
        {!isLive ? (
          <View style={styles.preLiveContainer}>
            <Ionicons name="radio" size={80} color="#FF3B30" />
            <Text style={styles.preLiveTitle}>Ready to Go Live?</Text>
            <Text style={styles.preLiveDescription}>
              Start a live stream to interact with your followers in real-time
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startLiveStream}>
              <Ionicons name="radio" size={24} color="#fff" />
              <Text style={styles.startButtonText}>Start Live Stream</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.liveContainer}>
            <View style={styles.streamPlaceholder}>
              <Ionicons name="videocam" size={60} color="#fff" />
              <Text style={styles.streamText}>Live Stream Active</Text>
              <Text style={styles.durationText}>{formatDuration(duration)}</Text>
            </View>
            
            {/* Live Stream Controls */}
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="musical-notes" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="chatbubble" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlButton, styles.endButton]} onPress={endLiveStream}>
                <Ionicons name="stop" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Live Stream Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Live Stream Features</Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={20} color="#4ECDC4" />
            <Text style={styles.featureText}>Real-time interaction</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="chatbubble" size={20} color="#4ECDC4" />
            <Text style={styles.featureText}>Live comments</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="heart" size={20} color="#4ECDC4" />
            <Text style={styles.featureText}>Live reactions</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time" size={20} color="#4ECDC4" />
            <Text style={styles.featureText}>Available for 24 hours</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    padding: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  streamContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preLiveContainer: {
    alignItems: 'center',
    padding: 40,
  },
  preLiveTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
  },
  preLiveDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  liveContainer: {
    flex: 1,
    width: '100%',
  },
  streamPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    borderRadius: 16,
  },
  streamText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  durationText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#FF3B30',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
