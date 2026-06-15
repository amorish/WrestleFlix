import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

interface FeedbackFormProps {
  onBack: () => void;
}

export function FeedbackForm({ onBack }: FeedbackFormProps) {
  const [subject, setSubject] = useState('bug');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the mailto link
    const targetEmail = 'contact.manish.help@gmail.com';
    const formattedSubject = `WrestleFlix Feedback: ${subject.toUpperCase()}`;
    const formattedBody = `From: ${email}\n\nMessage:\n${message}`;
    
    const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
    
    // Open default mail client
    window.location.href = mailtoLink;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="page-title">Contact Support</h1>
      </div>
      <div className="page-content glass-effect">
        <p className="page-text" style={{ marginBottom: '2rem' }}>
          WrestleFlix thrives on the passion and input of its community. Whether you have discovered a technical bug, wish to suggest a legendary match we may have missed, or simply want to share your thoughts on how we can improve the platform, our inbox is always open. Please provide as much detail as possible so our team can address your request efficiently and thoughtfully.
        </p>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="form-control"
              required
            >
              <option value="bug">Bug Report</option>
              <option value="content related">Content Related</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              className="form-control"
              rows={6}
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-accent submit-btn">
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
