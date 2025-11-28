'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PenLine,
  Save,
  Eye,
  Clock,
  FileText,
  Send,
  MoreHorizontal,
  Image,
  Link,
  Bold,
  Italic,
  List,
  Quote,
} from 'lucide-react';

interface BlogWriterProps {
  user: {
    id: string;
    email: string;
    adminRole: string;
    permissions: string[];
  };
}

// Mock recent drafts
const recentDrafts = [
  { id: '1', title: 'The Path to Inner Peace', status: 'draft', updated: '2 hours ago' },
  { id: '2', title: 'Understanding Spiritual Awakening', status: 'published', updated: 'Yesterday' },
  { id: '3', title: 'Meditation Techniques for Beginners', status: 'draft', updated: '3 days ago' },
];

export default function BlogWriter({ user }: BlogWriterProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-decorative text-white mb-2">
            Blog Writer
          </h1>
          <p className="text-lg font-sans text-[#C4C8D4]">
            Create and publish content for Ozean Licht
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Card */}
          <Card>
            <CardContent className="p-6">
              <Input
                type="text"
                placeholder="Post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-decorative bg-transparent border-none focus:ring-0 px-0 placeholder:text-white/30"
              />
            </CardContent>
          </Card>

          {/* Editor Card */}
          <Card>
            {/* Toolbar */}
            <div className="px-6 py-3 border-b border-primary/20 flex items-center gap-1">
              <button className="p-2 rounded hover:bg-primary/10 text-[#C4C8D4] hover:text-primary transition-colors">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-2 rounded hover:bg-primary/10 text-[#C4C8D4] hover:text-primary transition-colors">
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-primary/20 mx-1" />
              <button className="p-2 rounded hover:bg-primary/10 text-[#C4C8D4] hover:text-primary transition-colors">
                <List className="w-4 h-4" />
              </button>
              <button className="p-2 rounded hover:bg-primary/10 text-[#C4C8D4] hover:text-primary transition-colors">
                <Quote className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-primary/20 mx-1" />
              <button className="p-2 rounded hover:bg-primary/10 text-[#C4C8D4] hover:text-primary transition-colors">
                <Link className="w-4 h-4" />
              </button>
              <button className="p-2 rounded hover:bg-primary/10 text-[#C4C8D4] hover:text-primary transition-colors">
                <Image className="w-4 h-4" />
              </button>
            </div>

            <CardContent className="p-6">
              <textarea
                placeholder="Start writing your post..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[400px] bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder:text-white/30 resize-none font-sans text-base leading-relaxed"
              />
            </CardContent>

            {/* Footer Stats */}
            <div className="px-6 py-3 border-t border-primary/20 flex items-center justify-between text-sm text-[#C4C8D4]">
              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary" />
                Post Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#C4C8D4]">Status</span>
                <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Draft
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#C4C8D4]">Visibility</span>
                <span className="text-white">Public</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#C4C8D4]">Author</span>
                <span className="text-white">{user.email.split('@')[0]}</span>
              </div>
              <div className="pt-4 border-t border-primary/20">
                <Button
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Drafts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Posts
              </CardTitle>
              <CardDescription>
                Continue where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate group-hover:text-primary transition-colors">
                        {draft.title}
                      </p>
                      <p className="text-xs text-[#C4C8D4] mt-0.5">
                        {draft.updated}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          draft.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {draft.status}
                      </span>
                      <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#C4C8D4] hover:text-primary">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
