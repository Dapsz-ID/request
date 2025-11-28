'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Message, saveMessage, getMessages, deleteMessage, searchMessages, sortMessagesByDate } from '@/lib/localStorage';
import { Search, Trash2, ArrowUpDown } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const isAdminPanel = window.location.hash === '#admin-panel';
      setShowAdminPanel(isAdminPanel);
      
      if (isAdminPanel && !isAuthenticated) {
        setShowLoginForm(true);
      } else if (isAdminPanel && isAuthenticated) {
        setShowLoginForm(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (showAdminPanel) {
      loadMessages();
    }
  }, [showAdminPanel]);

  useEffect(() => {
    filterAndSortMessages();
  }, [messages, searchQuery, sortAscending]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.title || !formData.content) {
      toast.error('Semua field harus diisi');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Email tidak valid');
      return;
    }

    setIsSubmitting(true);
    
    try {
      saveMessage(formData);
      toast.success('Pesan berhasil dikirim!');
      setFormData({ name: '', email: '', title: '', content: '' });
    } catch (error) {
      toast.error('Gagal mengirim pesan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMessages = () => {
    setIsLoading(true);
    try {
      const loadedMessages = getMessages();
      setMessages(loadedMessages);
    } catch (error) {
      toast.error('Gagal memuat pesan');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortMessages = () => {
    let result = messages;
    
    if (searchQuery) {
      result = searchMessages(searchQuery);
    }
    
    result = sortMessagesByDate(result, sortAscending);
    setFilteredMessages(result);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      try {
        deleteMessage(id);
        setMessages(prev => prev.filter(msg => msg.id !== id));
        toast.success('Pesan berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus pesan');
      }
    }
  };

  const toggleSort = () => {
    setSortAscending(prev => !prev);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.username === 'dapsz082' && loginForm.password === '082197') {
      setIsAuthenticated(true);
      setShowLoginForm(false);
      toast.success('Login berhasil!');
    } else {
      toast.error('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAdminPanel(false);
    setShowLoginForm(false);
    setLoginForm({ username: '', password: '' });
    window.location.hash = '';
    toast.success('Logout berhasil!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {!showAdminPanel ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Form Request/Pertanyaan
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Kirimkan pesan atau pertanyaan Anda kepada kami
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Formulir Pesan</CardTitle>
                  <CardDescription>
                    Silakan isi formulir di bawah ini untuk mengirimkan pesan atau pertanyaan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Masukkan nama Anda"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="nama@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul Pesan</Label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Masukkan judul pesan"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Isi Pesan</Label>
                      <Textarea
                        id="content"
                        name="content"
                        placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </>
        ) : showLoginForm ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Login Admin</CardTitle>
                <CardDescription>
                  Masukkan username dan password untuk mengakses admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Masukkan username"
                      value={loginForm.username}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Login
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowLoginForm(false);
                        setShowAdminPanel(false);
                        window.location.hash = '';
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Admin Panel
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Kelola semua pesan yang masuk
                </p>
              </div>
              <div className="flex gap-2">
                <a href="/">
                  <Button variant="outline">
                    Kembali ke Form
                  </Button>
                </a>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistik</CardTitle>
                  <CardDescription>
                    Ringkasan pesan yang diterima
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{messages.length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Total Pesan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {filteredMessages.length}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Pesan Ditampilkan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {searchQuery ? filteredMessages.length : messages.length}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Hasil Pencarian</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daftar Pesan</CardTitle>
                  <CardDescription>
                    Semua pesan yang dikirim melalui form
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Cari pesan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={toggleSort}
                      className="whitespace-nowrap"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Urutkan {sortAscending ? 'Terlama' : 'Terbaru'}
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-slate-600 dark:text-slate-400">Memuat data...</p>
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-400 mb-4">
                        {searchQuery ? 'Tidak ada pesan yang cocok dengan pencarian' : 'Belum ada pesan yang masuk'}
                      </div>
                      {searchQuery && (
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery('')}
                        >
                          Hapus Pencarian
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Pesan</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMessages.map((message) => (
                            <TableRow key={message.id}>
                              <TableCell className="font-medium">
                                {message.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {message.email}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <div className="font-medium truncate" title={message.title}>
                                  {message.title}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <div className="text-sm text-slate-600 dark:text-slate-400 truncate" title={message.content}>
                                  {message.content}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                {formatDate(message.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(message.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}