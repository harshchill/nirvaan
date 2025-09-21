"use client";
import { useState } from "react";

// Import the parsing functions from ChatWidget
function parseAIResponse(text) {
  const lines = text.split(/\n/);
  const processedLines = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      processedLines.push({ type: 'separator', content: '' });
      continue;
    }
    
    if (trimmedLine.match(/^\d+\.\s/)) {
      processedLines.push({ type: 'numbered', content: trimmedLine });
    }
    else if (trimmedLine.includes('**')) {
      processedLines.push({ type: 'bold', content: trimmedLine });
    }
    else if (trimmedLine.endsWith('?') && !trimmedLine.includes('**')) {
      processedLines.push({ type: 'question', content: trimmedLine });
    }
    else {
      processedLines.push({ type: 'regular', content: trimmedLine });
    }
  }
  
  return (
    <div className="space-y-3">
      {processedLines.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="h-3" />;
        }
        
        switch (item.type) {
          case 'numbered':
            return <NumberedListItem key={index} text={item.content} />;
          case 'bold':
            return <BoldText key={index} text={item.content} />;
          case 'question':
            return <QuestionText key={index} text={item.content} />;
          default:
            return <RegularText key={index} text={item.content} />;
        }
      })}
    </div>
  );
}

function NumberedListItem({ text }) {
  const match = text.match(/^(\d+)\.\s(.+)$/);
  if (!match) return <RegularText text={text} />;
  
  const [, number, content] = match;
  const formattedContent = parseBoldText(content);
  
  return (
    <div className="flex gap-3 items-start mb-2">
      <span className="flex-shrink-0 w-6 h-6 bg-[#d9b491] text-white rounded-full flex items-center justify-center text-xs font-semibold">
        {number}
      </span>
      <div className="flex-1 text-gray-800 leading-relaxed">{formattedContent}</div>
    </div>
  );
}

function BoldText({ text }) {
  const formattedText = parseBoldText(text);
  return (
    <div className="font-medium text-gray-900">
      {formattedText}
    </div>
  );
}

function QuestionText({ text }) {
  return (
    <div className="text-[#d9b491] font-medium">
      {text}
    </div>
  );
}

function RegularText({ text }) {
  const formattedText = parseBoldText(text);
  return <div>{formattedText}</div>;
}

function parseBoldText(text) {
  const parts = text.split(/(\*\*.*?\*\*)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-gray-900">
          {boldText}
        </strong>
      );
    }
    
    if (part.includes(';)') || part.includes(':)')) {
      return (
        <span key={index} className="text-[#d9b491]">
          {part}
        </span>
      );
    }
    
    return <span key={index}>{part}</span>;
  });
}

export default function ResponseParserTest() {
  const [showParsed, setShowParsed] = useState(false);
  
  const exampleResponse = `can do a variety of things to help and entertain you. Here are some examples:
1. **Answer questions**: I can provide information on a wide range of topics, from science and history to entertainment and culture.
2. **Generate text**: I can create text based on a prompt or topic, and can even help with writing tasks like proofreading and editing.
3. **Translate languages**: I can translate text from one language to another, including popular languages like Spanish, French, and Chinese.
4. **Summarize content**: I can summarize long pieces of text into shorter, more digestible versions, highlighting the main points and key information.
5. **Offer suggestions**: I can provide suggestions for things like gift ideas, travel destinations, and books or movies to read or watch.
6. **Chat and converse**: I can have a conversation with you, using context and understanding to respond to your questions and statements.
7. **Play games**: I can play simple text-based games with you, like Hangman or 20 Questions.
8. **Create stories**: I can generate short stories or even entire novels based on prompts or ideas you provide.
9. **Explain concepts**: I can explain complex concepts or ideas in simple, easy-to-understand terms.
10. **Provide definitions**: I can define words and phrases, and provide examples of how they are used in context.
What sounds interesting to you?;)`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Response Parser Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Raw Response</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
            {exampleResponse}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Parsed Response</h2>
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-[#fff5ec] flex items-center justify-center text-xs mb-3">
              🧘
            </div>
            {parseAIResponse(exampleResponse)}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowParsed(!showParsed)}
          className="btn btn-primary"
        >
          {showParsed ? "Hide" : "Show"} Comparison
        </button>
      </div>
    </div>
  );
}
