// EmotionDetectionService.js - Advanced Emotion Detection
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import Sentiment from 'sentiment';
import { pipeline } from '@xenova/transformers';

class EmotionDetectionService {
  constructor() {
    this.isModelLoaded = false;
    this.sentimentAnalyzer = new Sentiment();
    this.emotionClassifier = null;
    this.initializeModels();
  }

  async initializeModels() {
    try {
      console.log('Loading emotion detection models...');
      
      // Initialize Hugging Face transformer for emotion detection
      this.emotionClassifier = await pipeline(
        'text-classification', 
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
      
      this.isModelLoaded = true;
      console.log('Emotion detection models loaded successfully!');
    } catch (error) {
      console.warn('Failed to load advanced models, using fallback methods:', error);
      this.isModelLoaded = false;
    }
  }

  // Main emotion detection method
  async detectEmotion(text) {
    if (!text || text.trim().length === 0) {
      return this.getDefaultEmotion();
    }

    try {
      // Try advanced AI detection first
      if (this.isModelLoaded && this.emotionClassifier) {
        return await this.detectWithAI(text);
      }
      
      // Fallback to hybrid approach
      return await this.detectWithHybrid(text);
    } catch (error) {
      console.warn('Emotion detection error:', error);
      return this.detectWithKeywords(text);
    }
  }

  // AI-powered emotion detection
  async detectWithAI(text) {
    try {
      const results = await this.emotionClassifier(text);
      const sentimentScore = this.sentimentAnalyzer.analyze(text);
      
      // Combine AI results with sentiment analysis
      const aiEmotion = results[0];
      const emotion = this.mapAIResultToEmotion(aiEmotion, sentimentScore);
      
      return {
        emotion: emotion.primary,
        confidence: Math.round(aiEmotion.score * 100) / 100,
        intensity: emotion.intensity,
        sentimentScore: sentimentScore.score,
        details: {
          positive: results.find(r => r.label === 'POSITIVE')?.score || 0,
          negative: results.find(r => r.label === 'NEGATIVE')?.score || 0,
          comparative: sentimentScore.comparative
        },
        source: 'ai'
      };
    } catch (error) {
      console.warn('AI detection failed:', error);
      return this.detectWithHybrid(text);
    }
  }

  // Hybrid approach: sentiment + advanced keywords + context
  async detectWithHybrid(text) {
    const sentimentResult = this.sentimentAnalyzer.analyze(text);
    const keywordResult = this.detectWithKeywords(text);
    const contextResult = this.analyzeEmotionalContext(text);
    
    // Combine results with weighting
    const combinedEmotion = this.combineEmotionResults([
      { ...keywordResult, weight: 0.4 },
      { emotion: this.sentimentToEmotion(sentimentResult), confidence: Math.abs(sentimentResult.comparative), weight: 0.3 },
      { ...contextResult, weight: 0.3 }
    ]);

    return {
      emotion: combinedEmotion.emotion,
      confidence: combinedEmotion.confidence,
      intensity: this.calculateIntensity(text, sentimentResult),
      sentimentScore: sentimentResult.score,
      details: {
        keywords: keywordResult.matchedKeywords || [],
        sentiment: sentimentResult.comparative,
        contextClues: contextResult.contextClues || []
      },
      source: 'hybrid'
    };
  }

  // Enhanced keyword-based detection
  detectWithKeywords(text) {
    const lowerText = text.toLowerCase();
    
    const emotionKeywords = {
      anxious: {
        keywords: ['worried', 'anxious', 'scared', 'panic', 'overwhelmed', 'nervous', 'stress', 'tense', 'uneasy', 'restless'],
        intensity: ['mild', 'moderate', 'severe', 'panic']
      },
      sad: {
        keywords: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely', 'grief', 'heartbroken', 'miserable', 'dejected'],
        intensity: ['melancholy', 'sad', 'deeply sad', 'devastated']
      },
      angry: {
        keywords: ['angry', 'frustrated', 'mad', 'furious', 'irritated', 'rage', 'annoyed', 'livid', 'outraged', 'hostile'],
        intensity: ['annoyed', 'frustrated', 'angry', 'furious']
      },
      fearful: {
        keywords: ['afraid', 'terrified', 'phobia', 'fear', 'scared', 'frightened', 'dread', 'alarmed'],
        intensity: ['worried', 'afraid', 'terrified', 'petrified']
      },
      happy: {
        keywords: ['happy', 'good', 'great', 'excited', 'wonderful', 'joy', 'pleased', 'elated', 'thrilled', 'content'],
        intensity: ['content', 'happy', 'very happy', 'ecstatic']
      },
      confused: {
        keywords: ['confused', 'lost', 'unsure', 'uncertain', 'puzzled', 'bewildered', 'perplexed'],
        intensity: ['uncertain', 'confused', 'very confused', 'bewildered']
      }
    };

    let bestMatch = { emotion: 'neutral', confidence: 0, matchedKeywords: [] };
    let maxScore = 0;

    for (const [emotion, data] of Object.entries(emotionKeywords)) {
      const matchedWords = data.keywords.filter(keyword => lowerText.includes(keyword));
      const score = matchedWords.length;
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = {
          emotion,
          confidence: Math.min(score * 0.3 + 0.1, 0.9),
          matchedKeywords: matchedWords,
          intensity: this.determineIntensityFromKeywords(lowerText, data.intensity)
        };
      }
    }

    return bestMatch;
  }

