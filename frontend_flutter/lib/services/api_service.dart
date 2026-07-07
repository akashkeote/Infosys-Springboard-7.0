import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/subsidy.dart';

class ApiService {
  static const String baseUrl = 'http://127.0.0.1:8080/api';

  // ==================== SUBSIDIES ====================

  /// Fetch schemes with optional filters:
  ///   state, category, ministry, search keyword, limit
  Future<List<Subsidy>> fetchSubsidies({
    String? state,
    String? category,
    String? ministry,
    String? search,
    int limit = 20,
  }) async {
    try {
      final queryParams = <String, String>{};

      if (state != null && state.isNotEmpty && state != 'All States') {
        queryParams['state'] = state;
      }
      if (category != null && category.isNotEmpty && category != 'All Categories') {
        queryParams['category'] = category;
      }
      if (ministry != null && ministry.isNotEmpty && ministry != 'All Ministries') {
        queryParams['ministry'] = ministry;
      }
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      queryParams['limit'] = limit.toString();

      final uri = Uri.parse('$baseUrl/subsidies').replace(queryParameters: queryParams);
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        List<dynamic> jsonList = json.decode(response.body);
        return jsonList.map((j) => Subsidy.fromJson(j)).toList();
      } else {
        throw Exception('Failed to load subsidies: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching subsidies: $e');
    }
  }

  /// GET /api/subsidies/{id} — fetch a single scheme by ID
  Future<Subsidy> fetchSchemeById(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/subsidies/$id'));
      if (response.statusCode == 200) {
        return Subsidy.fromJson(json.decode(response.body));
      } else {
        throw Exception('Scheme not found: $id');
      }
    } catch (e) {
      throw Exception('Error fetching scheme: $e');
    }
  }

  /// GET /api/subsidies/stats — dashboard analytics
  /// Returns: { totalSchemes, byState, byCategory, byMinistry }
  Future<Map<String, dynamic>> fetchStats() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/subsidies/stats'));
      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to load stats');
      }
    } catch (e) {
      throw Exception('Error fetching stats: $e');
    }
  }

  /// POST /api/subsidies/sync — manually trigger remote sync
  Future<Map<String, dynamic>> syncSchemes() async {
    try {
      final response = await http.post(Uri.parse('$baseUrl/subsidies/sync'));
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Sync failed');
      }
    } catch (e) {
      throw Exception('Error syncing: $e');
    }
  }

  // ==================== APPLICATIONS ====================

  Future<Map<String, dynamic>> submitApplication(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/applications'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to submit application: ${response.body}');
      }
    } catch (e) {
      throw Exception('Connection error: $e');
    }
  }
}
