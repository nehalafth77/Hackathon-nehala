// AI Service with realistic mock fallback
// Uses Gemini API if configured, otherwise returns detailed mock responses

const SUBJECTS = {
  'deadlock': 'Operating Systems',
  'normalization': 'DBMS',
  'tcp': 'Computer Networks',
  'udp': 'Computer Networks',
  'java': 'Java Programming',
  'inheritance': 'Java Programming',
  'dbms': 'Database Management Systems',
};

const mockResponses = {
  explain: (text) => ({
    simple: `Here's a simple explanation:\n\n${text.substring(0, 100)}...\n\nIn simple terms, this concept is about organizing and managing information efficiently. Think of it like organizing your school bag - you need a system to find things quickly.\n\n**Key Points:**\n- It helps organize data efficiently\n- Reduces redundancy and confusion\n- Makes searching and retrieving information faster\n- Used widely in computer science applications`,
    keyPoints: ['Organizes data systematically', 'Reduces redundancy', 'Improves efficiency', 'Widely applicable in CS'],
  }),
  
  summarize: (title) => ({
    summary: `This document covers important concepts related to ${title}. It provides comprehensive coverage of theoretical foundations and practical applications.`,
    keyConcepts: [
      'Core theoretical principles and definitions',
      'Practical implementation strategies', 
      'Common problems and their solutions',
      'Best practices and optimization techniques',
    ],
    importantPoints: [
      'Understanding the fundamental concepts is essential for exam preparation',
      'Focus on the relationships between different components',
      'Practice problems to solidify understanding',
      'Review examples and case studies provided',
    ],
    examNotes: 'Important topics for exam: definitions, algorithms, examples, and comparison of different approaches.',
  }),

  quiz: (subject) => ([
    {
      question: `Which of the following best describes a key concept in ${subject}?`,
      options: ['A fundamental organizing principle', 'A random sequence of events', 'An unrelated concept', 'None of the above'],
      correct: 0,
      explanation: 'The correct answer explains the core organizing principle that governs this concept.',
    },
    {
      question: `What is the primary purpose of studying ${subject}?`,
      options: ['To understand system behavior', 'To memorize formulas', 'To pass time', 'To confuse students'],
      correct: 0,
      explanation: 'Understanding system behavior is the primary goal of this subject area.',
    },
    {
      question: `Which approach is most efficient in ${subject}?`,
      options: ['Systematic analysis', 'Random guessing', 'Ignoring the problem', 'Using outdated methods'],
      correct: 0,
      explanation: 'Systematic analysis provides the most reliable and efficient approach.',
    },
    {
      question: `What is a common challenge when working with ${subject}?`,
      options: ['Managing complexity effectively', 'Finding textbooks', 'Too much free time', 'None'],
      correct: 0,
      explanation: 'Managing complexity is always a key challenge in this domain.',
    },
    {
      question: `How does ${subject} relate to real-world applications?`,
      options: ['It forms the theoretical basis for many systems', 'It has no real applications', 'Only used in academics', 'Only in research'],
      correct: 0,
      explanation: 'This subject forms the theoretical foundation for many practical systems used today.',
    },
  ]),

  chat: (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('deadlock')) {
      return `**Deadlock** is a situation in operating systems where two or more processes are permanently blocked, each waiting for a resource held by the other.\n\n**Simply put:** Imagine two people trying to pass each other in a narrow hallway - neither can move forward because each is waiting for the other to step back!\n\n**Four Conditions for Deadlock (Coffman Conditions):**\n1. **Mutual Exclusion** - Resources cannot be shared\n2. **Hold and Wait** - Process holds resources while waiting for more\n3. **No Preemption** - Resources cannot be forcibly taken\n4. **Circular Wait** - Chain of processes waiting for each other\n\n**Prevention Methods:**\n- Banker's Algorithm\n- Resource allocation graphs\n- Process scheduling strategies`;
    }
    
    if (q.includes('normalization')) {
      return `**Database Normalization** is the process of organizing a database to reduce redundancy and improve data integrity.\n\n**Normal Forms:**\n- **1NF** - Eliminate repeating groups, ensure atomic values\n- **2NF** - Remove partial dependencies\n- **3NF** - Remove transitive dependencies\n- **BCNF** - Boyce-Codd Normal Form (stricter 3NF)\n\n**Why Normalize?**\n✅ Reduces data redundancy\n✅ Eliminates update anomalies\n✅ Improves data consistency\n✅ Makes queries more efficient`;
    }

    if (q.includes('tcp') || q.includes('udp')) {
      return `**TCP vs UDP - The Key Difference:**\n\n**TCP (Transmission Control Protocol):**\n- Connection-oriented (handshake required)\n- Reliable delivery (acknowledgments)\n- Order guaranteed\n- Slower but dependable\n- Used for: Web browsing, email, file transfer\n\n**UDP (User Datagram Protocol):**\n- Connectionless\n- No guaranteed delivery\n- No order guarantee\n- Faster but unreliable\n- Used for: Video streaming, gaming, DNS\n\n**Memory trick:** TCP = Trustworthy, UDP = Ultrafast`;
    }

    if (q.includes('java') || q.includes('inheritance')) {
      return `**Java Inheritance** allows a class to inherit properties and methods from another class.\n\n**Types of Inheritance in Java:**\n- **Single** - One parent, one child\n- **Multilevel** - Chain of inheritance\n- **Hierarchical** - Multiple children from one parent\n- **Multiple** - Through interfaces only\n\n\`\`\`java\nclass Animal {\n  void eat() { System.out.println("Eating..."); }\n}\nclass Dog extends Animal {\n  void bark() { System.out.println("Barking..."); }\n}\n\`\`\`\n\n**Key Keywords:** extends, super, @Override, final`;
    }

    return `Great question! Here's what I know about **"${question}"**:\n\nThis is an important concept in computer science. Let me break it down:\n\n**Overview:**\nThis topic involves understanding key principles that govern how systems interact and process information.\n\n**Key Points to Remember:**\n1. Focus on the fundamental definitions first\n2. Understand the relationships between components\n3. Study real-world applications and examples\n4. Practice with past exam questions\n\n**Study Tips:**\n- Review your textbook chapter thoroughly\n- Create mind maps for better retention\n- Practice with MCQs and short answer questions\n- Form study groups for discussion\n\n*Need more specific help? Try asking about a specific topic like "deadlock", "normalization", "TCP/UDP", or "Java inheritance".*`;
  },
};

