"use client";
import { useState, useEffect } from "react";

interface Document {
  id: string;
  title: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState('{}');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    loadDocuments();
    checkSystemHealth();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/rag/ingest');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const checkSystemHealth = async () => {
    try {
      const response = await fetch('/api/rag/chat');
      const data = await response.json();
      setSystemStatus(data);
    } catch (error) {
      console.error('Failed to check system health:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage('❌ Title and content are required');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      let parsedMetadata = {};
      if (metadata.trim()) {
        try {
          parsedMetadata = JSON.parse(metadata);
        } catch {
          setMessage('❌ Invalid JSON in metadata field');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          metadata: parsedMetadata,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setTitle('');
        setContent('');
        setMetadata('{}');
        loadDocuments(); // Refresh the document list
        checkSystemHealth(); // Update system status
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/rag/ingest?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(`✅ Document "${title}" deleted successfully`);
        loadDocuments();
        checkSystemHealth();
      } else {
        const data = await response.json();
        setMessage(`❌ Failed to delete: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error deleting document: ${error}`);
    }
  };

  const sampleDocuments = [
    {
      title: "About Saarthak Singhal",
      content: `Saarthak Singhal is a passionate software developer and machine learning enthusiast currently pursuing his studies with a focus on both technology and law. He has experience working with modern web technologies including Next.js, TypeScript, React, and Tailwind CSS.

Saarthak is particularly interested in AI and machine learning applications, with hands-on experience in building RAG (Retrieval-Augmented Generation) systems, working with Large Language Models (LLMs), and implementing full-stack applications with databases like PostgreSQL and Supabase.

His technical skills span across Python programming, web development, database management, and AI/ML technologies. He enjoys building practical applications that solve real-world problems and is always eager to learn new technologies and methodologies.`
    },
    {
      title: "Saarthak's Work Experience",
      content: `Saarthak Singhal has gained valuable industry experience through several internship positions:

Machine Learning Intern at HCLTech (June - September 2025): Worked on machine learning projects involving data analysis, model development, and implementation of AI solutions in enterprise environments.

Machine Learning Intern at Quanthive Research (January - May 2025): Focused on research and development of quantitative models, data analysis, and machine learning algorithms for financial and research applications.

Data Engineering Intern at Pabay Software (July - December 2023): Gained experience in data pipeline development, database optimization, and backend systems development. Worked with data processing frameworks and implemented efficient data storage solutions.

These experiences have provided him with practical knowledge in machine learning, data engineering, software development, and working in professional development environments.`
    }
  ];

  const loadSampleDocument = (sample: typeof sampleDocuments[0]) => {
    setTitle(sample.title);
    setContent(sample.content);
    setMetadata('{"type": "personal_info"}');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-950 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900 mb-8">
          <h1 className="text-3xl font-bold mb-4">RAG System Admin</h1>
          
          {/* System Status */}
          {systemStatus && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-green-800 dark:text-green-200 mb-2">System Status</h2>
              <div className="text-sm text-green-700 dark:text-green-300">
                <p>Status: <span className="font-medium">{systemStatus.status}</span></p>
                <p>Documents in index: <span className="font-medium">{systemStatus.documentsInIndex}</span></p>
                <p>Last checked: <span className="font-medium">{new Date(systemStatus.timestamp).toLocaleString()}</span></p>
              </div>
            </div>
          )}
          
          <p className="text-neutral-600 dark:text-neutral-400">
            Add documents to your knowledge base. The system will automatically chunk the content and create embeddings for search.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Document Form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
            <h2 className="text-xl font-semibold mb-6">Add New Document</h2>
            
            {/* Sample Documents */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Quick Start - Sample Documents:</h3>
              <div className="flex flex-wrap gap-2">
                {sampleDocuments.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSampleDocument(sample)}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., About Saarthak, Work Experience, Projects..."
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the document content here..."
                  rows={12}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="metadata" className="block text-sm font-medium mb-2">
                  Metadata (JSON)
                </label>
                <textarea
                  id="metadata"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder='{"type": "personal_info", "category": "experience"}'
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Add Document'}
              </button>
            </form>

            {message && (
              <div className="mt-4 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>

          {/* Document List */}
          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
            <h2 className="text-xl font-semibold mb-6">Existing Documents ({documents.length})</h2>
            
            {documents.length === 0 ? (
              <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                No documents yet. Add your first document to get started!
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 dark:text-white">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Created: {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                        {Object.keys(doc.metadata || {}).length > 0 && (
                          <div className="mt-2">
                            {Object.entries(doc.metadata).map(([key, value]) => (
                              <span
                                key={key}
                                className="inline-block text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded mr-1"
                              >
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteDocument(doc.id, doc.title)}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                        title="Delete document"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}