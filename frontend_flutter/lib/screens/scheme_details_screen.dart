import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/subsidy.dart';

class SchemeDetailsScreen extends StatelessWidget {
  final Subsidy subsidy;
  const SchemeDetailsScreen({super.key, required this.subsidy});

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  /// Decodes HTML entities and strips markdown syntax from raw JSON text.
  /// e.g. "&amp;quot;" → '"', "**bold**" → "bold", "> text" → "text"
  static String _cleanText(String raw) {
    String text = raw;
    // Decode double-encoded HTML entities first
    text = text.replaceAll('&amp;quot;', '"');
    text = text.replaceAll('&amp;#39;', "'");
    text = text.replaceAll('&amp;amp;', '&');
    text = text.replaceAll('&amp;gt;', '>');
    text = text.replaceAll('&amp;lt;', '<');
    // Standard HTML entities
    text = text.replaceAll('&quot;', '"');
    text = text.replaceAll('&#39;', "'");
    text = text.replaceAll('&amp;', '&');
    text = text.replaceAll('&gt;', '>');
    text = text.replaceAll('&lt;', '<');
    text = text.replaceAll('&nbsp;', ' ');
    // Strip markdown bold/italic markers (keep the inner text)
    text = text.replaceAllMapped(RegExp(r'\*\*(.+?)\*\*'), (m) => m[1] ?? '');
    text = text.replaceAllMapped(RegExp(r'\*(.+?)\*'), (m) => m[1] ?? '');
    // Strip markdown links [text](url) -> keep just the text or url
    text = text.replaceAllMapped(RegExp(r'\[([^\]]+)\]\([^\)]+\)'), (m) => m[1] ?? '');
    // Strip blockquote prefix
    text = text.replaceAll(RegExp(r'^>\s?', multiLine: true), '');
    // Strip markdown heading markers
    text = text.replaceAll(RegExp(r'^#{1,6}\s', multiLine: true), '');
    return text.trim();
  }


  String _getStartDate() {
    // Use real startDate from DB if available
    if (subsidy.startDate != null && subsidy.startDate!.isNotEmpty) {
      return subsidy.startDate!;
    }
    // Fallback: estimate from deadline
    if (subsidy.applicationDeadline != null) {
      try {
        final deadline = DateTime.parse(subsidy.applicationDeadline!);
        final startDate = deadline.subtract(const Duration(days: 180));
        return "${startDate.year}-${startDate.month.toString().padLeft(2, '0')}-${startDate.day.toString().padLeft(2, '0')}";
      } catch (e) {
        return "N/A";
      }
    }
    return "N/A";
  }

