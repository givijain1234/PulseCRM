import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  Filter,
  ArrowRight,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { dbService } from '../services/db';
import { Post, Event } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { serverTimestamp } from 'firebase/firestore';

export default function PulseHub() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'Strategy',
    coverImage: ''
  });

  useEffect(() => {
    if (!profile) return;

    const unsubscribe = dbService.subscribeCollection<Post>('posts', [], (data) => {
      setPosts(data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      }));
      setLoading(false);
    });

    const unsubEvents = dbService.subscribeCollection<Event>('events', [], (data) => {
      setEvents(data.sort((a, b) => {
        const timeA = a.date?.toMillis() || 0;
        const timeB = b.date?.toMillis() || 0;
        return timeA - timeB;
      }));
    });

    return () => {
      unsubscribe();
      unsubEvents();
    };
  }, [profile]);

  const handleAddPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !newPost.title || !newPost.content) return;

    try {
      await dbService.addDocument('posts', {
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        coverImage: newPost.coverImage || `https://picsum.photos/seed/${Date.now()}/800/400`,
        authorId: profile.uid,
        authorName: profile.name,
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', tags: '', category: 'Strategy', coverImage: '' });
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const categories = ['All', 'Strategy', 'Trends', 'Technology', 'Sales', 'Research', 'Marketing', 'Security', 'Psychology'];

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, categoryFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-12 border border-slate-800/50">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20 mb-6"
          >
            <TrendingUp className="h-3 w-3" />
            Knowledge & Community
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-white mb-4"
          >
            Pulse<span className="text-cyan-500">Hub</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 mb-8 leading-relaxed"
          >
            The heartbeat of our collective intelligence. Share insights, stay updated with events, and connect with the community.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Post
            </Button>
            <Button 
              variant="outline" 
              className="h-12 px-8 rounded-xl border-slate-700 hover:bg-slate-800"
              onClick={() => navigate('/events')}
            >
              Explore Events
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input 
                placeholder="Search posts, tags, or authors..." 
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full whitespace-nowrap"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-slate-900/50" />
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, i) => (
                <div key={post.id}>
                  {i === 0 && searchQuery === '' && (
                    <div className="mb-4 flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                      <Sparkles className="h-4 w-4" />
                      Featured Content
                    </div>
                  )}
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-slate-900 p-6">
                  <Search className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-white">No posts found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Trending Topics */}
          <Card className="border-slate-800/50 bg-slate-900/30">
            <h3 className="mb-6 text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-500" />
              Trending Topics
            </h3>
            <div className="space-y-4">
              {['#SaaS', '#Growth', '#CustomerSuccess', '#ProductDesign', '#Engineering'].map((tag) => (
                <button 
                  key={tag}
                  className="flex w-full items-center justify-between rounded-xl p-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
                >
                  <span>{tag}</span>
                  <span className="text-xs font-bold text-slate-600">1.2k posts</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="mt-6 w-full text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/5">
              View all topics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          {/* Featured Events */}
          <Card className="border-slate-800/50 bg-slate-900/30">
            <h3 className="mb-6 text-lg font-bold text-white flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-500" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {events.slice(0, 3).map((event, i) => (
                <div key={event.id} className="group cursor-pointer rounded-2xl border border-slate-800/50 bg-slate-950/50 p-4 transition-all hover:border-purple-500/30 hover:bg-slate-900">
                  <div className="mb-2 inline-flex rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/20">
                    {event.type}
                  </div>
                  <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">{event.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{new Date(event.date.toMillis()).toLocaleDateString()}</p>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-4">No upcoming events</p>
              )}
            </div>
            <Button variant="ghost" className="mt-6 w-full text-purple-500 hover:text-purple-400 hover:bg-purple-500/5">
              Explore all events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Post"
      >
        <form onSubmit={handleAddPost} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <Input
              placeholder="What's on your mind?"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Content</label>
            <textarea
              className="w-full h-32 rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Share your thoughts..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Category</label>
            <select
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            >
              {categories.filter(c => c !== 'All').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tags (comma separated)</label>
            <Input
              placeholder="e.g., SaaS, Growth, Design"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Publish Post
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);

  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      const newLikes = newLiked ? likes + 1 : likes - 1;
      setLikes(newLikes);
      
      await dbService.updateDocument('posts', post.id, {
        likesCount: newLikes
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = () => {
    alert('Comments feature coming soon! Join the conversation in our next community call.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-cyan-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-6 md:flex-row">
          {post.coverImage && (
            <div className="h-48 w-full shrink-0 overflow-hidden rounded-2xl md:h-auto md:w-64">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="flex flex-1 flex-col py-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-900 text-[10px] font-bold text-white uppercase">
                    {post.authorName.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{post.authorName}</p>
                  <p className="text-[10px] text-slate-500">{post.createdAt ? formatDistanceToNow(post.createdAt.toDate()) : 'just now'} ago</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan-400">
              {post.title}
            </h2>
            
            <p className="mb-6 line-clamp-2 text-slate-400 leading-relaxed">
              {post.content}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-xs font-bold">{likes}</span>
                </button>
                <button 
                  onClick={handleComment}
                  className="flex items-center gap-1.5 text-slate-500 transition-colors hover:text-cyan-500"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs font-bold">{post.commentsCount}</span>
                </button>
                <button 
                  onClick={() => alert('Link copied to clipboard!')}
                  className="flex items-center gap-1.5 text-slate-500 transition-colors hover:text-purple-500"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex gap-2">
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="rounded-full bg-slate-800/50 px-2.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-700/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
