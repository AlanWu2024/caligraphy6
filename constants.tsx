
export const COLORS = {
  inkBlack: '#1A1A1A',
  paperWhite: '#F5F5F0',
  vermilion: '#C83C23',
  ancientGray: '#8C8C8C',
  gold: '#D4AF37',
  successGreen: '#52C41A',
};

export const MOCK_CALLIGRAPHERS = [
  { name: '王羲之', dynasty: '东晋', avatar: 'https://picsum.photos/seed/wang/100/100' },
  { name: '怀素', dynasty: '唐', avatar: 'https://picsum.photos/seed/huaisu/100/100' },
  { name: '张旭', dynasty: '唐', avatar: 'https://picsum.photos/seed/zhangxu/100/100' },
  { name: '米芾', dynasty: '北宋', avatar: 'https://picsum.photos/seed/mifu/100/100' },
];

export const MOCK_CHAR_DETAIL = {
  '之': {
    etymology: '从一从止，表行进。本义：行进。引申为：到达。',
    sources: ['兰亭序', '圣教序'],
    meanings: ['助词', '动词', '代词'],
  }
};

export const DYNASTIES = ['全部', '东晋', '唐代', '宋代', '元代', '明清'];

export const CLASSICS_DATA = [
  { id: '1', title: '兰亭序', author: '王羲之', dynasty: '东晋', type: '行书', cover: 'https://picsum.photos/seed/lanting/600/300', desc: '天下第一行书，飘若浮云，矫若惊龙。' },
  { id: '2', title: '祭侄文稿', author: '颜真卿', dynasty: '唐代', type: '行草', cover: 'https://picsum.photos/seed/jizhi/600/300', desc: '极具情感张力的书法神作，被誉为天下第二行书。' },
  { id: '3', title: '自叙帖', author: '怀素', dynasty: '唐代', type: '草书', cover: 'https://picsum.photos/seed/zixu/600/300', desc: '狂草巅峰之作，圆转如环，神采动人。' },
  { id: '4', title: '寒食帖', author: '苏轼', dynasty: '宋代', type: '行书', cover: 'https://picsum.photos/seed/hanshi/600/300', desc: '苏轼流放黄州时的心境写照，格调瑰丽。' },
  { id: '5', title: '蜀素帖', author: '米芾', dynasty: '宋代', type: '行书', cover: 'https://picsum.photos/seed/shusu/600/300', desc: '八面出锋，变化万端。' },
  { id: '6', title: '古诗四帖', author: '张旭', dynasty: '唐代', type: '草书', cover: 'https://picsum.photos/seed/zhangxu4/600/300', desc: '草圣张旭的传世孤本。' },
];