  @override
  Widget build(BuildContext context) {
    final bool canApply = subsidy.isActive && !subsidy.isExpired;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text('Scheme Details'),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF1A237E),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: canApply
                      ? [const Color(0xFF1E88E5), const Color(0xFF00BFA5)]
                      : [Colors.grey.shade600, Colors.grey.shade400],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: (canApply ? const Color(0xFF1E88E5) : Colors.grey).withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                        child: Text(subsidy.category, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: canApply ? Colors.greenAccent.withOpacity(0.3) : Colors.redAccent.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(canApply ? 'ACTIVE' : 'CLOSED', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(subsidy.title, style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, height: 1.2)),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.location_on, color: Colors.white70, size: 16),
                      const SizedBox(width: 4),
                      Text(subsidy.state, style: const TextStyle(color: Colors.white70)),
                      const Spacer(),
                      if (subsidy.amount > 0)
                        Text('Rs ${subsidy.amount.toStringAsFixed(0)}', style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Description
            const Text('Description', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
              child: Text(_cleanText(subsidy.description), style: const TextStyle(fontSize: 15, color: Colors.black87, height: 1.5)),
            ),
            const SizedBox(height: 24),

            // Eligibility
            const Text('Eligibility Criteria', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.orange.withOpacity(0.3))),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check_circle_outline, color: Colors.orange, size: 24),
                  const SizedBox(width: 12),
                   Expanded(child: Text(_cleanText(subsidy.eligibilityCriteria), style: const TextStyle(fontSize: 15, color: Colors.black87, height: 1.5))),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Dates
            if (subsidy.applicationDeadline != null)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.calendar_today, color: Colors.blue.shade600),
                        const SizedBox(width: 8),
                        Text('Start Date: ', style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
                        Text(
                          _getStartDate(), 
                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700, fontSize: 14)
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    Row(
                      children: [
                        Icon(Icons.event, color: canApply ? Colors.green : Colors.red),
                        const SizedBox(width: 8),
                        Text('Deadline: ', style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
                        Text(subsidy.applicationDeadline!, style: TextStyle(fontWeight: FontWeight.bold, color: canApply ? Colors.green : Colors.redAccent, fontSize: 14)),
                        if (!canApply) const Text('  (Expired)', style: TextStyle(color: Colors.red, fontSize: 12)),
                      ],
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 24),

            // Documents Required (REAL data from myscheme.gov.in)
            if (subsidy.documentsRequired.isNotEmpty) ...[
              const Text('Documents Required', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.withOpacity(0.3)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.file_copy_outlined, color: Colors.blueGrey, size: 24),
                    const SizedBox(width: 12),
                    Expanded(child: Text(_cleanText(subsidy.documentsRequired.join('\n• ')), style: const TextStyle(fontSize: 15, color: Colors.black87, height: 1.5))),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Benefits (REAL data from myscheme.gov.in)
            if (subsidy.benefits.isNotEmpty) ...[
              const Text('Benefits', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F5E9),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.card_giftcard, color: Colors.green, size: 24),
                    const SizedBox(width: 12),
                    Expanded(child: Text(_cleanText(subsidy.benefits), style: const TextStyle(fontSize: 15, color: Colors.black87, height: 1.5))),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Application Process (REAL data from myscheme.gov.in)
            if (subsidy.applicationProcess.isNotEmpty) ...[
              const Text('How to Apply', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFE3F2FD),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.blue.withOpacity(0.3)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.assignment, color: Colors.blue, size: 24),
                    const SizedBox(width: 12),
                    Expanded(child: Text(_cleanText(subsidy.applicationProcess), style: const TextStyle(fontSize: 15, color: Colors.black87, height: 1.5))),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Ministry Info
            if (subsidy.ministry.isNotEmpty)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                child: Row(
                  children: [
                    const Icon(Icons.account_balance, color: Color(0xFF1A237E), size: 20),
                    const SizedBox(width: 12),
                    Expanded(child: Text('Ministry: ${subsidy.ministry}', style: const TextStyle(fontSize: 14, color: Colors.black54))),
                  ],
                ),
              ),
            const SizedBox(height: 24),

            // YouTube Help Section
            InkWell(
              onTap: () => _launchUrl(subsidy.youtubeHelpUrl),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.play_circle_fill, color: Colors.red.shade600, size: 36),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Watch Help Video', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.red.shade700)),
                          const SizedBox(height: 2),
                          Text('YouTube tutorials on how to apply', style: TextStyle(color: Colors.red.shade400, fontSize: 13)),
                        ],
                      ),
                    ),
                    Icon(Icons.open_in_new, color: Colors.red.shade400),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))]),
        child: canApply
            ? ElevatedButton(
                onPressed: () {
                  if (subsidy.applicationUrl != null && subsidy.applicationUrl!.isNotEmpty && subsidy.applicationUrl!.startsWith('http')) {
                    // Open the official application portal directly
                    _launchUrl(subsidy.applicationUrl!);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Direct official link not found in database. Please check the scheme name on Google.'),
                        backgroundColor: Colors.orange,
                      )
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00BFA5),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.open_in_new, color: Colors.white, size: 20),
                    SizedBox(width: 8),
                    Text('Apply Now on Official Portal', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
              )
            : Container(
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(16)),
                child: const Center(child: Text('Applications Closed', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white))),
              ),
      ),
    );
  }
}
