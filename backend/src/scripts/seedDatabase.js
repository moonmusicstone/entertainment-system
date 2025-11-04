const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Movie = require('../models/Movie');
const Music = require('../models/Music');
const Book = require('../models/Book');
const Game = require('../models/Game');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainment-system');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Movie.deleteMany({});
    await Music.deleteMany({});
    await Book.deleteMany({});
    await Game.deleteMany({});

    // Create categories
    console.log('Creating categories...');
    const categories = await Category.insertMany([
      {
        name: '动作',
        type: 'movie',
        description: '充满刺激和冒险的动作电影'
      },
      {
        name: '喜剧',
        type: 'movie',
        description: '轻松幽默的喜剧电影'
      },
      {
        name: '科幻',
        type: 'movie',
        description: '未来科技和想象力的科幻电影'
      },
      {
        name: '流行',
        type: 'music',
        description: '当下最受欢迎的流行音乐'
      },
      {
        name: '摇滚',
        type: 'music',
        description: '充满力量的摇滚音乐'
      },
      {
        name: '古典',
        type: 'music',
        description: '优雅的古典音乐'
      },
      {
        name: '小说',
        type: 'book',
        description: '各类小说作品'
      },
      {
        name: '科技',
        type: 'book',
        description: '科技相关书籍'
      },
      {
        name: '历史',
        type: 'book',
        description: '历史类书籍'
      },
      {
        name: '动作',
        type: 'game',
        description: '刺激的动作游戏'
      },
      {
        name: '角色扮演',
        type: 'game',
        description: 'RPG角色扮演游戏'
      },
      {
        name: '策略',
        type: 'game',
        description: '考验智慧的策略游戏'
      }
    ]);

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    // Create sample movies
    console.log('Creating sample movies...');
    const actionCategory = categories.find(cat => cat.name === '动作' && cat.type === 'movie');
    const comedyCategory = categories.find(cat => cat.name === '喜剧' && cat.type === 'movie');
    const scifiCategory = categories.find(cat => cat.name === '科幻' && cat.type === 'movie');

    await Movie.insertMany([
      {
        title: '复仇者联盟：终局之战',
        description: '超级英雄们的最终战役',
        genre: ['动作', '科幻', '冒险'],
        releaseDate: new Date('2019-04-26'),
        director: '安东尼·罗素, 乔·罗素',
        cast: ['小罗伯特·唐尼', '克里斯·埃文斯', '马克·鲁法洛'],
        rating: 8.4,
        duration: 181,
        language: '英语',
        country: '美国',
        poster: 'https://example.com/avengers-endgame.jpg',
        trailer: 'https://example.com/avengers-endgame-trailer',
        categories: [actionCategory._id, scifiCategory._id],
        createdBy: adminUser._id
      },
      {
        title: '寄生虫',
        description: '一部关于社会阶层的黑色喜剧',
        genre: ['剧情', '喜剧', '惊悚'],
        releaseDate: new Date('2019-05-30'),
        director: '奉俊昊',
        cast: ['宋康昊', '李善均', '赵茹珍'],
        rating: 8.6,
        duration: 132,
        language: '韩语',
        country: '韩国',
        poster: 'https://example.com/parasite.jpg',
        trailer: 'https://example.com/parasite-trailer',
        categories: [comedyCategory._id],
        createdBy: adminUser._id
      }
    ]);

    // Create sample music
    console.log('Creating sample music...');
    const popCategory = categories.find(cat => cat.name === '流行' && cat.type === 'music');
    const rockCategory = categories.find(cat => cat.name === '摇滚' && cat.type === 'music');

    await Music.insertMany([
      {
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷ (Divide)',
        genre: ['流行'],
        releaseDate: new Date('2017-01-06'),
        duration: 233,
        language: '英语',
        country: '英国',
        cover: 'https://example.com/shape-of-you.jpg',
        audioUrl: 'https://example.com/shape-of-you.mp3',
        categories: [popCategory._id],
        createdBy: adminUser._id
      },
      {
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        genre: ['摇滚'],
        releaseDate: new Date('1975-10-31'),
        duration: 355,
        language: '英语',
        country: '英国',
        cover: 'https://example.com/bohemian-rhapsody.jpg',
        audioUrl: 'https://example.com/bohemian-rhapsody.mp3',
        categories: [rockCategory._id],
        createdBy: adminUser._id
      }
    ]);

    // Create sample books
    console.log('Creating sample books...');
    const novelCategory = categories.find(cat => cat.name === '小说' && cat.type === 'book');
    const techCategory = categories.find(cat => cat.name === '科技' && cat.type === 'book');

    await Book.insertMany([
      {
        title: '三体',
        author: '刘慈欣',
        description: '科幻小说三部曲的第一部',
        genre: ['科幻', '小说'],
        publishDate: new Date('2006-05-01'),
        publisher: '重庆出版社',
        isbn: '9787536692930',
        pages: 302,
        language: '中文',
        country: '中国',
        cover: 'https://example.com/three-body.jpg',
        categories: [novelCategory._id],
        createdBy: adminUser._id
      },
      {
        title: 'JavaScript高级程序设计',
        author: 'Nicholas C. Zakas',
        description: 'JavaScript开发者必读的经典教程',
        genre: ['编程', '技术'],
        publishDate: new Date('2012-03-01'),
        publisher: '人民邮电出版社',
        isbn: '9787115275790',
        pages: 730,
        language: '中文',
        country: '美国',
        cover: 'https://example.com/js-advanced.jpg',
        categories: [techCategory._id],
        createdBy: adminUser._id
      }
    ]);

    // Create sample games
    console.log('Creating sample games...');
    const actionGameCategory = categories.find(cat => cat.name === '动作' && cat.type === 'game');
    const rpgCategory = categories.find(cat => cat.name === '角色扮演' && cat.type === 'game');

    await Game.insertMany([
      {
        title: '塞尔达传说：旷野之息',
        description: '开放世界冒险游戏的杰作',
        genre: ['动作', '冒险', '开放世界'],
        releaseDate: new Date('2017-03-03'),
        developer: '任天堂',
        publisher: '任天堂',
        platform: ['Nintendo Switch', 'Wii U'],
        rating: 9.4,
        language: ['中文', '英语', '日语'],
        cover: 'https://example.com/zelda-botw.jpg',
        trailer: 'https://example.com/zelda-botw-trailer',
        categories: [actionGameCategory._id],
        createdBy: adminUser._id
      },
      {
        title: '巫师3：狂猎',
        description: '史诗级的角色扮演游戏',
        genre: ['角色扮演', '开放世界', '奇幻'],
        releaseDate: new Date('2015-05-19'),
        developer: 'CD Projekt RED',
        publisher: 'CD Projekt',
        platform: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
        rating: 9.3,
        language: ['中文', '英语', '波兰语'],
        cover: 'https://example.com/witcher3.jpg',
        trailer: 'https://example.com/witcher3-trailer',
        categories: [rpgCategory._id],
        createdBy: adminUser._id
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${categories.length} categories`);
    console.log('Created 1 admin user');
    console.log('Created 2 movies');
    console.log('Created 2 music tracks');
    console.log('Created 2 books');
    console.log('Created 2 games');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('Database connection closed.');
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedData, connectDB };