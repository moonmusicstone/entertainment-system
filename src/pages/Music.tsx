import React, { useState, useMemo } from 'react';
import { MusicCard } from '../components/Music/MusicCard';
import { MusicFilter } from '../components/Music/MusicFilter';

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover: string;
  duration?: string;
  type: 'album' | 'song' | 'playlist';
  year: number;
  genre: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
}

const Music: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 示例音乐数据
  const musicData: MusicItem[] = [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      duration: '3:20',
      type: 'song',
      year: 2020,
      genre: 'pop'
    },
    {
      id: '2',
      title: 'Abbey Road',
      artist: 'The Beatles',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
      type: 'album',
      year: 1969,
      genre: 'rock'
    },
    {
      id: '3',
      title: 'Kind of Blue',
      artist: 'Miles Davis',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      type: 'album',
      year: 1959,
      genre: 'jazz'
    },
    {
      id: '4',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
      duration: '5:55',
      type: 'song',
      year: 1975,
      genre: 'rock'
    },
    {
      id: '5',
      title: 'Random Access Memories',
      artist: 'Daft Punk',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      type: 'album',
      year: 2013,
      genre: 'electronic'
    },
    {
      id: '6',
      title: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
      type: 'album',
      year: 1973,
      genre: 'rock'
    },
    {
      id: '7',
      title: 'My Favorites',
      artist: '我的收藏',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      type: 'playlist',
      year: 2024,
      genre: 'pop'
    },
    {
      id: '8',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
      duration: '6:30',
      type: 'song',
      year: 1976,
      genre: 'rock'
    },
    {
      id: '9',
      title: 'Thriller',
      artist: 'Michael Jackson',
      album: 'Thriller',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      type: 'album',
      year: 1982,
      genre: 'pop'
    },
    {
      id: '10',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
      duration: '8:02',
      type: 'song',
      year: 1971,
      genre: 'rock'
    },
    {
      id: '11',
      title: 'Chill Vibes',
      artist: '放松音乐',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      type: 'playlist',
      year: 2024,
      genre: 'electronic'
    },
    {
      id: '12',
      title: 'What a Wonderful World',
      artist: 'Louis Armstrong',
      album: 'What a Wonderful World',
      cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
      duration: '2:20',
      type: 'song',
      year: 1967,
      genre: 'jazz'
    }
  ];

  // 筛选和排序逻辑
  const filteredMusic = useMemo(() => {
    let filtered = musicData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.album && item.album.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesGenre = selectedGenre === 'all' || item.genre === selectedGenre;
      
      let matchesYear = true;
      if (selectedYear !== 'all') {
        const year = item.year;
        switch (selectedYear) {
          case '2020s':
            matchesYear = year >= 2020;
            break;
          case '2010s':
            matchesYear = year >= 2010 && year < 2020;
            break;
          case '2000s':
            matchesYear = year >= 2000 && year < 2010;
            break;
          case '1990s':
            matchesYear = year >= 1990 && year < 2000;
            break;
          case '1980s':
            matchesYear = year >= 1980 && year < 1990;
            break;
          case '1970s':
            matchesYear = year >= 1970 && year < 1980;
            break;
          case 'older':
            matchesYear = year < 1970;
            break;
        }
      }

      return matchesSearch && matchesType && matchesGenre && matchesYear;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.year - a.year;
        case 'oldest':
          return a.year - b.year;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'popular':
        default:
          return 0;
      }
    });

    return filtered;
  }, [musicData, searchTerm, selectedType, selectedGenre, selectedYear, sortBy]);

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const handleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">音乐</h1>
          <p className="text-gray-600 dark:text-gray-400">
            发现和享受你喜爱的音乐
          </p>
        </div>

        {/* 筛选组件 */}
        <MusicFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 结果统计 */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            找到 {filteredMusic.length} 个结果
          </p>
        </div>

        {/* 音乐列表 */}
        {filteredMusic.length > 0 ? (
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr' 
              : 'grid-cols-1'
          }`}>
            {filteredMusic.map((item) => (
              <MusicCard
                key={item.id}
                {...item}
                isPlaying={playingId === item.id}
                isFavorite={favorites.has(item.id)}
                viewMode={viewMode}
                onPlay={() => handlePlay(item.id)}
                onFavorite={() => handleFavorite(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              没有找到匹配的音乐
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              尝试调整筛选条件或搜索关键词
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Music;