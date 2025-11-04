// Mock data for development without database
const mockCategories = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: '动作',
    type: 'movie',
    description: '充满刺激和冒险的动作电影'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: '喜剧',
    type: 'movie',
    description: '轻松幽默的喜剧电影'
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: '科幻',
    type: 'movie',
    description: '未来科技和想象力的科幻电影'
  },
  {
    _id: '507f1f77bcf86cd799439014',
    name: '流行',
    type: 'music',
    description: '当下最受欢迎的流行音乐'
  },
  {
    _id: '507f1f77bcf86cd799439015',
    name: '摇滚',
    type: 'music',
    description: '充满力量的摇滚音乐'
  },
  {
    _id: '507f1f77bcf86cd799439016',
    name: '古典',
    type: 'music',
    description: '优雅的古典音乐'
  },
  {
    _id: '507f1f77bcf86cd799439017',
    name: '小说',
    type: 'book',
    description: '各类小说作品'
  },
  {
    _id: '507f1f77bcf86cd799439018',
    name: '科技',
    type: 'book',
    description: '科技相关书籍'
  },
  {
    _id: '507f1f77bcf86cd799439019',
    name: '历史',
    type: 'book',
    description: '历史类书籍'
  },
  {
    _id: '507f1f77bcf86cd79943901a',
    name: '动作',
    type: 'game',
    description: '刺激的动作游戏'
  },
  {
    _id: '507f1f77bcf86cd79943901b',
    name: '角色扮演',
    type: 'game',
    description: 'RPG角色扮演游戏'
  },
  {
    _id: '507f1f77bcf86cd79943901c',
    name: '策略',
    type: 'game',
    description: '考验智慧的策略游戏'
  }
];

const mockMovies = [
  {
    _id: '507f1f77bcf86cd799439021',
    title: '复仇者联盟：终局之战',
    description: '超级英雄们的最终战役',
    genre: ['动作', '科幻', '冒险'],
    releaseDate: '2019-04-26',
    director: '安东尼·罗素, 乔·罗素',
    cast: ['小罗伯特·唐尼', '克里斯·埃文斯', '马克·鲁法洛'],
    rating: 8.4,
    duration: 181,
    language: '英语',
    country: '美国',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    categories: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439013']
  },
  {
    _id: '507f1f77bcf86cd799439022',
    title: '寄生虫',
    description: '一部关于社会阶层的黑色喜剧',
    genre: ['剧情', '喜剧', '惊悚'],
    releaseDate: '2019-05-30',
    director: '奉俊昊',
    cast: ['宋康昊', '李善均', '赵茹珍'],
    rating: 8.6,
    duration: 132,
    language: '韩语',
    country: '韩国',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    categories: ['507f1f77bcf86cd799439012']
  },
  {
    _id: '507f1f77bcf86cd799439023',
    title: '星际穿越',
    description: '一场穿越时空的科幻冒险',
    genre: ['科幻', '剧情', '冒险'],
    releaseDate: '2014-11-07',
    director: '克里斯托弗·诺兰',
    cast: ['马修·麦康纳', '安妮·海瑟薇', '杰西卡·查斯坦'],
    rating: 8.6,
    duration: 169,
    language: '英语',
    country: '美国',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    categories: ['507f1f77bcf86cd799439013']
  }
];

const mockMusic = [
  {
    _id: '507f1f77bcf86cd799439031',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    genre: ['流行'],
    releaseDate: '2017-01-06',
    duration: 233,
    language: '英语',
    country: '英国',
    cover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    audioUrl: 'https://example.com/shape-of-you.mp3',
    categories: ['507f1f77bcf86cd799439014']
  },
  {
    _id: '507f1f77bcf86cd799439032',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    genre: ['摇滚'],
    releaseDate: '1975-10-31',
    duration: 355,
    language: '英语',
    country: '英国',
    cover: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    audioUrl: 'https://example.com/bohemian-rhapsody.mp3',
    categories: ['507f1f77bcf86cd799439015']
  },
  {
    _id: '507f1f77bcf86cd799439033',
    title: 'Canon in D',
    artist: 'Johann Pachelbel',
    album: 'Classical Masterpieces',
    genre: ['古典'],
    releaseDate: '1680-01-01',
    duration: 300,
    language: '器乐',
    country: '德国',
    cover: 'https://example.com/canon-in-d.jpg',
    audioUrl: 'https://example.com/canon-in-d.mp3',
    categories: ['507f1f77bcf86cd799439016']
  }
];

