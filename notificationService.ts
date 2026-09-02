// Notification and Audio Chime Service for Customer Orders and Owner Dashboard

let audioCtx: AudioContext | null = null;

/**
 * Plays an audible notification chime using Web Audio API
 */
export function playOrderAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // First tone (D5 - 587.33Hz)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second tone (A5 - 880Hz)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.17);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.5);

    // Third high harmonic tone (D6 - 1174.66Hz)
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1174.66, now + 0.25);
    gain3.gain.setValueAtTime(0, now + 0.25);
    gain3.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);
    osc3.start(now + 0.25);
    osc3.stop(now + 0.7);
  } catch (err) {
    console.warn('Audio chime playback note:', err);
  }
}

/**
 * Requests Notification permissions from the browser
 */
export async function requestPushNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return Notification.permission;
  }
}

/**
 * Checks current notification permission
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Sends a system desktop / mobile notification when order is placed
 */
export function sendOrderPushNotification(
  orderId: string,
  customerName: string,
  totalAmount: number,
  orderType: 'delivery' | 'pickup'
) {
  // Always chime
  playOrderAlertChime();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    const title = `🔔 New Order Received: ${orderId}`;
    const body = `${customerName} placed a ${orderType === 'delivery' ? 'Home Delivery' : 'Pickup'} order for ₨ ${totalAmount.toLocaleString()}`;
    
    try {
      // Try service worker notification first
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: `order-${orderId}`,
            data: { url: window.location.origin }
          });
        }).catch(() => {
          new Notification(title, {
            body,
            icon: '/favicon.svg',
            tag: `order-${orderId}`
          });
        });
      } else {
        new Notification(title, {
          body,
          icon: '/favicon.svg',
          tag: `order-${orderId}`
        });
      }
    } catch (e) {
      console.warn('Notification display note:', e);
    }
  }
}

// Broadcast Channel for real-time inter-tab order syncing
let orderBroadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    orderBroadcastChannel = new BroadcastChannel('restaurant_orders_channel');
  }
} catch {
  orderBroadcastChannel = null;
}

export function broadcastNewOrder(orderData: { id: string; customerName: string; totalPrice: number; orderType: 'delivery' | 'pickup' }) {
  try {
    if (orderBroadcastChannel) {
      orderBroadcastChannel.postMessage({ type: 'NEW_ORDER', order: orderData });
    }
  } catch (err) {
    console.warn('Broadcast channel note:', err);
  }
}

export function subscribeToOrderBroadcasts(onNewOrder: (order: { id: string; customerName: string; totalPrice: number; orderType: 'delivery' | 'pickup' }) => void) {
  if (!orderBroadcastChannel) return () => {};

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'NEW_ORDER' && event.data?.order) {
      onNewOrder(event.data.order);
    }
  };

  orderBroadcastChannel.addEventListener('message', handler);
  return () => {
    orderBroadcastChannel?.removeEventListener('message', handler);
  };
}
