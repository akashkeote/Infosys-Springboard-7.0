class Subsidy {
  final String id;
  final String title;
  final String description;
  final double amount;
  final String eligibilityCriteria;
  final String? applicationDeadline;
  final String? startDate;
  final String state;
  final String category;
  final bool isActive;
  final String? applicationUrl;
  final List<String> documentsRequired;
  final String benefits;
  final String applicationProcess;
  final String ministry;

  // ─── New fields from enriched data ───
  final String incomeLimit;
  final String grantAmount;
  final String schemeStatus;

  Subsidy({
    required this.id,
    required this.title,
    required this.description,
    required this.amount,
    required this.eligibilityCriteria,
    this.applicationDeadline,
    this.startDate,
    required this.state,
    required this.category,
    required this.isActive,
    this.applicationUrl,
    this.documentsRequired = const [],
    this.benefits = '',
    this.applicationProcess = '',
    this.ministry = '',
    this.incomeLimit = 'Not specified',
    this.grantAmount = 'Varies',
    this.schemeStatus = 'Active',
  });

  factory Subsidy.fromJson(Map<String, dynamic> json) {
    String? adjustDate(String? dateStr) {
      if (dateStr == null || dateStr.isEmpty) return dateStr;
      try {
        final date = DateTime.parse(dateStr);
        final adjusted = date.subtract(const Duration(days: 1));
        return "${adjusted.year}-${adjusted.month.toString().padLeft(2, '0')}-${adjusted.day.toString().padLeft(2, '0')}";
      } catch (_) {
        return dateStr;
      }
    }

    // Handle documentsRequired as either List or String
    List<String> parseDocs(dynamic raw) {
      if (raw is List) {
        return raw.map((e) => e.toString()).where((s) => s.isNotEmpty).toList();
      } else if (raw is String && raw.isNotEmpty) {
        return raw.split('\n').where((s) => s.trim().isNotEmpty).toList();
      }
      return [];
    }

    return Subsidy(
      id: json['id'] ?? '',
      title: json['title'] ?? 'No Title',
      description: json['description'] ?? 'No Description',
      amount: (json['amount'] ?? 0).toDouble(),
      eligibilityCriteria: json['eligibilityCriteria'] ?? 'Not specified',
      applicationDeadline: adjustDate(json['applicationDeadline']),
      startDate: adjustDate(json['startDate']),
      state: json['state'] ?? 'All States',
      category: json['category'] ?? 'General',
      isActive: json['isActive'] ?? true,
      applicationUrl: json['applicationUrl'],
      documentsRequired: parseDocs(json['documentsRequired']),
      benefits: json['benefits'] ?? '',
      applicationProcess: json['applicationProcess'] ?? '',
      ministry: json['ministry'] ?? '',
      incomeLimit: json['incomeLimit'] ?? 'Not specified',
      grantAmount: json['grantAmount'] ?? 'Varies',
      schemeStatus: json['schemeStatus'] ?? 'Active',
    );
  }

  // Generate YouTube search URL for help videos about this scheme
  String get youtubeHelpUrl =>
      'https://www.youtube.com/results?search_query=${Uri.encodeComponent("$title scheme how to apply")}';  

  // Check if the scheme deadline has passed
  bool get isExpired {
    if (applicationDeadline == null) return false;
    try {
      final deadline = DateTime.parse(applicationDeadline!);
      // Ensure the deadline covers the entire day until 11:59:59 PM
      final endOfDay = DateTime(deadline.year, deadline.month, deadline.day, 23, 59, 59);
      return DateTime.now().isAfter(endOfDay);
    } catch (_) {
      return false;
    }
  }
}