// Detect if AI API is available
const isAIAvailable = () => {
  return !!process.env.AI_API_KEY;
};

export const aiChat = async (question, context = '') => {
  if (isAIAvailable()) {
    // TODO: Integrate with Gemini/OpenAI API
    // const response = await callRealAI(question, context);
    // return response;
  }
  
  // Mock fallback
  return {
    response: mockResponses.chat(question),
    source: 'mock',
  };
};

export const aiSummarize = async (title, content = '') => {
  if (isAIAvailable()) {
    // TODO: Real AI summarization
  }
  
  return {
    ...mockResponses.summarize(title),
    source: 'mock',
  };
};

export const aiExplain = async (text) => {
  if (isAIAvailable()) {
    // TODO: Real AI explanation
  }
  
  return {
    ...mockResponses.explain(text),
    source: 'mock',
  };
};

export const aiGenerateQuiz = async (subject, content = '') => {
  if (isAIAvailable()) {
    // TODO: Real AI quiz generation
  }
  
  return {
    questions: mockResponses.quiz(subject || 'Computer Science'),
    source: 'mock',
  };
};

export const aiSuggestTags = async (title, subject = '') => {
  const commonTags = ['Important', 'Exam', 'Revision'];
  const titleWords = title.split(' ').filter(w => w.length > 3);
  return [...new Set([...commonTags, ...titleWords.slice(0, 3), subject].filter(Boolean))];
};
