'use client'

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PrimaryButton } from '@/components/primary-button';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demo-Modus: Nachricht würde gesendet werden.\n\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-cinzel-decorative text-center mb-8 text-primary">
            Kontakt
          </h1>
          <div className="glass-card p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground font-montserrat">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dein Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground font-montserrat">E-Mail</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="deine@email.de"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground font-montserrat">Nachricht</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Deine Nachricht..."
                  rows={6}
                  required
                />
              </div>
              <PrimaryButton type="submit">
                Nachricht senden
              </PrimaryButton>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