  // Analyze emotional context and patterns
  analyzeEmotionalContext(text) {
    const contextPatterns = {
      escalation: /\b(getting worse|can't take|enough|too much)\b/gi,
      improvement: /\b(better|feeling good|improving|progress)\b/gi,
      isolation: /\b(alone|nobody|no one|isolated|lonely)\b/gi,
      support: /\b(help|support|friend|family|together)\b/gi,
      crisis: /\b(can't go on|end it|give up|hopeless)\b/gi
    };

    const contextClues = [];
    let contextEmotion = 'neutral';
    let confidence = 0.1;

    for (const [pattern, regex] of Object.entries(contextPatterns)) {
      const matches = text.match(regex);
      if (matches) {
        contextClues.push({ pattern, matches: matches.length });
        
        // Influence emotion based on context
        switch (pattern) {
          case 'escalation':
          case 'crisis':
            contextEmotion = 'anxious';
            confidence = 0.8;
            break;
          case 'isolation':
            contextEmotion = 'sad';
            confidence = 0.6;
            break;
          case 'improvement':
          case 'support':
            contextEmotion = 'happy';
            confidence = 0.5;
            break;
        }
      }
    }

    return { emotion: contextEmotion, confidence, contextClues };
  }

  // Helper methods
  mapAIResultToEmotion(aiResult, sentimentResult) {
    const label = aiResult.label.toLowerCase();
    const score = aiResult.score;
    
    let emotion = 'neutral';
    let intensity = 'mild';

    if (label.includes('positive') && score > 0.6) {
      emotion = 'happy';
      intensity = score > 0.8 ? 'high' : 'moderate';
    } else if (label.includes('negative') && score > 0.6) {
      // Use sentiment details to determine specific negative emotion
      if (sentimentResult.score < -3) {
        emotion = 'sad';
      } else if (sentimentResult.score < -1) {
        emotion = 'anxious';
      } else {
        emotion = 'sad';
      }
      intensity = score > 0.8 ? 'high' : 'moderate';
    }

    return { primary: emotion, intensity };
  }

  sentimentToEmotion(sentimentResult) {
    const score = sentimentResult.score;
    const comparative = sentimentResult.comparative;

    if (comparative > 0.1) return 'happy';
    if (comparative < -0.1) return 'sad';
    if (comparative < -0.05) return 'anxious';
    return 'neutral';
  }

  combineEmotionResults(results) {
    const emotionScores = {};
    let totalWeight = 0;

    results.forEach(result => {
      const emotion = result.emotion;
      const confidence = result.confidence || 0.1;
      const weight = result.weight || 1;
      
      if (!emotionScores[emotion]) {
        emotionScores[emotion] = 0;
      }
      
      emotionScores[emotion] += confidence * weight;
      totalWeight += weight;
    });

    // Find highest scoring emotion
    let bestEmotion = 'neutral';
    let bestScore = 0;

    for (const [emotion, score] of Object.entries(emotionScores)) {
      const normalizedScore = score / totalWeight;
      if (normalizedScore > bestScore) {
        bestScore = normalizedScore;
        bestEmotion = emotion;
      }
    }

    return {
      emotion: bestEmotion,
      confidence: Math.min(bestScore, 0.95)
    };
  }

  calculateIntensity(text, sentimentResult) {
    const intensityWords = ['very', 'extremely', 'really', 'so', 'totally', 'completely'];
    const matches = intensityWords.filter(word => text.toLowerCase().includes(word)).length;
    const sentimentMagnitude = Math.abs(sentimentResult.comparative);
    
    if (matches >= 2 || sentimentMagnitude > 0.5) return 'high';
    if (matches >= 1 || sentimentMagnitude > 0.2) return 'moderate';
    return 'mild';
  }

  determineIntensityFromKeywords(text, intensityLevels) {
    const intensifiers = ['very', 'extremely', 'really', 'so', 'totally'];
    const matchCount = intensifiers.filter(word => text.includes(word)).length;
    
    if (matchCount >= 2) return intensityLevels[3] || 'high';
    if (matchCount >= 1) return intensityLevels[2] || 'moderate';
    return intensityLevels[0] || 'mild';
  }

  getDefaultEmotion() {
    return {
      emotion: 'neutral',
      confidence: 0.1,
      intensity: 'mild',
      sentimentScore: 0,
      details: {},
      source: 'default'
    };
  }

  // Get emotion color for UI
  getEmotionColor(emotion) {
    const colors = {
      happy: '#4CAF50',
      sad: '#2196F3', 
      anxious: '#FF9800',
      angry: '#F44336',
      fearful: '#9C27B0',
      confused: '#607D8B',
      neutral: '#9E9E9E'
    };
    return colors[emotion] || colors.neutral;
  }

  // Get emotion intensity description
  getIntensityDescription(emotion, intensity) {
    const descriptions = {
      happy: { mild: 'Content', moderate: 'Happy', high: 'Joyful' },
      sad: { mild: 'Down', moderate: 'Sad', high: 'Deeply sad' },
      anxious: { mild: 'Worried', moderate: 'Anxious', high: 'Very anxious' },
      angry: { mild: 'Annoyed', moderate: 'Frustrated', high: 'Furious' },
      fearful: { mild: 'Concerned', moderate: 'Afraid', high: 'Terrified' },
      confused: { mild: 'Uncertain', moderate: 'Confused', high: 'Bewildered' },
      neutral: { mild: 'Calm', moderate: 'Neutral', high: 'Neutral' }
    };
    
    return descriptions[emotion]?.[intensity] || 'Neutral';
  }
}

// Create singleton instance
const emotionDetectionService = new EmotionDetectionService();

export default emotionDetectionService;