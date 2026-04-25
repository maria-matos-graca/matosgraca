import React, { useState } from 'react';
import api from '../services/auth'; 

export default function ContactForm({English}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [honeypot, setHoneypot] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Honeypot check (bot protection)
        if (honeypot) {
            console.log('Bot detected');
            return;
        }

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('Please fill all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus('Invalid email format');
            return;
        }

        setLoading(true);
        setStatus('');

 try {
      const response = await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      if (response.data.success) {
        setStatus(English ? 'Message sent successfully!' : 'Mensagem enviada com sucesso!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(English ? 'Failed to send message' : 'Falha ao enviar mensagem');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus(English ? 'Error sending message' : 'Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };
    
    if(English)
    return (
        <form onSubmit={handleSubmit}>
            <h3>Get in touch</h3>
            <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
            />
            {/* Honeypot field - hidden from users */}
            <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
            </button>
            {status && <p>{status}</p>}
        </form>
    )
    return (
        <form onSubmit={handleSubmit}>
        <h3>Contacta-me</h3>
            <input
                type="text"
                name="name"
                placeholder="O teu Nome"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="O teu Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <textarea
                name="message"
                placeholder="A tua Mensagem"
                value={formData.message}
                onChange={handleChange}
                required
            />
            {/* Honeypot field - hidden from users */}
            <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar'}
            </button>
            {status && <p>{status}</p>}
        </form>
    )
}
