import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  MOCK_MATERIALS,
  MOCK_SUBJECTS,
  MOCK_REVISION_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_TEACHER_PENDING_QUEUE,
  MOCK_KNOWLEDGE_MAP
} from '../data/mockData';
import toast from 'react-hot-toast';

const VaultContext = createContext(null);

export const VaultProvider = ({ children }) => {
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('studyvault_materials');
    return saved ? JSON.parse(saved) : MOCK_MATERIALS;
  });

  const [revisionTasks, setRevisionTasks] = useState(() => {
    const saved = localStorage.getItem('studyvault_revision');
    return saved ? JSON.parse(saved) : MOCK_REVISION_TASKS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('studyvault_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [teacherQueue, setTeacherQueue] = useState(() => {
    const saved = localStorage.getItem('studyvault_teacher_queue');
    return saved ? JSON.parse(saved) : MOCK_TEACHER_PENDING_QUEUE;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'DBMS Normalization',
    'Deadlock Prevention',
    'TCP 3-Way Handshake',
    'Virtual Memory Paging',
  ]);

  // Synchronize state changes to localStorage
  const saveMaterials = (newMaterials) => {
    setMaterials(newMaterials);
    localStorage.setItem('studyvault_materials', JSON.stringify(newMaterials));
  };

  const saveRevisionTasks = (newTasks) => {
    setRevisionTasks(newTasks);
    localStorage.setItem('studyvault_revision', JSON.stringify(newTasks));
  };

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem('studyvault_notifications', JSON.stringify(newNotifs));
  };

  // Search materials by query matching title, topic, subject, tags, summary
  const searchMaterials = (query) => {
    if (!query || !query.trim()) return materials;
    const q = query.toLowerCase();
    return materials.filter(m => {
      return (
        m.title.toLowerCase().includes(q) ||
        (m.topic && m.topic.toLowerCase().includes(q)) ||
        m.subject.toLowerCase().includes(q) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q))) ||
        (m.summary && m.summary.toLowerCase().includes(q)) ||
        (m.filename && m.filename.toLowerCase().includes(q))
      );
    });
  };

  // Check if a material is bookmarked
  const isBookmarked = (id) => {
    const mat = materials.find(m => m.id === id);
    return mat ? !!mat.isBookmarked : false;
  };

  // Toast helper
  const showToast = (message, type = 'success') => {
    if (type === 'error') toast.error(message);
    else if (type === 'info') toast(message, { icon: 'ℹ️' });
    else toast.success(message);
  };

  // Add a revision task from MaterialDetails
  const addRevisionTask = ({ subject, topic, unit, difficulty, materialId }) => {
    const exists = revisionTasks.find(t => t.title.toLowerCase() === topic.toLowerCase());
    if (exists) {
      toast('Topic is already in your revision queue');
      return;
    }
    const newTask = {
      id: `rev_${Date.now()}`,
      title: topic,
      subject,
      unit: unit || 'Unit 3',
      difficulty: difficulty || 'Medium',
      scheduledFor: 'Today',
      lastStudied: 'Just now',
      materialId: materialId || 'mat_01',
      masteryPercentage: 50,
      status: 'pending',
      keyPoints: [
        `Review fundamental concepts of ${topic}`,
        'Study university exam previous year solved questions',
      ],
    };
    saveRevisionTasks([newTask, ...revisionTasks]);
    toast.success(`"${topic}" added to Revision Center`);
  };

  // Toggle bookmark on a material
  const toggleBookmark = (id) => {
    const updated = materials.map(m => {
      if (m.id === id) {
        const next = !m.isBookmarked;
        toast.success(next ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
        return { ...m, isBookmarked: next };
      }
      return m;
    });
    saveMaterials(updated);
  };

  // Check duplicate logic (e.g. for "DBMS_Unit3_Notes.pdf" or similar titles)
  const checkDuplicate = (filename, title) => {
    const cleanFn = (filename || '').toLowerCase();
    const cleanTitle = (title || '').toLowerCase();

    // Check for match against existing materials
    const matched = materials.find(m => {
      const existingFn = m.filename.toLowerCase();
      const existingTitle = m.title.toLowerCase();
      return (
        (cleanFn.includes('dbms') && cleanFn.includes('unit3')) ||
        (cleanTitle.includes('normalization') && cleanTitle.includes('dbms')) ||
        (cleanFn.includes('deadlock') && existingFn.includes('deadlock')) ||
        existingFn === cleanFn
      );
    });

    if (matched) {
      return {
        isDuplicate: true,
        similarityPercentage: 92,
        matchedMaterial: matched,
        explanation: '92% semantic and text structure overlap with existing verified notes in your vault.',
      };
    }

    return { isDuplicate: false, similarityPercentage: 0 };
  };

  // Add newly uploaded material
  const addMaterial = (newMat) => {
    const formatted = {
      id: `mat_${Date.now()}`,
      title: newMat.title || 'Untitled Material',
      filename: newMat.filename || 'uploaded_document.pdf',
      subject: newMat.subject || 'Database Management Systems',
      subjectCode: newMat.subjectCode || 'CS301',
      unit: newMat.unit || 'Unit 3',
      topic: newMat.topic || 'General Topic',
      type: newMat.type || 'pdf',
      fileSize: newMat.fileSize || 1845600,
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: newMat.uploadedBy || 'Arjun Sharma',
      source: newMat.source || 'Class WhatsApp Group',
      isTeacherVerified: false,
      teacherName: null,
      verificationDate: null,
      healthScore: 90,
      examImportance: 4,
      viewCount: 1,
      downloadCount: 0,
      isBookmarked: false,
      tags: newMat.tags || ['Auto-Organized', 'AI Analyzed'],
      summary: newMat.summary || 'AI-summarized study notes with key revision concepts and formulas.',
      keyConcepts: newMat.keyConcepts || ['Key Definitions', 'Formulas', 'Exam Points'],
      matchReasons: 'Matched because this is freshly uploaded and categorized into your subject vault.',
    };

    saveMaterials([formatted, ...materials]);

    // Push notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      category: 'materials',
      title: 'Material Successfully Organized',
      message: `"${formatted.title}" was auto-categorized into ${formatted.subject} (${formatted.unit}).`,
      timestamp: 'Just now',
      isRead: false,
      materialId: formatted.id,
      badge: '✓ Auto-Organized',
    };
    saveNotifications([newNotif, ...notifications]);

    toast.success('Material added to your Study Vault');
    return formatted;
  };

  // Replace existing duplicate with new file
  const replaceMaterial = (existingId, newMat) => {
    const updated = materials.map(m => {
      if (m.id === existingId) {
        return {
          ...m,
          title: newMat.title || m.title,
          filename: newMat.filename || m.filename,
          uploadedDate: new Date().toISOString().split('T')[0],
          healthScore: 95,
        };
      }
      return m;
    });
    saveMaterials(updated);
    toast.success('Material updated and replaced');
  };

  // Mark revision task as complete
  const markTaskComplete = (taskId) => {
    const updated = revisionTasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        toast.success(nextStatus === 'completed' ? 'Revision completed! 🎉' : 'Marked as pending');
        return {
          ...t,
          status: nextStatus,
          masteryPercentage: nextStatus === 'completed' ? Math.min(100, t.masteryPercentage + 15) : t.masteryPercentage - 15,
        };
      }
      return t;
    });
    saveRevisionTasks(updated);
  };

  // Add a weak topic from Quiz to Revision Center
  const addWeakTopicToRevision = (topicName, subject = 'Database Management Systems') => {
    const exists = revisionTasks.find(t => t.title.toLowerCase() === topicName.toLowerCase());
    if (exists) {
      toast('Topic is already in your revision queue');
      return;
    }

    const newTask = {
      id: `rev_${Date.now()}`,
      title: topicName,
      subject: subject,
      unit: 'Unit 3',
      difficulty: 'Medium',
      scheduledFor: 'Today',
      lastStudied: 'Just now (Quiz)',
      materialId: 'mat_01',
      masteryPercentage: 40,
      status: 'pending',
      keyPoints: [
        `Review fundamental concepts of ${topicName}`,
        'Study university exam previous year solved questions',
        'Retake 5-question targeted quiz'
      ],
    };

    saveRevisionTasks([newTask, ...revisionTasks]);

    // Push notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      category: 'revision',
      title: 'Weak Topic Added to Revision',
      message: `"${topicName}" was scheduled for spaced repetition review based on your quiz results.`,
      timestamp: 'Just now',
      isRead: false,
      badge: '🧠 Revision Due',
    };
    saveNotifications([newNotif, ...notifications]);

    toast.success(`"${topicName}" added to Revision Center`);
  };

  // Teacher Approval Actions
  const approveMaterial = (queueId) => {
    const item = teacherQueue.find(q => q.id === queueId);
    if (!item) return;

    setTeacherQueue(prev => prev.filter(q => q.id !== queueId));

    // Update material verified state if exists
    const updatedMats = materials.map(m => {
      if (m.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 15))) {
        return {
          ...m,
          isTeacherVerified: true,
          teacherName: 'Dr. Sarah Thomas',
          verificationDate: new Date().toISOString().split('T')[0],
          healthScore: Math.min(100, m.healthScore + 8),
        };
      }
      return m;
    });
    saveMaterials(updatedMats);

    // Add notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      category: 'verification',
      title: 'Material Approved & Verified',
      message: `You verified "${item.title}" for all students in ${item.subject}.`,
      timestamp: 'Just now',
      isRead: false,
      badge: '✓ Approved',
    };
    saveNotifications([newNotif, ...notifications]);

    toast.success(`"${item.title}" approved and verified`);
  };

  const rejectMaterial = (queueId, reason = 'Inaccurate or duplicate notes') => {
    const item = teacherQueue.find(q => q.id === queueId);
    if (!item) return;

    setTeacherQueue(prev => prev.filter(q => q.id !== queueId));
    toast.error(`"${item.title}" rejected: ${reason}`);
  };

  // Notification read triggers
  const markNotificationRead = (id) => {
    saveNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    saveNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  // Search Helpers
  const addSearchHistory = (q) => {
    if (!q || recentSearches.includes(q)) return;
    setRecentSearches(prev => [q, ...prev.slice(0, 5)]);
  };

  const deleteRevisionTask = (taskId) => {
    saveRevisionTasks(revisionTasks.filter(t => t.id !== taskId));
    toast.success('Task removed from revision queue');
  };

  const addCustomRevisionTask = ({ title, subject, unit, difficulty }) => {
    const newTask = {
      id: `rev_${Date.now()}`,
      title: title || 'Custom Topic',
      subject: subject || 'Computer Science',
      unit: unit || 'Unit 1',
      difficulty: difficulty || 'Medium',
      scheduledFor: 'Today',
      lastStudied: 'Added manually',
      materialId: 'mat_01',
      masteryPercentage: 30,
      status: 'pending',
      keyPoints: [
        `Review and practice key formulas of ${title}`,
        'Study previous year university questions',
      ],
    };
    saveRevisionTasks([newTask, ...revisionTasks]);
    toast.success(`"${title}" added to Revision Center`);
  };

  const resetToDefaults = () => {
    localStorage.removeItem('studyvault_materials');
    localStorage.removeItem('studyvault_revision');
    localStorage.removeItem('studyvault_notifications');
    localStorage.removeItem('studyvault_teacher_queue');
    setMaterials(MOCK_MATERIALS);
    setRevisionTasks(MOCK_REVISION_TASKS);
    setNotifications(MOCK_NOTIFICATIONS);
    setTeacherQueue(MOCK_TEACHER_PENDING_QUEUE);
    toast.success('Workspace reset to clean default demonstration data');
  };

  // Analytics stats
  const stats = useMemo(() => {
    const verified = materials.filter(m => m.isTeacherVerified).length + 24; // Baseline verified count
    const totalMaterials = materials.length + 116; // Baseline vault count (128)
    const activeRevisionTasks = revisionTasks.filter(t => t.status === 'pending').length;

    return {
      totalMaterials,
      totalSubjects: 14,
      teacherVerified: verified,
      revisionTasks: activeRevisionTasks,
    };
  }, [materials, revisionTasks]);

  return (
    <VaultContext.Provider
      value={{
        materials,
        subjects: MOCK_SUBJECTS,
        revisionTasks,
        notifications,
        teacherQueue,
        pendingVerifications: teacherQueue,
        knowledgeMap: MOCK_KNOWLEDGE_MAP,
        stats,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addSearchHistory,
        searchMaterials,
        isBookmarked,
        showToast,
        toggleBookmark,
        checkDuplicate,
        addMaterial,
        addRevisionTask,
        replaceMaterial,
        markTaskComplete,
        deleteRevisionTask,
        addCustomRevisionTask,
        resetToDefaults,
        addWeakTopicToRevision,
        approveMaterial,
        rejectMaterial,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
};
