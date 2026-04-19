import React, { useState } from 'react';

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
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    recipientEmail: 'maria.matos.graca@gmail.com',
                }),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Failed to send message');
            }
        } catch (error) {
            setStatus('Error sending message:'+ error.message);
        } finally {
            setLoading(false);
        }
    };       
    if(English)
    return (
        <form onSubmit={handleSubmit}>
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
            <input
                type="text"
                name="nome"
                placeholder="Seu Nome"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="O seu Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <textarea
                name="message"
                placeholder="Sua Mensagem"
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
