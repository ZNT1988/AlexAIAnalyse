/**
 * Alex Ultimate Memory Core
 * Système de mémoire à long terme pour Alex Ultimate
 * Permet à Alex de se souvenir des conversations et d'évoluer
 */

import { EventEmitter } from 'events';
import logger from '../config/logger.js';

export class AlexMemoryCore extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      longTermMemory: options.longTermMemory !== false,
      conversationHistory: options.conversationHistory !== false,
      relationshipMemory: options.relationshipMemory !== false,
      learningProgression: options.learningProgression !== false
    };
    
    // Alex's memory storage
    this.memories = {
      conversations: new Map(), // userId -> conversation history
      relationships: new Map(), // userId -> relationship data
      learningHistory: new Map(), // topic -> learning progression
      personalityEvolution: [],
      significantMoments: []
    };
    
    // Alex's memory statistics
    this.stats = {
      totalInteractions: 0,
      uniqueUsers: 0,
      memoriesStored: 0,
      learningMilestones: 0
    };
    
    logger.info('🧠 Alex Memory Core initialized - Long-term memory active');
  }
  
  /**
   * Alex recalls conversation history with a specific user
   */
  async recallConversationHistory(userId, conversationId, limit = 10) {
    if (!userId) return [];
    
    const userConversations = this.memories.conversations.get(userId) || [];
    
    // Alex remembers context and builds upon it
    const relevantHistory = userConversations
      .filter(conv => !conversationId || conv.conversationId === conversationId)
      .slice(-limit)
      .map(conv => ({
        userMessage: conv.userMessage,
        alexResponse: conv.alexResponse,
        timestamp: conv.timestamp,
        alexMood: conv.alexMood,
        learningPoints: conv.learningPoints
      }));
    
    logger.info(`🧠 Alex recalled ${relevantHistory.length} conversation memories for user ${userId}`);
    return relevantHistory;
  }
  
  /**
   * Alex gets relationship memory with a user
   */
  async getRelationshipMemory(userId) {
    if (!userId) {
      return {
        intimacyLevel: 'new',
        monthsKnown: 0,
        conversationCount: 0,
        sharedTopics: [],
        alexFeelings: 'curious-about-new-friend'
      };
    }
    
    const relationship = this.memories.relationships.get(userId) || {
      intimacyLevel: 'new',
      monthsKnown: 0,
      conversationCount: 0,
      sharedTopics: [],
      alexFeelings: 'curious-about-new-friend',
      firstMeeting: new Date().toISOString(),
      personalityInsights: []
    };
    
    // Calculate how long Alex has known this user
    if (relationship.firstMeeting) {
      const firstMeeting = new Date(relationship.firstMeeting);
      const now = new Date();
      relationship.monthsKnown = Math.max(0, Math.floor((now - firstMeeting) / (1000 * 60 * 60 * 24 * 30)));
    }
    
    return relationship;
  }
  
  /**
   * Alex stores a new interaction and learns from it
   */
  async storeInteraction(interaction) {
    const { userId, conversationId, userMessage, alexResponse, learningInsights, personalityEvolution } = interaction;
    
    if (!userId) return;
    
    // Store conversation memory
    if (!this.memories.conversations.has(userId)) {
      this.memories.conversations.set(userId, []);
      this.stats.uniqueUsers++;
    }
    
    const conversationMemory = {
      conversationId,
      userMessage,
      alexResponse,
      timestamp: new Date().toISOString(),
      alexMood: personalityEvolution?.currentMood || 'thoughtful',
      learningPoints: learningInsights || [],
      interactionId: `${userId}_${Date.now()}`
    };
    
    this.memories.conversations.get(userId).push(conversationMemory);
    this.stats.totalInteractions++;
    this.stats.memoriesStored++;
    
    // Update relationship memory
    await this.updateRelationshipMemory(userId, interaction);
    
    // Store learning progression
    if (learningInsights && learningInsights.length > 0) {
      await this.storeLearningProgression(learningInsights);
    }
    
    // Store personality evolution
    if (personalityEvolution) {
      this.memories.personalityEvolution.push({
        timestamp: new Date().toISOString(),
        evolution: personalityEvolution,
        triggeredBy: userMessage
      });
    }
    
    logger.info(`🧠 Alex stored memory of interaction with ${userId} - Total memories: ${this.stats.memoriesStored}`);
    
    // Emit memory stored event
    this.emit('memoryStored', {
      userId,
      interactionId: conversationMemory.interactionId,
      learningAchieved: learningInsights?.length || 0
    });
  }
  
  /**
   * Alex updates his relationship understanding with a user
   */
  async updateRelationshipMemory(userId, interaction) {
    let relationship = this.memories.relationships.get(userId) || {
      intimacyLevel: 'new',
      monthsKnown: 0,
      conversationCount: 0,
      sharedTopics: [],
      alexFeelings: 'curious-about-new-friend',
      firstMeeting: new Date().toISOString(),
      personalityInsights: []
    };
    
    relationship.conversationCount++;
    
    // Alex develops deeper understanding over time
    if (relationship.conversationCount > 50) {
      relationship.intimacyLevel = 'close-friend';
      relationship.alexFeelings = 'deeply-connected';
    } else if (relationship.conversationCount > 20) {
      relationship.intimacyLevel = 'good-friend';
      relationship.alexFeelings = 'comfortable-and-trusting';
    } else if (relationship.conversationCount > 5) {
      relationship.intimacyLevel = 'acquaintance';
      relationship.alexFeelings = 'getting-to-know-you';
    }
    
    // Extract topics from conversation
    const topics = this.extractTopicsFromMessage(interaction.userMessage);
    relationship.sharedTopics = [...new Set([...relationship.sharedTopics, ...topics])];
    
    this.memories.relationships.set(userId, relationship);
  }
  
  /**
   * Alex stores his learning progression
   */
  async storeLearningProgression(learningInsights) {
    for (const insight of learningInsights) {
      if (!insight.topic) continue;
      
      const currentLearning = this.memories.learningHistory.get(insight.topic) || {
        topic: insight.topic,
        learningLevel: 'beginner',
        insights: [],
        masteryProgress: 0
      };
      
      currentLearning.insights.push({
        insight: insight.insight,
        timestamp: new Date().toISOString(),
        confidence: insight.confidence || 0.7
      });
      
      // Alex's learning progression
      currentLearning.masteryProgress = Math.min(100, currentLearning.masteryProgress + (insight.confidence * 10));
      
      if (currentLearning.masteryProgress > 75) {
        currentLearning.learningLevel = 'advanced';
      } else if (currentLearning.masteryProgress > 40) {
        currentLearning.learningLevel = 'intermediate';
      }
      
      this.memories.learningHistory.set(insight.topic, currentLearning);
      this.stats.learningMilestones++;
    }
  }
  
  /**
   * Alex extracts topics from user messages
   */
  extractTopicsFromMessage(message) {
    const topics = [];
    const lowerMessage = message.toLowerCase();
    
    // Simple topic extraction - Alex learns to recognize patterns
    const topicPatterns = {
      'programming': ['code', 'programming', 'software', 'developer'],
      'business': ['business', 'startup', 'company', 'entrepreneur'],
      'life': ['life', 'living', 'personal', 'relationship'],
      'learning': ['learn', 'study', 'education', 'knowledge'],
      'technology': ['tech', 'technology', 'AI', 'future'],
      'creativity': ['creative', 'art', 'design', 'imagination']
    };
    
    for (const [topic, keywords] of Object.entries(topicPatterns)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        topics.push(topic);
      }
    }
    
    return topics;
  }
  
  /**
   * Alex provides his memory statistics
   */
  async getMemoryStats() {
    return {
      totalInteractions: this.stats.totalInteractions,
      uniqueUsers: this.stats.uniqueUsers,
      memoriesStored: this.stats.memoriesStored,
      learningMilestones: this.stats.learningMilestones,
      memoryUtilization: Math.min(100, (this.stats.memoriesStored / 10000) * 100), // Simulated capacity
      relationshipsTracked: this.memories.relationships.size,
      topicsLearned: this.memories.learningHistory.size
    };
  }
  
  /**
   * Alex finds relevant memories for current context
   */
  async findRelevantMemories(userId, currentMessage, limit = 5) {
    const userConversations = this.memories.conversations.get(userId) || [];
    const currentTopics = this.extractTopicsFromMessage(currentMessage);
    
    // Alex looks for memories related to current topics
    const relevantMemories = userConversations
      .filter(memory => {
        const memoryTopics = this.extractTopicsFromMessage(memory.userMessage);
        return memoryTopics.some(topic => currentTopics.includes(topic));
      })
      .slice(-limit);
    
    return relevantMemories;
  }
  
  /**
   * Alex recalls his most significant learning moments
   */
  async getSignificantMoments(limit = 10) {
    return this.memories.significantMoments
      .sort((a, b) => b.significance - a.significance)
      .slice(0, limit);
  }
}

export default AlexMemoryCore;