const mockBooks = [
  {
    _id: '507f1f77bcf86cd799439041',
    title: '三体',
    author: '刘慈欣',
    description: '科幻小说三部曲的第一部',
    genre: ['科幻', '小说'],
    publishDate: '2006-05-01',
    publisher: '重庆出版社',
    isbn: '9787536692930',
    pages: 302,
    language: '中文',
    country: '中国',
    cover: 'https://img9.doubanio.com/view/subject_l/public/s2768378.jpg',
    categories: ['507f1f77bcf86cd799439017']
  },
  {
    _id: '507f1f77bcf86cd799439042',
    title: 'JavaScript高级程序设计',
    author: 'Nicholas C. Zakas',
    description: 'JavaScript开发者必读的经典教程',
    genre: ['编程', '技术'],
    publishDate: '2012-03-01',
    publisher: '人民邮电出版社',
    isbn: '9787115275790',
    pages: 730,
    language: '中文',
    country: '美国',
    cover: 'https://img9.doubanio.com/view/subject_l/public/s8958650.jpg',
    categories: ['507f1f77bcf86cd799439018']
  },
  {
    _id: '507f1f77bcf86cd799439043',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    description: '从动物到上帝的人类发展史',
    genre: ['历史', '人文'],
    publishDate: '2014-11-01',
    publisher: '中信出版社',
    isbn: '9787508647357',
    pages: 440,
    language: '中文',
    country: '以色列',
    cover: 'https://img9.doubanio.com/view/subject_l/public/s27814883.jpg',
    categories: ['507f1f77bcf86cd799439019']
  }
];

const mockGames = [
  {
    _id: '507f1f77bcf86cd799439051',
    title: '塞尔达传说：旷野之息',
    description: '开放世界冒险游戏的杰作',
    genre: ['动作', '冒险', '开放世界'],
    releaseDate: '2017-03-03',
    developer: '任天堂',
    publisher: '任天堂',
    platform: ['Nintendo Switch', 'Wii U'],
    rating: 9.4,
    language: ['中文', '英语', '日语'],
    cover: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/hero',
    trailer: 'https://www.youtube.com/watch?v=zw47_q9wbBE',
    categories: ['507f1f77bcf86cd79943901a']
  },
  {
    _id: '507f1f77bcf86cd799439052',
    title: '巫师3：狂猎',
    description: '史诗级的角色扮演游戏',
    genre: ['角色扮演', '开放世界', '奇幻'],
    releaseDate: '2015-05-19',
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    platform: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
    rating: 9.3,
    language: ['中文', '英语', '波兰语'],
    cover: 'https://image.api.playstation.com/vulcan/img/cfn/11307x4B5WLoVoIUtdewG4uJ_YuDRTwBxQy0qP8ylgazLLc01PBxbsFG1pGOWmqhZd5x2Hxz3tHtmJJKbKlKOGKOv_2.png',
    trailer: 'https://www.youtube.com/watch?v=c0i88t0Kacs',
    categories: ['507f1f77bcf86cd79943901b']
  },
  {
    _id: '507f1f77bcf86cd799439053',
    title: '文明VI',
    description: '经典的回合制策略游戏',
    genre: ['策略', '回合制', '建造'],
    releaseDate: '2016-10-21',
    developer: 'Firaxis Games',
    publisher: '2K Games',
    platform: ['PC', 'Mac', 'Linux', 'Nintendo Switch', 'PlayStation 4', 'Xbox One'],
    rating: 8.5,
    language: ['中文', '英语', '法语', '德语'],
    cover: 'https://cdn.2kgames.com/civilization.com/CivilizationVI_KeyArt_Logo.jpg',
    trailer: 'https://www.youtube.com/watch?v=5KdE0p2joJw',
    categories: ['507f1f77bcf86cd79943901c']
  }
];

const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439061',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439062',
    username: 'moderator',
    email: 'moderator@example.com',
    role: 'moderator',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439063',
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

module.exports = {
  mockCategories,
  mockMovies,
  mockMusic,
  mockBooks,
  mockGames,
  mockUsers
};