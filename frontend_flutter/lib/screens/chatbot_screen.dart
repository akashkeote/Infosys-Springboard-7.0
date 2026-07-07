import 'package:flutter/material.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_ChatMessage> _messages = [];
  bool _isTyping = false;

  // Knowledge base for scheme-related queries
  static const Map<String, String> _schemeKnowledge = {
    'pm kisan': 'PM Kisan Samman Nidhi provides ₹6,000/year in 3 installments to all landholding farmer families. Apply at pmkisan.gov.in',
    'ayushman': 'Ayushman Bharat PM-JAY provides ₹5 Lakh/family/year for hospitalization. Check eligibility at pmjay.gov.in',
    'ujjwala': 'PM Ujjwala Yojana provides free LPG connections to BPL women. Apply through your nearest LPG distributor.',
    'mudra': 'PM Mudra Yojana provides loans up to ₹10 Lakh for small businesses without collateral. Apply at any bank.',
    'awas': 'PM Awas Yojana provides housing subsidy. Urban: up to ₹2.67L interest subsidy. Rural: ₹1.20L-₹1.30L assistance.',
    'ladli': 'Ladli Behna Yojana (MP) provides ₹1,250/month to women. Apply at cmladlibahna.mp.gov.in',
    'kisan': 'PM Kisan provides ₹6,000/year. Namo Shetkari (MH) adds ₹6,000 more for Maharashtra farmers.',
    'vishwakarma': 'PM Vishwakarma supports artisans in 18 trades with toolkit incentives + up to ₹3L credit. Apply at pmvishwakarma.gov.in',
    'scholarship': 'National Scholarship Portal (NSP) has 100+ scholarships. Visit scholarships.gov.in for all central & state scholarships.',
    'women': 'Major women schemes: Ladli Behna (MP), Majhi Ladki Bahin (MH), Mahalakshmi (Telangana), Lakshmir Bhandar (WB)',
    'farmer': 'Farmer schemes: PM Kisan (₹6K/yr), PM Fasal Bima (crop insurance), Rythu Bandhu (Telangana), Namo Shetkari (MH)',
    'education': 'Education schemes: Bihar Student Credit Card (₹4L loan), Pudhumai Penn (TN), NSP Scholarships, UP Free Smartphone',
    'health': 'Health schemes: Ayushman Bharat (₹5L/yr), Chiranjeevi (Rajasthan ₹25L), Aam Aadmi Clinics (Punjab)',
    'business': 'Business schemes: PM Mudra (₹10L loan), Stand-Up India (₹10L-₹1Cr for SC/ST/Women), PM Vishwakarma',
    'housing': 'Housing: PM Awas Yojana (Urban & Gramin), Mo Ghara (Odisha), Abua Awas (Jharkhand)',
    'apply': 'To apply for schemes:\n1. Visit myscheme.gov.in\n2. Enter your details\n3. Find eligible schemes\n4. Apply directly through official portals',
    'eligibility': 'Eligibility varies by scheme. Generally based on:\n• Income level\n• Age\n• Gender\n• State of residence\n• Caste category\n• Occupation\n\nUse our filters to find schemes matching your profile!',
    'documents': 'Common documents needed:\n• Aadhaar Card\n• Income Certificate\n• Bank Passbook\n• Caste Certificate (if applicable)\n• Domicile Certificate\n• Passport-size Photo',
  };

  static const List<String> _quickQuestions = [
    '🌾 Farmer schemes?',
    '👩 Women schemes?',
    '📚 Education schemes?',
    '🏥 Health schemes?',
    '🏠 Housing schemes?',
    '💼 Business loans?',
    '📋 How to apply?',
    '📄 Documents needed?',
  ];

  @override
  void initState() {
    super.initState();
    // Welcome message
    _messages.add(_ChatMessage(
      text: 'Namaste! 🙏 I\'m your Government Schemes Assistant.\n\nI can help you with:\n• Finding schemes for your needs\n• Eligibility information\n• How to apply\n• Required documents\n\nAsk me anything or tap a quick question below!',
      isBot: true,
    ));
  }

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;

    setState(() {
      _messages.add(_ChatMessage(text: text, isBot: false));
      _isTyping = true;
    });
    _controller.clear();
    _scrollToBottom();

    // Simulate thinking delay
    Future.delayed(const Duration(milliseconds: 800), () {
      final response = _getResponse(text);
      setState(() {
        _messages.add(_ChatMessage(text: response, isBot: true));
        _isTyping = false;
      });
      _scrollToBottom();
    });
  }

  String _getResponse(String query) {
    final q = query.toLowerCase().trim();

    // Check knowledge base
    for (final entry in _schemeKnowledge.entries) {
      if (q.contains(entry.key)) {
        return entry.value;
      }
    }

    // Generic keyword matching
    if (q.contains('hello') || q.contains('hi') || q.contains('namaste')) {
      return 'Namaste! 🙏 How can I help you today? You can ask about any government scheme, eligibility, or application process.';
    }
    if (q.contains('state') || q.contains('central')) {
      return 'We have 680+ Central schemes and 4040+ State/UT schemes available! Use the State filter on the Dashboard to browse schemes specific to your state.';
    }
    if (q.contains('thanks') || q.contains('thank') || q.contains('dhanyavaad')) {
      return 'You\'re welcome! 😊 Feel free to ask if you need any more help with government schemes.';
    }
    if (q.contains('subsidy') || q.contains('scheme') || q.contains('yojana')) {
      return 'We have 4700+ government schemes! You can:\n• Search by keyword on Dashboard\n• Filter by State (28 states + 8 UTs)\n• Filter by Category (Agriculture, Health, Education, etc.)\n\nWhat type of scheme are you looking for?';
    }

    // Default response
    return 'I\'m still learning! Here\'s what I can help with:\n\n'
        '• Ask about specific schemes (PM Kisan, Ayushman Bharat, etc.)\n'
        '• Ask by category (farmer, women, education, health)\n'
        '• Ask about eligibility & documents\n'
        '• Ask how to apply\n\n'
        'Try asking: "What schemes are available for farmers?"';
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.smart_toy, color: Colors.white),
            SizedBox(width: 8),
            Text('Scheme Assistant'),
          ],
        ),
        backgroundColor: const Color(0xFF1E88E5),
        foregroundColor: Colors.white,
        elevation: 2,
      ),
      body: Column(
        children: [
          // Chat messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isTyping) {
                  return _buildTypingIndicator();
                }
                return _buildMessageBubble(_messages[index]);
              },
            ),
          ),

          // Quick questions (show only at start)
          if (_messages.length <= 2)
            Container(
              height: 48,
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _quickQuestions.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      label: Text(_quickQuestions[index], style: const TextStyle(fontSize: 12)),
                      backgroundColor: const Color(0xFFE3F2FD),
                      onPressed: () => _sendMessage(_quickQuestions[index]),
                    ),
                  );
                },
              ),
            ),

          // Input bar
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 8, 16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: 'Ask about any scheme...',
                        hintStyle: TextStyle(color: Colors.grey.shade400),
                        filled: true,
                        fillColor: Colors.grey.shade100,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      ),
                      onSubmitted: _sendMessage,
                      textInputAction: TextInputAction.send,
                    ),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor: const Color(0xFF1E88E5),
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white, size: 20),
                      onPressed: () => _sendMessage(_controller.text),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(_ChatMessage message) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: message.isBot ? MainAxisAlignment.start : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (message.isBot)
            Container(
              margin: const EdgeInsets.only(right: 8, top: 4),
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: Color(0xFF1E88E5),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy, color: Colors.white, size: 16),
            ),
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: message.isBot ? Colors.white : const Color(0xFF1E88E5),
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(message.isBot ? 4 : 16),
                  bottomRight: Radius.circular(message.isBot ? 16 : 4),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                message.text,
                style: TextStyle(
                  color: message.isBot ? Colors.black87 : Colors.white,
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
            ),
          ),
          if (!message.isBot) const SizedBox(width: 32),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            margin: const EdgeInsets.only(right: 8),
            padding: const EdgeInsets.all(6),
            decoration: const BoxDecoration(
              color: Color(0xFF1E88E5),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.smart_toy, color: Colors.white, size: 16),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 6,
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (i) {
                return TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: 1),
                  duration: Duration(milliseconds: 600 + (i * 200)),
                  builder: (context, value, child) {
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: Colors.grey.withOpacity(0.3 + (value * 0.5)),
                        shape: BoxShape.circle,
                      ),
                    );
                  },
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}

class _ChatMessage {
  final String text;
  final bool isBot;

  _ChatMessage({required this.text, required this.isBot});
}
