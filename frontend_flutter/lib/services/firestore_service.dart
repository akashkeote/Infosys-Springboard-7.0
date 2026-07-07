import 'package:cloud_firestore/cloud_firestore.dart';


/// Handles all Firestore read/write operations for the current user.
class FirestoreService {
  final _db = FirebaseFirestore.instance;

  /// Creates a Firestore document for a newly registered user.
  /// Collection: `users/{uid}`
  Future<void> createUserProfile({
    required String uid,
    required String fullName,
    required String email,
    required String aadharNumber,
  }) async {
    await _db.collection('users').doc(uid).set({
      'fullName': fullName,
      'email': email,
      'aadharNumber': aadharNumber,
      'createdAt': FieldValue.serverTimestamp(),
      'appliedSchemes': [],
      'savedSchemes': [],
      'notifications': true,
    });
  }

  /// Fetches the Firestore profile for the currently signed-in user.



}
