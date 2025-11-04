import React, { useState } from 'react';
import { Play, Pause, Heart, MoreVertical, Download, Share2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover: string;
  duration?: string;
  type: 'album' | 'song' | 'playlist';
  year?: number;
  genre?: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
  viewMode?: 'grid' | 'list';
  onPlay?: () => void;
  onFavorite?: () => void;
}

export const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  album,
  cover,
  duration,
  type,
  year,
  genre,
  isPlaying = false,
  isFavorite = false,
  viewMode = 'grid',
  onPlay,
  onFavorite
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-all duration-200"
      >
        {/* 封面 */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover rounded-md"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
            <button
              onClick={onPlay}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-900 hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
          </div>
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {artist} {album && `• ${album}`}
          </p>
        </div>

        {/* 时长 */}
        {duration && (
          <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            {duration}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center gap-2">
                  <Plus size={14} />
                  添加到播放列表
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center gap-2">
                  <Download size={14} />
                  下载
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center gap-2">
                  <Share2 size={14} />
                  分享
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      {/* 封面容器 */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* 渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onPlay}
            className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:scale-110 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
        </div>

        {/* 收藏按钮 */}
        <button
          onClick={onFavorite}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-black/20 text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* 类型标签 */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
            {type === 'album' ? '专辑' : type === 'song' ? '单曲' : '播放列表'}
          </span>
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
          {artist}
        </p>

        {album && (
          <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1 mb-2">
            {album}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-auto">
          <span>{year}</span>
          {duration && <span>{duration}</span>}
        </div>

        {genre && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-dark-700 text-xs text-gray-600 dark:text-gray-400 rounded-full">
              {genre}
            </span>
          </div>
        )}
      </div>

      {/* 更多操作菜单 */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <MoreVertical size={14} />
        </button>
        
        {showMenu && (
          <div className="absolute bottom-12 right-4 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-10">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center gap-2">
              <Plus size={14} />
              添加到播放列表
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center gap-2">
              <Download size={14} />
              下载
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center gap-2">
              <Share2 size={14} />
              分享
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};