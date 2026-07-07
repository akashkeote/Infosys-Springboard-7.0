// File generated for gov-app-scheme Firebase project.
// Project Number: 745780930470
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for iOS.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  /// gov-app-scheme — Android
  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCJn1cQNuJP6b4EDSlyAGckAh_m6N4Ndtw',
    appId: '1:745780930470:android:81343b769bc21a099c1167',
    messagingSenderId: '745780930470',
    projectId: 'gov-app-scheme',
    storageBucket: 'gov-app-scheme.firebasestorage.app',
  );

  /// gov-app-scheme — Web
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCJn1cQNuJP6b4EDSlyAGckAh_m6N4Ndtw',
    appId: '1:745780930470:web:35cf83da13a1775d9c1167',
    messagingSenderId: '745780930470',
    projectId: 'gov-app-scheme',
    storageBucket: 'gov-app-scheme.firebasestorage.app',
    authDomain: 'gov-app-scheme.firebaseapp.com',
    measurementId: 'G-3BHPWY0C47',
  );
}
