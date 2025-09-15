// import React, { useState, useEffect, useRef } from 'react';
// import './MentalHealthChatbot.css';

// const MentalHealthChatbot = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm here to provide support and listen to you. How are you feeling today?",
//       sender: 'bot',
//       timestamp: new Date(),
//       emotion: 'supportive',
//       cbtTechnique: null
//     }
//   ]);
  
//   const [inputMessage, setInputMessage] = useState('');
//   const [userEmotion, setUserEmotion] = useState('neutral');
//   const [isTyping, setIsTyping] = useState(false);
//   const [crisisAlert, setCrisisAlert] = useState(false);
//   const [userProfile, setUserProfile] = useState({
//     name: 'User',
//     sessionCount: 1,
//     preferredTechniques: ['breathing', 'reframing'],
//     riskLevel: 'low'
//   });
  
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const cbtTechniques = {
//     reframing: "Let's try to look at this situation from a different perspective. What might be another way to view this?",
//     breathing: "I notice you might be feeling overwhelmed. Let's try a breathing exercise together. Breathe in for 4 counts, hold for 4, and exhale for 6.",
//     grounding: "Let's ground ourselves in the present moment. Can you name 5 things you can see, 4 things you can touch, 3 things you can hear?",
//     challenging: "I hear some negative thoughts. Let's examine the evidence for and against this thought. What facts support this belief?"
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const detectEmotion = (text) => {
//     // Simplified emotion detection - in real implementation, this would call your ML model
//     const anxietyKeywords = ['worried', 'anxious', 'scared', 'panic', 'overwhelmed'];
//     const sadnessKeywords = ['sad', 'depressed', 'down', 'hopeless', 'empty'];
//     const angerKeywords = ['angry', 'frustrated', 'mad', 'furious', 'irritated'];
//     const happyKeywords = ['happy', 'good', 'great', 'excited', 'wonderful'];
    
//     const lowerText = text.toLowerCase();
    
//     if (anxietyKeywords.some(word => lowerText.includes(word))) return 'anxious';
//     if (sadnessKeywords.some(word => lowerText.includes(word))) return 'sad';
//     if (angerKeywords.some(word => lowerText.includes(word))) return 'angry';
//     if (happyKeywords.some(word => lowerText.includes(word))) return 'happy';
    
//     return 'neutral';
//   };

//   const detectCrisis = (text) => {
//     // Crisis detection keywords - in real implementation, this would use more sophisticated NLP
//     const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself'];
//     return crisisKeywords.some(word => text.toLowerCase().includes(word));
//   };

//   const generateCBTResponse = (emotion, userText) => {
//     const responses = {
//       anxious: {
//         text: "I can sense you're feeling anxious right now. That's completely understandable. " + cbtTechniques.breathing,
//         technique: 'breathing'
//       },
//       sad: {
//         text: "I hear that you're going through a difficult time. Your feelings are valid. " + cbtTechniques.reframing,
//         technique: 'reframing'
//       },
//       angry: {
//         text: "It sounds like you're feeling frustrated. Let's work through this together. " + cbtTechniques.grounding,
//         technique: 'grounding'
//       },
//       happy: {
//         text: "I'm glad to hear you're feeling positive! What's contributing to these good feelings?",
//         technique: null
//       },
//       neutral: {
//         text: "Thank you for sharing with me. Can you tell me more about what's on your mind today?",
//         technique: null
//       }
//     };
    
//     return responses[emotion] || responses.neutral;
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMsg = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//       emotion: detectEmotion(inputMessage)
//     };

//     setMessages(prev => [...prev, userMsg]);
//     setUserEmotion(userMsg.emotion);
    
//     // Crisis detection
//     if (detectCrisis(inputMessage)) {
//       setCrisisAlert(true);
//     }
    
//     setInputMessage('');
//     setIsTyping(true);

//     // Simulate AI processing delay
//     setTimeout(() => {
//       const response = generateCBTResponse(userMsg.emotion, inputMessage);
      
//       const botMsg = {
//         id: Date.now() + 1,
//         text: response.text,
//         sender: 'bot',
//         timestamp: new Date(),
//         emotion: 'supportive',
//         cbtTechnique: response.technique
//       };
      
//       setMessages(prev => [...prev, botMsg]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const dismissCrisisAlert = () => {
//     setCrisisAlert(false);
//   };

//   const getEmotionClass = (emotion) => {
//     return `emotion-${emotion}`;
//   };

//   return (
//     <div className="chatbot-container">
//       {/* Crisis Alert Modal */}
//       {crisisAlert && (
//         <div className="crisis-overlay">
//           <div className="crisis-modal">
//             <h3 className="crisis-title">🚨 Crisis Support Detected</h3>
//             <p className="crisis-text">
//               I'm concerned about what you've shared. You don't have to go through this alone.
//             </p>
//             <div className="crisis-actions">
//               <button className="crisis-button">
//                 📞 Crisis Hotline: 988
//               </button>
//               <button className="emergency-button">
//                 🏥 Emergency: 911
//               </button>
//             </div>
//             <button className="dismiss-button" onClick={dismissCrisisAlert}>
//               Continue Chatting
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="header">
//         <div className="header-content">
//           <h1 className="title">🤖 MindSupport AI</h1>
//           <div className="user-info">
//             <span className="user-name">Hello, {userProfile.name}</span>
//             <div className="emotion-indicator">
//               Current mood: 
//               <span className={`emotion-badge ${getEmotionClass(userEmotion)}`}>
//                 {userEmotion}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="chat-area">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`message-container ${message.sender === 'user' ? 'user-container' : 'bot-container'}`}
//           >
//             <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
//               <div className="message-text">{message.text}</div>
//               <div className="message-meta">
//                 {message.cbtTechnique && (
//                   <span className="cbt-badge">
//                     CBT: {message.cbtTechnique}
//                   </span>
//                 )}
//                 <span className="timestamp">
//                   {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {isTyping && (
//           <div className="message-container bot-container">
//             <div className="message bot-message">
//               <div className="typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//                 MindSupport is typing...
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="input-area">
//         <div className="input-container">
//           <textarea
//             ref={inputRef}
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Share what's on your mind... I'm here to listen and support you."
//             className="text-input"
//             rows="2"
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim()}
//             className={`send-button ${!inputMessage.trim() ? 'disabled' : ''}`}
//           >
//             Send ➤
//           </button>
//         </div>
        
//         {/* Quick CBT Tools */}
//         <div className="quick-tools">
//           <span className="tools-label">Quick tools:</span>
//           <button 
//             className="tool-button" 
//             onClick={() => setInputMessage("I need help with breathing exercises")}
//           >
//             🌬️ Breathing
//           </button>
//           <button 
//             className="tool-button" 
//             onClick={() => setInputMessage("I'm having negative thoughts")}
//           >
//             🧠 Reframing
//           </button>
//           <button 
//             className="tool-button" 
//             onClick={() => setInputMessage("I feel overwhelmed")}
//           >
//             🌱 Grounding
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentalHealthChatbot;





import React, { useState, useEffect, useRef } from 'react';
import './MentalHealthChatbot.css';
import emotionDetectionService from './EmotionDetectionService';

const MentalHealthChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to provide support and listen to you. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      emotion: 'supportive',
      cbtTechnique: null,
      source: 'predefined'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [userEmotion, setUserEmotion] = useState({
    emotion: 'neutral',
    confidence: 0.1,
    intensity: 'mild',
    details: {}
  });
  const [isTyping, setIsTyping] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [isEmotionLoading, setIsEmotionLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    apiKey: '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',
    model: 'openai/gpt-3.5-turbo',
    useApi: true,
    fallbackToPredefined: true
  });
  
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    sessionCount: 1,
    preferredTechniques: ['breathing', 'reframing'],
    riskLevel: 'low',
    conversationHistory: []
  });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const cbtTechniques = {
    reframing: "Let's try to look at this situation from a different perspective. What might be another way to view this?",
    breathing: "I notice you might be feeling overwhelmed. Let's try a breathing exercise together. Breathe in for 4 counts, hold for 4, and exhale for 6.",
    grounding: "Let's ground ourselves in the present moment. Can you name 5 things you can see, 4 things you can touch, 3 things you can hear?",
    challenging: "I hear some negative thoughts. Let's examine the evidence for and against this thought. What facts support this belief?",
    mindfulness: "Let's practice some mindfulness. Focus on your breath and notice what you're feeling right now without judgment."
  };

  const availableModels = [
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', cost: 'Low' },
    { id: 'openai/gpt-4', name: 'GPT-4', cost: 'Medium' },
    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', cost: 'Medium' },
    { id: 'meta-llama/llama-2-70b-chat', name: 'Llama 2 70B', cost: 'Low' },
    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', cost: 'Very Low' }
  ];

  useEffect(() => {
    scrollToBottom();
    // Load API config from localStorage
    const savedConfig = localStorage.getItem('chatbot_api_config');
    if (savedConfig) {
      setApiConfig(JSON.parse(savedConfig));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const detectEmotion = (text) => {
    const anxietyKeywords = ['worried', 'anxious', 'scared', 'panic', 'overwhelmed', 'nervous', 'stress'];
    const sadnessKeywords = ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely', 'grief'];
    const angerKeywords = ['angry', 'frustrated', 'mad', 'furious', 'irritated', 'rage', 'annoyed'];
    const happyKeywords = ['happy', 'good', 'great', 'excited', 'wonderful', 'joy', 'pleased'];
    const fearKeywords = ['afraid', 'terrified', 'phobia', 'fear', 'scared'];
    
    const lowerText = text.toLowerCase();
    
    if (anxietyKeywords.some(word => lowerText.includes(word))) return 'anxious';
    if (sadnessKeywords.some(word => lowerText.includes(word))) return 'sad';
    if (angerKeywords.some(word => lowerText.includes(word))) return 'angry';
    if (fearKeywords.some(word => lowerText.includes(word))) return 'fearful';
    if (happyKeywords.some(word => lowerText.includes(word))) return 'happy';
    
    return 'neutral';
  };

  const detectCrisis = (text) => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself',
      'self harm', 'want to die', 'better off dead', 'no point living'
    ];
    return crisisKeywords.some(word => text.toLowerCase().includes(word));
  };

  const generatePredefinedResponse = (emotionData, userText) => {
    const emotion = emotionData.emotion;
    const intensity = emotionData.intensity;
    const confidence = emotionData.confidence;
    
    // Adjust response based on confidence and intensity
    const intensityModifier = intensity === 'high' ? ' very' : intensity === 'moderate' ? ' quite' : '';
    const confidenceNote = confidence > 0.7 ? '' : ' It seems like you might be feeling ';
    
    const responses = {
      anxious: {
        text: `I can sense you're feeling${intensityModifier} anxious right now${confidenceNote}. That's completely understandable and many people experience anxiety. ` + cbtTechniques.breathing,
        technique: 'breathing'
      },
      sad: {
        text: `I hear that you're going through a${intensityModifier} difficult time${confidenceNote}. Your feelings are valid and it's okay to feel sad. ` + cbtTechniques.reframing,
        technique: 'reframing'
      },
      angry: {
        text: `It sounds like you're feeling${intensityModifier} frustrated or angry${confidenceNote}. These are natural emotions, and let's work through this together. ` + cbtTechniques.grounding,
        technique: 'grounding'
      },
      fearful: {
        text: `I understand you're feeling${intensityModifier} afraid${confidenceNote}. Fear can be overwhelming, but you're safe here. ` + cbtTechniques.mindfulness,
        technique: 'mindfulness'
      },
      happy: {
        text: `I'm glad to hear you're feeling${intensityModifier} positive! What's contributing to these good feelings? It's wonderful to celebrate these moments.`,
        technique: null
      },
      confused: {
        text: `It seems like you're feeling${intensityModifier} uncertain or confused${confidenceNote}. That's okay - confusion can be a sign that you're processing important thoughts. ` + cbtTechniques.challenging,
        technique: 'challenging'
      },
      neutral: {
        text: `Thank you for sharing with me. I'm here to listen and support you. Can you tell me more about what's on your mind today?`,
        technique: null
      }
    };
    
    const response = responses[emotion] || responses.neutral;
    
    // Add confidence note if detection was uncertain
    if (confidence < 0.5) {
      response.text = `I'm picking up on some emotions in what you've shared. ${response.text}`;
    }
    
    return response;
  };

  const callOpenRouterAPI = async (userMessage, emotionData, conversationHistory) => {
    if (!apiConfig.apiKey) {
      throw new Error('API key not configured');
    }

    const emotion = emotionData.emotion;
    const confidence = emotionData.confidence;
    const intensity = emotionData.intensity;
    const details = emotionData.details;

    const systemPrompt = `You are an empathetic AI mental health support chatbot trained in Cognitive Behavioral Therapy (CBT) principles. 

IMPORTANT GUIDELINES:
- Provide compassionate, supportive responses
- Use CBT techniques when appropriate (cognitive reframing, behavioral activation, mindfulness, etc.)
- Detect and acknowledge the user's emotional state
- Never provide medical diagnosis or replace professional therapy
- If user expresses suicidal ideation, acknowledge their pain and encourage professional help
- Keep responses conversational and supportive

EMOTIONAL ANALYSIS:
- Detected emotion: ${emotion}
- Confidence level: ${(confidence * 100).toFixed(1)}%
- Intensity: ${intensity}
- Additional context: ${JSON.stringify(details)}

CONVERSATION CONTEXT:
${conversationHistory.slice(-6).map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

Provide a helpful, empathetic response that incorporates appropriate CBT techniques for someone feeling ${emotion} at ${intensity} intensity with ${(confidence * 100).toFixed(1)}% confidence.`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Mental Health Support Chatbot'
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content.trim(),
        technique: detectCBTTechnique(data.choices[0].message.content),
        source: 'api'
      };
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  };

  const detectCBTTechnique = (responseText) => {
    const text = responseText.toLowerCase();
    if (text.includes('breath') || text.includes('inhale') || text.includes('exhale')) return 'breathing';
    if (text.includes('reframe') || text.includes('perspective') || text.includes('think about')) return 'reframing';
    if (text.includes('ground') || text.includes('5 things') || text.includes('present moment')) return 'grounding';
    if (text.includes('evidence') || text.includes('challenge') || text.includes('examine')) return 'challenging';
    if (text.includes('mindful') || text.includes('awareness') || text.includes('observe')) return 'mindfulness';
    return null;
  };

  const generateHybridResponse = async (emotionData, userText) => {
    const predefinedResponse = generatePredefinedResponse(emotionData, userText);
    
    if (!apiConfig.useApi || !apiConfig.apiKey) {
      return { ...predefinedResponse, source: 'predefined' };
    }

    try {
      const apiResponse = await callOpenRouterAPI(userText, emotionData, userProfile.conversationHistory);
      
      // Combine API response with CBT technique if API didn't include one
      if (!apiResponse.technique && predefinedResponse.technique) {
        apiResponse.text += '\n\n' + cbtTechniques[predefinedResponse.technique];
        apiResponse.technique = predefinedResponse.technique;
      }
      
      return apiResponse;
    } catch (error) {
      console.error('API call failed:', error);
      
      if (apiConfig.fallbackToPredefined) {
        return { 
          ...predefinedResponse, 
          source: 'predefined',
          text: predefinedResponse.text + '\n\n(Note: Using offline support mode due to connectivity issues)'
        };
      } else {
        return {
          text: "I'm experiencing some technical difficulties right now. Please try again in a moment, or contact a human counselor if you need immediate support.",
          technique: null,
          source: 'error'
        };
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Detect emotion asynchronously
    const emotionData = await detectEmotion(inputMessage);

    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      emotion: emotionData.emotion,
      emotionData: emotionData // Store full emotion analysis
    };

    setMessages(prev => [...prev, userMsg]);
    setUserEmotion(emotionData); // Update with full emotion data
    
    // Update conversation history
    setUserProfile(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, userMsg].slice(-20) // Keep last 20 messages
    }));
    
    // Crisis detection - now with emotion confidence
    if (detectCrisis(inputMessage) || (emotionData.emotion === 'sad' && emotionData.intensity === 'high')) {
      setCrisisAlert(true);
    }
    
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await generateHybridResponse(emotionData, inputMessage);
      
      const botMsg = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'supportive',
        cbtTechnique: response.technique,
        source: response.source
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      // Update conversation history
      setUserProfile(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, botMsg].slice(-20)
      }));
      
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble responding right now. Please try again or contact a mental health professional if you need immediate support.",
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'supportive',
        cbtTechnique: null,
        source: 'error'
      };
      
      setMessages(prev => [...prev, errorMsg]);
    }
    
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const dismissCrisisAlert = () => {
    setCrisisAlert(false);
  };

  const saveApiConfig = () => {
    localStorage.setItem('chatbot_api_config', JSON.stringify(apiConfig));
    setShowApiSettings(false);
  };

  const getEmotionClass = (emotion) => {
    return `emotion-${emotion}`;
  };

  const getEmotionDisplay = (emotionData) => {
    if (typeof emotionData === 'string') {
      return emotionData;
    }
    
    const emotion = emotionData.emotion || 'neutral';
    const confidence = emotionData.confidence || 0;
    const intensity = emotionData.intensity || 'mild';
    
    // Show intensity and confidence for detailed view
    const intensityDesc = emotionDetectionService.getIntensityDescription(emotion, intensity);
    const confidencePercent = Math.round(confidence * 100);
    
    return `${intensityDesc} (${confidencePercent}%)`;
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'api': return 'AI';
      case 'predefined': return 'CBT';
      case 'error': return 'ERR';
      default: return '';
    }
  };

  return (
    <div className="chatbot-container">
      {/* API Settings Modal */}
      {showApiSettings && (
        <div className="crisis-overlay">
          <div className="api-settings-modal">
            <h3 className="api-settings-title">AI Configuration</h3>
            
            <div className="api-setting-group">
              <label className="api-label">
                <input
                  type="checkbox"
                  checked={apiConfig.useApi}
                  onChange={(e) => setApiConfig(prev => ({...prev, useApi: e.target.checked}))}
                />
                Enable AI-powered responses
              </label>
            </div>

            <div className="api-setting-group">
              <label className="api-label">OpenRouter API Key:</label>
              <input
                type="password"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig(prev => ({...prev, apiKey: e.target.value}))}
                placeholder="sk-or-v1-..."
                className="api-input"
              />
              <small className="api-help">Get your key from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">openrouter.ai</a></small>
            </div>

            <div className="api-setting-group">
              <label className="api-label">AI Model:</label>
              <select
                value={apiConfig.model}
                onChange={(e) => setApiConfig(prev => ({...prev, model: e.target.value}))}
                className="api-select"
              >
                {availableModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.cost} cost)
                  </option>
                ))}
              </select>
            </div>

            <div className="api-setting-group">
              <label className="api-label">
                <input
                  type="checkbox"
                  checked={apiConfig.fallbackToPredefined}
                  onChange={(e) => setApiConfig(prev => ({...prev, fallbackToPredefined: e.target.checked}))}
                />
                Fallback to predefined responses if API fails
              </label>
            </div>

            <div className="api-actions">
              <button className="api-save-button" onClick={saveApiConfig}>
                Save Settings
              </button>
              <button className="api-cancel-button" onClick={() => setShowApiSettings(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Alert Modal */}
      {crisisAlert && (
        <div className="crisis-overlay">
          <div className="crisis-modal">
            <h3 className="crisis-title">Crisis Support Detected</h3>
            <p className="crisis-text">
              I'm concerned about what you've shared. You don't have to go through this alone.
            </p>
            <div className="crisis-actions">
              <button className="crisis-button" onClick={() => window.open('tel:988')}>
                Crisis Hotline: 988
              </button>
              <button className="emergency-button" onClick={() => window.open('tel:911')}>
                Emergency: 911
              </button>
            </div>
            <button className="dismiss-button" onClick={dismissCrisisAlert}>
              Continue Chatting
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1 className="title">MindSupport AI</h1>
          <div className="header-controls">
            <button 
              className="settings-button"
              onClick={() => setShowApiSettings(true)}
              title="AI Settings"
            >
              Settings
            </button>
            <div className="user-info">
              <span className="user-name">Hello, {userProfile.name}</span>
              <div className="emotion-indicator">
                Current mood: 
                <span className={`emotion-badge ${getEmotionClass(userEmotion.emotion || 'neutral')}`}>
                  {getEmotionDisplay(userEmotion)}
                </span>
                {isEmotionLoading && <span className="emotion-loading">Analyzing...</span>}
              </div>
              {/* <div className="api-status">
                {apiConfig.useApi && apiConfig.apiKey ? 'AI Enhanced' : 'Basic Mode'}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-container ${message.sender === 'user' ? 'user-container' : 'bot-container'}`}
          >
            <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
              <div className="message-text">{message.text}</div>
              <div className="message-meta">
                {message.source && message.sender === 'bot' && (
                  <span className="source-badge" title={`Response source: ${message.source}`}>
                    {getSourceIcon(message.source)}
                  </span>
                )}
                {message.cbtTechnique && (
                  <span className="cbt-badge">
                    CBT: {message.cbtTechnique}
                  </span>
                )}
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message-container bot-container">
            <div className="message bot-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
                {apiConfig.useApi && apiConfig.apiKey ? 'AI is thinking...' : 'MindSupport is typing...'}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind... I'm here to listen and support you."
            className="text-input"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`send-button ${!inputMessage.trim() ? 'disabled' : ''}`}
          >
            Send ➤
          </button>
        </div>
        
        {/* Quick CBT Tools */}
        <div className="quick-tools">
          <span className="tools-label">Quick tools:</span>
          <button 
            className="tool-button" 
            onClick={() => setInputMessage("I need help with breathing exercises")}
          >
            Breathing
          </button>
          <button 
            className="tool-button" 
            onClick={() => setInputMessage("I'm having negative thoughts")}
          >
            Reframing
          </button>
          <button 
            className="tool-button" 
            onClick={() => setInputMessage("I feel overwhelmed")}
          >
            Grounding
          </button>
          <button 
            className="tool-button" 
            onClick={() => setInputMessage("Help me practice mindfulness")}
          >
            Mindfulness
          </button>
        </div>
        
        {/* API Status */}
        <div className="api-info">
          {apiConfig.useApi && apiConfig.apiKey ? (
            <span className="api-enabled">Enhanced with {availableModels.find(m => m.id === apiConfig.model)?.name}</span>
          ) : (
            <span className="api-disabled">Using predefined CBT responses only</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChatbot;