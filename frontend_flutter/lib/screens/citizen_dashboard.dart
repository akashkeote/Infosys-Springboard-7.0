import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/subsidy.dart';
import 'scheme_details_screen.dart';
import 'chatbot_screen.dart';

class CitizenDashboard extends StatefulWidget {
  const CitizenDashboard({super.key});

  @override
  State<CitizenDashboard> createState() => _CitizenDashboardState();
}

class _CitizenDashboardState extends State<CitizenDashboard> {
  int _selectedIndex = 0;
  String _searchQuery = '';
  String? _selectedState;
  String? _selectedCategory;
  String? _selectedMinistry;
  int _limit = 20;
  List<Subsidy> _subsidies = [];
  bool _isLoadingMore = false;
  late Future<List<Subsidy>> _schemesFuture;
  bool _isSyncing = false;

  // Stats from /api/subsidies/stats
  Map<String, dynamic>? _stats;
  bool _statsLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSchemes();
    _loadStats();
  }

  void _loadSchemes() {
    setState(() {
      _schemesFuture = ApiService().fetchSubsidies(
        search: _searchQuery,
        state: _selectedState,
        category: _selectedCategory,
        ministry: _selectedMinistry,
        limit: _limit,
      ).then((data) {
        _subsidies = data;
        return data;
      });
    });
  }

  void _loadStats() async {
    try {
      final stats = await ApiService().fetchStats();
      if (mounted) setState(() { _stats = stats; _statsLoading = false; });
    } catch (_) {
      if (mounted) setState(() => _statsLoading = false);
    }
  }

  void _loadMore() {
    setState(() { _limit += 20; _isLoadingMore = true; });
    ApiService().fetchSubsidies(
      search: _searchQuery,
      state: _selectedState,
      category: _selectedCategory,
      ministry: _selectedMinistry,
      limit: _limit,
    ).then((data) {
      setState(() {
        _subsidies = data;
        _isLoadingMore = false;
        _schemesFuture = Future.value(data);
      });
    });
  }

  void _syncSchemes() async {
    setState(() => _isSyncing = true);
    try {
      await ApiService().syncSchemes();
      _loadSchemes();
      _loadStats();
      setState(() => _isSyncing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Schemes synced!'), backgroundColor: Color(0xFF00BFA5)),
        );
      }
    } catch (e) {
      setState(() => _isSyncing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sync failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _resetFilters() {
    setState(() {
      _selectedState = null;
      _selectedCategory = null;
      _selectedMinistry = null;
      _searchQuery = '';
      _limit = 20;
    });
    _loadSchemes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GovGrant Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
          const CircleAvatar(
            backgroundColor: Color(0xFF1E88E5),
            child: Icon(Icons.person, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 16),
        ],
      ),
      drawer: _buildDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ---- STATS OVERVIEW ----
            const Text('Overview', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
            const SizedBox(height: 16),
            _buildStatsRow(),
            const SizedBox(height: 32),

            // ---- SCHEMES HEADER ----
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Available Schemes',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1A237E))),
                    if (_stats != null)
                      Text('${_stats!['totalSchemes']} total schemes',
                          style: const TextStyle(color: Colors.grey, fontSize: 13)),
                  ],
                ),
                _isSyncing
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                    : TextButton.icon(
                        onPressed: _syncSchemes,
                        icon: const Icon(Icons.sync, size: 18),
                        label: const Text('Sync'),
                      ),
              ],
            ),
            const SizedBox(height: 16),

            // ---- SEARCH ----
            TextField(
              decoration: InputDecoration(
                hintText: 'Search by keyword, ministry, category...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(icon: const Icon(Icons.clear), onPressed: () {
                        setState(() => _searchQuery = '');
                        _loadSchemes();
                      })
                    : null,
              ),
              onChanged: (val) {
                _searchQuery = val;
                _limit = 20;
                _loadSchemes();
              },
            ),
            const SizedBox(height: 12),

            // ---- FILTERS ROW 1: State + Category ----
            Row(
              children: [
                Expanded(child: _buildDropdown(
                  value: _selectedState ?? 'All States',
                  items: _stateList,
                  onChanged: (val) {
                    setState(() { _selectedState = val; _limit = 20; });
                    _loadSchemes();
                  },
                )),
                const SizedBox(width: 12),
                Expanded(child: _buildDropdown(
                  value: _selectedCategory ?? 'All Categories',
                  items: _categoryList,
                  onChanged: (val) {
                    setState(() { _selectedCategory = val; _limit = 20; });
                    _loadSchemes();
                  },
                )),
              ],
            ),
            const SizedBox(height: 12),

            // ---- FILTERS ROW 2: Ministry + Reset ----
            Row(
              children: [
                Expanded(child: _buildDropdown(
                  value: _selectedMinistry ?? 'All Ministries',
                  items: _ministryList,
                  onChanged: (val) {
                    setState(() { _selectedMinistry = val; _limit = 20; });
                    _loadSchemes();
                  },
                )),
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  onPressed: _resetFilters,
                  icon: const Icon(Icons.filter_alt_off, size: 16),
                  label: const Text('Reset'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // ---- SCHEME CARDS ----
            FutureBuilder<List<Subsidy>>(
              future: _schemesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting && _subsidies.isEmpty) {
                  return const Center(child: Padding(
                    padding: EdgeInsets.all(40.0),
                    child: CircularProgressIndicator(),
                  ));
                } else if (snapshot.hasError) {
                  return _buildErrorCard(snapshot.error.toString());
                } else if (_subsidies.isEmpty) {
                  return const Center(child: Padding(
                    padding: EdgeInsets.all(40.0),
                    child: Text('No schemes found. Try different filters.'),
                  ));
                }

                return Column(
                  children: [
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _subsidies.length,
                      itemBuilder: (context, index) {
                        final subsidy = _subsidies[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: InkWell(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => SchemeDetailsScreen(subsidy: subsidy)),
                            ),
                            borderRadius: BorderRadius.circular(16),
                            child: _buildSchemeCard(subsidy),
                          ),
                        );
                      },
                    ),
                    if (_subsidies.length >= _limit)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        child: _isLoadingMore
                            ? const CircularProgressIndicator()
                            : OutlinedButton(
                                onPressed: _loadMore,
                                child: const Text('Load More Schemes'),
                              ),
                      ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton(
            heroTag: 'chatbot',
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ChatbotScreen()),
            ),
            backgroundColor: const Color(0xFF1E88E5),
            child: const Icon(Icons.smart_toy, color: Colors.white),
          ),
          const SizedBox(height: 12),
          FloatingActionButton.extended(
            heroTag: 'apply',
            onPressed: () {},
            backgroundColor: const Color(0xFF00BFA5),
            icon: const Icon(Icons.add, color: Colors.white),
            label: const Text('Apply Grant', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.assignment), label: 'Applications'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  // =================== STATS ROW ===================

  Widget _buildStatsRow() {
    if (_statsLoading) {
      return Row(children: [
        Expanded(child: _buildSummaryCard('Total Schemes', '...', Icons.list_alt, const Color(0xFF1E88E5))),
        const SizedBox(width: 12),
        Expanded(child: _buildSummaryCard('Ministries', '...', Icons.account_balance, const Color(0xFF00BFA5))),
        const SizedBox(width: 12),
        Expanded(child: _buildSummaryCard('States', '...', Icons.map, Colors.orange)),
      ]);
    }
    if (_stats == null) {
      return Row(children: [
        Expanded(child: _buildSummaryCard('Total Schemes', 'N/A', Icons.list_alt, const Color(0xFF1E88E5))),
        const SizedBox(width: 12),
        Expanded(child: _buildSummaryCard('Backend', 'Offline', Icons.cloud_off, Colors.red)),
      ]);
    }
    final total = _stats!['totalSchemes']?.toString() ?? '0';
    final ministryCount = (_stats!['byMinistry'] as Map?)?.length.toString() ?? '0';
    final stateCount = (_stats!['byState'] as Map?)?.length.toString() ?? '0';

    return Row(
      children: [
        Expanded(child: _buildSummaryCard(total, 'Total Schemes', Icons.list_alt, const Color(0xFF1E88E5))),
        const SizedBox(width: 12),
        Expanded(child: _buildSummaryCard(ministryCount, 'Ministries', Icons.account_balance, const Color(0xFF00BFA5))),
        const SizedBox(width: 12),
        Expanded(child: _buildSummaryCard(stateCount, 'States / UTs', Icons.map, Colors.orange)),
      ],
    );
  }

  // =================== DRAWER ===================

  Widget _buildDrawer() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [Color(0xFF1E88E5), Color(0xFF00BFA5)]),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: const [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white,
                  child: Icon(Icons.person, color: Color(0xFF1E88E5), size: 32),
                ),
                SizedBox(height: 10),
                Text('GovGrant Tracker', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                Text('Testing Mode (No Auth)', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Dashboard'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.bar_chart),
            title: const Text('Analytics'),
            onTap: () {
              Navigator.pop(context);
              _showStatsDialog();
            },
          ),
          ListTile(
            leading: const Icon(Icons.history),
            title: const Text('Disbursement History'),
            onTap: () {},
          ),
          const Divider(),
          if (_stats != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                'Backend: ${_stats!['totalSchemes']} schemes loaded',
                style: const TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ),
        ],
      ),
    );
  }

  void _showStatsDialog() {
    if (_stats == null) return;
    final byCategory = Map<String, dynamic>.from(_stats!['byCategory'] ?? {});
    final byState = Map<String, dynamic>.from(_stats!['byState'] ?? {});

    // Sort by count desc
    final sortedCats = byCategory.entries.toList()
      ..sort((a, b) => (b.value as int).compareTo(a.value as int));
    final sortedStates = byState.entries.toList()
      ..sort((a, b) => (b.value as int).compareTo(a.value as int));

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Backend Analytics'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Total: ${_stats!['totalSchemes']} schemes', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 16),
              const Text('Top Categories:', style: TextStyle(fontWeight: FontWeight.bold)),
              ...sortedCats.take(8).map((e) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: Text(e.key, style: const TextStyle(fontSize: 13))),
                    Text('${e.value}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1E88E5))),
                  ],
                ),
              )),
              const SizedBox(height: 16),
              const Text('Top States:', style: TextStyle(fontWeight: FontWeight.bold)),
              ...sortedStates.take(8).map((e) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: Text(e.key, style: const TextStyle(fontSize: 13))),
                    Text('${e.value}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF00BFA5))),
                  ],
                ),
              )),
            ],
          ),
        ),
        actions: [TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close'))],
      ),
    );
  }

  // =================== HELPERS ===================

  Widget _buildDropdown({required String value, required List<String> items, required ValueChanged<String?> onChanged}) {
    return DropdownButtonFormField<String>(
      isExpanded: true,
      menuMaxHeight: 400,
      value: value,
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      items: items.map((s) => DropdownMenuItem(value: s, child: Text(s, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13)))).toList(),
      onChanged: onChanged,
    );
  }

  Widget _buildErrorCard(String error) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(top: 16),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(children: [
            Icon(Icons.error_outline, color: Colors.red),
            SizedBox(width: 8),
            Text('Backend Unavailable', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ]),
          const SizedBox(height: 8),
          const Text('Make sure Spring Boot backend is running on port 8080.',
              style: TextStyle(color: Colors.red, fontSize: 13)),
          const SizedBox(height: 4),
          Text(error, style: TextStyle(color: Colors.red.shade400, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(String value, String label, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildSchemeCard(Subsidy subsidy) {
    final expired = subsidy.isExpired;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: expired ? Colors.grey.shade50 : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: expired ? Colors.grey.shade300 : Colors.grey.withValues(alpha: 0.2)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: (expired ? Colors.grey : const Color(0xFF1E88E5)).withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.description, color: expired ? Colors.grey : const Color(0xFF1E88E5)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subsidy.title,
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15,
                        color: expired ? Colors.grey : const Color(0xFF1A237E))),
                const SizedBox(height: 4),
                Text('📍 ${subsidy.state}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                if (subsidy.ministry.isNotEmpty)
                  Text('🏛 ${subsidy.ministry}',
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      style: const TextStyle(color: Colors.blueGrey, fontSize: 11)),
                const SizedBox(height: 2),
                Text(
                  expired ? '⛔ Expired: ${subsidy.applicationDeadline}' : '📅 ${subsidy.applicationDeadline ?? "Open"}',
                  style: TextStyle(
                      color: expired ? Colors.red.shade400 : Colors.green.shade600,
                      fontSize: 12, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  subsidy.amount > 0 ? '₹${subsidy.amount.toStringAsFixed(0)}' : 'Varies',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15,
                      color: expired ? Colors.grey : const Color(0xFF1A237E)),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: (expired ? Colors.grey : const Color(0xFF1E88E5)).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(subsidy.category,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          color: expired ? Colors.grey : const Color(0xFF1E88E5),
                          fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =================== DATA LISTS ===================
  // These MUST match the actual values in schemes_real.json exactly

  static const List<String> _stateList = [
    'All States',
    'All',  // Central/National schemes
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra & Nagar Haveli and Daman & Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  static const List<String> _categoryList = [
    'All Categories',
    'Agriculture,Rural & Environment',
    'Banking,Financial Services and Insurance',
    'Business & Entrepreneurship',
    'Education & Learning',
    'Health & Wellness',
    'Housing & Shelter',
    'Public Safety,Law & Justice',
    'Science, IT & Communications',
    'Skills & Employment',
    'Social welfare & Empowerment',
    'Sports & Culture',
    'Transport & Infrastructure',
    'Travel & Tourism',
    'Utility & Sanitation',
    'Women and Child',
  ];

  static const List<String> _ministryList = [
    'All Ministries',
    'Ministry Of Agriculture And Farmers Welfare',
    'Ministry Of Chemicals And Fertilizers',
    'Ministry Of Civil Aviation',
    'Ministry Of Commerce And Industry',
    'Ministry Of Communications',
    'Ministry Of Consumer Affairs, Food And Public Distribution',
    'Ministry Of Culture',
    'Ministry Of Defence',
    'Ministry Of Development Of North Eastern Region',
    'Ministry Of Earth Sciences',
    'Ministry Of Education',
    'Ministry Of Electronics And Information Technology',
    'Ministry Of Environment, Forest And Climate Change',
    'Ministry Of Finance',
    'Ministry Of Fisheries, Animal Husbandry And Dairying',
    'Ministry Of Food Processing Industries',
    'Ministry Of Health And Family Welfare',
    'Ministry Of Heavy Industries',
    'Ministry Of Home Affairs',
    'Ministry Of Housing And Urban Affairs',
    'Ministry Of Information And Broadcasting',
    'Ministry Of Jal Shakti',
    'Ministry Of Labour And Employment',
    'Ministry Of Law And Justice',
    'Ministry Of Micro, Small And Medium Enterprises',
    'Ministry Of Mines',
    'Ministry Of New And Renewable Energy',
    'Ministry Of Panchayati Raj',
    'Ministry Of Petroleum And Natural Gas',
    'Ministry Of Ports, Shipping And Waterways',
    'Ministry Of Power',
    'Ministry Of Railways',
    'Ministry Of Road Transport And Highways',
    'Ministry Of Rural Development',
    'Ministry Of Science And Technology',
    'Ministry Of Skill Development And Entrepreneurship',
    'Ministry Of Social Justice And Empowerment',
    'Ministry Of Statistics And Programme Implementation',
    'Ministry Of Steel',
    'Ministry Of Textiles',
    'Ministry Of Tourism',
    'Ministry Of Tribal Affairs',
    'Ministry Of Women And Child Development',
    'Ministry Of Youth Affairs And Sports',
  ];

}
