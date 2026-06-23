/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PersonalityType } from '../types';

export const PERSONALITIES: PersonalityType[] = [
  // Analysts (INTJ, INTP, ENTJ, ENTP)
  // {
  //   id: "INTJ",
  //   name: "建筑师",
  //   englishName: "Architect",
  //   title: "建筑师 (The Royal Architect)",
  //   group: "Analysts",
  //   icon: "Boxes",
  //   description:
  //     "具有无限想象力且擅长制定严密战略的学习者。他们习惯在帷幕后操盘，视人生为一盘精密宏大的星际棋局。",
  //   avatar: "♟️",
  //   traits: ["冷静态睿", "战略远见", "极度独立", "完美主义"],
  //   stats: { resonance: 92, empathy: 45, creation: 95, order: 88 },
  //   bestPartners: ["ENFP", "ENTP"],
  //   weakness: "过分苛求、容易疏离他人情感维度，时而流露出极智的傲慢。",
  //   celestialForce:
  //     "永恒秩序星曜。在浩瀚的星尘寂静中默画千年的因果锁链。能以纯粹的智性真理洞穿世俗的喧闹与迷雾。",
  //   milestones: [
  //     "萌芽：在晦暗星轨中觉醒自我觉察",
  //     "交汇：完成大一统因果网络蓝图的首绘",
  //     "王权：以绝对冷隽的战略重组混沌的星云局势",
  //   ],
  //   historicalFigures: [
  //     "Friedrich Nietzsche",
  //     "Elon Musk",
  //     "Michelle Obama",
  //     "Isaac Newton",
  //   ],
  // },
  // {
  //   id: "INTP",
  //   name: "思想家",
  //   englishName: "Logician",
  //   title: "思想家 (The Mystic Philosopher)",
  //   group: "Analysts",
  //   icon: "Brain",
  //   description:
  //     "狂热的理论探求者，对知识和宇宙运行机理怀有永无止境的渴望。他们视现存架构为等待重构与质疑的草图。",
  //   avatar: "🧪",
  //   traits: ["超然客观", "极致逻辑", "独特视角", "随性求真"],
  //   stats: { resonance: 88, empathy: 40, creation: 98, order: 60 },
  //   bestPartners: ["ENTJ", "ENFJ"],
  //   weakness:
  //     "极易陷入永无止境的“思想递归迷宫”中，在执行力落地和人际交往中显得有些游离与被动。",
  //   celestialForce:
  //     "深邃以太奇点。在星海静默中垂钓终极公理。思维可以瞬间坍缩成信息黑洞，也可以膨胀为浩渺万象。",
  //   milestones: [
  //     "萌芽：怀疑现实星轨中的所有常规真理",
  //     "交汇：搭建起足以自治的精神公理假说网络",
  //     "王权：构建划时代的跨星宇底层物理/心智解释框架",
  //   ],
  //   historicalFigures: [
  //     "Albert Einstein",
  //     "Bill Gates",
  //     "René Descartes",
  //     "Sigourney Weaver",
  //   ],
  // },
  // {
  //   id: "ENTJ",
  //   name: "指挥官",
  //   englishName: "Commander",
  //   title: "指挥官 (The Stellar Commander)",
  //   group: "Analysts",
  //   icon: "Compass",
  //   description:
  //     "天生的铁血领袖。他们将远大愿景落实为雷厉风行的组织效率，能在错综复杂的荒芜星尘里，建构出不朽的主权秩序。",
  //   avatar: "👑",
  //   traits: ["雷厉风行", "意志钢铁", "不畏艰难", "战略决策"],
  //   stats: { resonance: 95, empathy: 50, creation: 90, order: 96 },
  //   bestPartners: ["INFP", "INTP"],
  //   weakness:
  //     "冷酷偏执，极易在推行集体蓝图时视人际情感折损为必经的“理性代价”。",
  //   celestialForce:
  //     "炽天日冕烈阳。以暴风般的无悔意志开疆拓土、廓清寰宇。是混沌世界里绝无仅有的耀眼坐标点。",
  //   milestones: [
  //     "萌芽：在混乱散漫的群体中自然执掌大权",
  //     "交汇：率领众星渡过大分裂期的迷茫震荡",
  //     "王权：铸就历经风暴仍运转无瑕的群星帝国",
  //   ],
  //   historicalFigures: [
  //     "Steve Jobs",
  //     "Gordon Ramsay",
  //     "Margaret Thatcher",
  //     "Franklin D. Roosevelt",
  //   ],
  // },
  // {
  //   id: "ENTP",
  //   name: "辩论家",
  //   englishName: "Debater",
  //   title: "辩论家 (The Renegade Visionary)",
  //   group: "Analysts",
  //   icon: "Sparkles",
  //   description:
  //     "不倦的脑暴制造器与破坏家。他们醉心于解构传统的思想锁链，在辩难、试错以及无穷的观念碰撞中，提纯出反常识的智慧火花。",
  //   avatar: "🎭",
  //   traits: ["奇崛多智", "解构日常", "口才过人", "永动创意"],
  //   stats: { resonance: 90, empathy: 60, creation: 96, order: 50 },
  //   bestPartners: ["INFJ", "INTJ"],
  //   weakness:
  //     "行事缺乏持续的长性专注，易在摧毁旧有共识并享受辩难后留下一片残局。",
  //   celestialForce:
  //     "游移反叛彗星。以不可预测的行为轨迹，砸碎死水微澜的传统星域。它们的存在宣告着变革与创造的奇迹。",
  //   milestones: [
  //     "萌芽：对墨守成规的行为守则提出幽默而嘲讽的挑衅",
  //     "交汇：在学术/创业废墟上快速拉起多重复合新潮观念",
  //     "王权：用不可抗拒的闪电智力革命开创星云认知新维度",
  //   ],
  //   historicalFigures: [
  //     "Mark Twain",
  //     "Thomas Edison",
  //     "Tom Hanks",
  //     "Celine Dion",
  //   ],
  // },
  {
    id: "INTJ",
    name: "建筑师",
    englishName: "Architect",
    title: "建筑师 (The Royal Architect)",
    group: "Analysts",
    icon: "Boxes",
    description:
      "具有战略性思维和系统性规划能力，善于将复杂概念转化为可执行架构。独立且自我驱动，在达成长期目标时展现出非凡的专注与毅力。",
    avatar: "♟️",
    traits: ["战略远见", "独立思考", "高度系统化", "目标导向"],
    stats: { resonance: 92, empathy: 45, creation: 95, order: 88 },
    bestPartners: ["ENFP", "ENTP"],
    weakness:
      "可能因过度追求完美而忽视人际关系，容易给人留下疏离或傲慢的印象。",
    celestialForce: "以理性洞察穿透表象，在静默中构建秩序",
    milestones: [
      "觉醒自我认知",
      "完成战略蓝图的构建",
      "以卓越的领导力重塑组织",
    ],
    historicalFigures: [
      "Friedrich Nietzsche",
      "Elon Musk",
      "Michelle Obama",
      "Isaac Newton",
    ],
  },
  {
    id: "INTP",
    name: "思想家",
    englishName: "Logician",
    title: "思想家 (The Mystic Philosopher)",
    group: "Analysts",
    icon: "Brain",
    description:
      "擅长逻辑分析与理论建构，对知识本身抱有纯粹的好奇。习惯于质疑既有假设，并不断追求更优雅、更自洽的解释框架。",
    avatar: "🧪",
    traits: ["逻辑严密", "理论建构", "独立思考", "求知欲强"],
    stats: { resonance: 88, empathy: 40, creation: 98, order: 60 },
    bestPartners: ["ENTJ", "ENFJ"],
    weakness:
      "可能过于沉溺于抽象思考，在将想法落地和人际互动方面常显得被动或游离。",
    celestialForce: "以逻辑穿透未知，在思维的深海中寻找真理",
    milestones: [
      "怀疑既有认知框架",
      "建立自洽的理论体系",
      "以知识影响力重塑领域",
    ],
    historicalFigures: [
      "Albert Einstein",
      "Bill Gates",
      "René Descartes",
      "Sigourney Weaver",
    ],
  },
  {
    id: "ENTJ",
    name: "指挥官",
    englishName: "Commander",
    title: "指挥官 (The Stellar Commander)",
    group: "Analysts",
    icon: "Compass",
    description:
      "天生的领导者，善于将宏大愿景转化为高效的执行方案。在复杂环境中有清晰的判断力，敢于决策并主动承担风险。",
    avatar: "👑",
    traits: ["决策果断", "战略部署", "意志坚定", "高效执行"],
    stats: { resonance: 95, empathy: 50, creation: 90, order: 96 },
    bestPartners: ["INFP", "INTP"],
    weakness: "在推行目标时可能忽视他人的情感需求，容易被视为冷酷或专制。",
    celestialForce: "以果断的意志开辟道路，在混沌中树立清晰的坐标",
    milestones: [
      "在群体中自然形成领导地位",
      "带领团队度过关键转折期",
      "建立持久运转的组织体系",
    ],
    historicalFigures: [
      "Steve Jobs",
      "Gordon Ramsay",
      "Margaret Thatcher",
      "Franklin D. Roosevelt",
    ],
  },
  {
    id: "ENTP",
    name: "辩论家",
    englishName: "Debater",
    title: "辩论家 (The Renegade Visionary)",
    group: "Analysts",
    icon: "Sparkles",
    description:
      "思维敏捷、富有创造力的概念探索者。热爱解构既有观念，在新旧思想的碰撞中激发灵感。善于即兴论证，乐于挑战常规认知。",
    avatar: "🎭",
    traits: ["思维灵活", "概念创新", "即兴辩论", "挑战常规"],
    stats: { resonance: 90, empathy: 60, creation: 96, order: 50 },
    bestPartners: ["INFJ", "INTJ"],
    weakness:
      "可能因过度热衷于推陈出新而缺乏执行后续的耐心，容易留下未收尾的项目或未解决的争议。",
    celestialForce: "以不可预测的方式打破僵局，为停滞的系统注入新可能",
    milestones: [
      "质疑并挑战既有规范",
      "在多领域间建立创新连接",
      "以思想的影响力开创新范式",
    ],
    historicalFigures: [
      "Mark Twain",
      "Thomas Edison",
      "Tom Hanks",
      "Celine Dion",
    ],
  },

  // Diplomats (INFJ, INFP, ENFJ, ENFP)
  // {
  //   id: "INFJ",
  //   name: "提倡者",
  //   englishName: "Advocate",
  //   title: "提倡者 (The Celestial Advocate)",
  //   group: "Diplomats",
  //   icon: "Flame",
  //   description:
  //     "具有深沉道德使命感与宇宙大同直觉的理想主义者。他们安静外表下藏着火山般的赤诚，致力于编织心灵的和谐之网。",
  //   avatar: "🕯️",
  //   traits: ["极度敏锐", "理想赤诚", "洞察直觉", "温和坚毅"],
  //   stats: { resonance: 98, empathy: 95, creation: 88, order: 80 },
  //   bestPartners: ["ENFP", "ENTP"],
  //   weakness: "极易承受过剩的外界焦虑与悲悯，导致自己坠入自我消耗的精神黑洞。",
  //   celestialForce:
  //     "幽蓝深空永耀。以无声的心灵共振，安抚散落八方的迷航行者。其话语直击灵魂，是抚平伤痕的灯塔。",
  //   milestones: [
  //     "萌芽：感知到他人难以言说的隐秘星轨悲伤并默默承受",
  //     "交汇：为失落的受难者指明前方的希望与方向",
  //     "王权：凝聚微芒凡星，开启一场充满灵性关怀的心智复兴",
  //   ],
  //   historicalFigures: [
  //     "Martin Luther King",
  //     "Mahatma Gandhi",
  //     "Nelson Mandela",
  //     "Fyodor Dostoevsky",
  //   ],
  // },
  // {
  //   id: "INFP",
  //   name: "调停者",
  //   englishName: "Mediator",
  //   title: "调解者 (The Forest Mediator)",
  //   group: "Diplomats",
  //   icon: "Feather",
  //   description:
  //     "高尚、敏感的精灵诗人，对大自然、善意与内心真切价值抱有神圣执念。他们习惯于用诗意的棱镜过滤冷酷世界。",
  //   avatar: "🦋",
  //   traits: ["纯粹心灵", "诗意感悟", "慈悲心怀", "特立独行"],
  //   stats: { resonance: 90, empathy: 98, creation: 92, order: 45 },
  //   bestPartners: ["ENFJ", "ENTJ"],
  //   weakness:
  //     "过于将世界理想化，面对赤裸粗鄙的现实时，极易陷入避世与极度的悲观逃避。",
  //   celestialForce:
  //     "翡翠森林圣息。在林叶簌簌的微光中默默吟咏灵魂诗篇。不着痕迹地把一万缕温柔，注入千疮百孔的红尘。",
  //   milestones: [
  //     "萌芽：在孤独的长夜写下自我觉醒的首行浪漫长诗",
  //     "交汇：通过一幅艺术/文学画卷荡涤世人冷漠的心田",
  //     "王权：以看似微茫但终归丰饶的善之巨力，消融时空中尖锐的情感坚冰",
  //   ],
  //   historicalFigures: [
  //     "William Shakespeare",
  //     "J.R.R. Tolkien",
  //     "Alicia Keys",
  //     "Tom Hiddleston",
  //   ],
  // },
  // {
  //   id: "ENFJ",
  //   name: "主人公",
  //   englishName: "Protagonist",
  //   title: "主人公 (The Divine Protagonist)",
  //   group: "Diplomats",
  //   icon: "HeartHandshake",
  //   description:
  //     "极具个人魅力的精神导师。他们怀着天然的热诚，呼喊并带领伙伴们追求更高星层的人道解放，极富共情感召。 ",
  //   avatar: "🌟",
  //   traits: ["天生领袖", "共情神眷", "言传身教", "利他本源"],
  //   stats: { resonance: 96, empathy: 92, creation: 85, order: 86 },
  //   bestPartners: ["INFP", "INTP"],
  //   weakness:
  //     "过分苛求与他人的和谐联结，常在拯救与托举他人命运的过程中迷失自我。",
  //   celestialForce:
  //     "永恒极光圣幕。以辽阔、包容全身的光辉，庇护并引领成千上万在冰封荒原上行走的失序孤雁。",
  //   milestones: [
  //     "萌芽：在年轻时挺身而出，调和部族间剧烈的仇恨冲突",
  //     "交汇：创办跨界别的情感互助学院，播撒和解良种",
  //     "王权：用不可动摇的慈爱愿景，在虚无荒野中塑建爱之共鸣网络",
  //   ],
  //   historicalFigures: [
  //     "Barack Obama",
  //     "Oprah Winfrey",
  //     "Malala Yousafzai",
  //     "Maya Angelou",
  //   ],
  // },
  // {
  //   id: "ENFP",
  //   name: "竞选者",
  //   englishName: "Campaigner",
  //   title: "竞选者 (The Astral Campaigner)",
  //   group: "Diplomats",
  //   icon: "Smile",
  //   description:
  //     "充满孩子气与无穷热力的快乐播撒者。他们视日常生活为一场隐藏着万千魔法线索的多维乐园，随处皆是奇迹。",
  //   avatar: "🎨",
  //   traits: ["天真热烈", "洞悉人心", "创意飞流", "极度随性"],
  //   stats: { resonance: 94, empathy: 88, creation: 94, order: 52 },
  //   bestPartners: ["INTJ", "INFJ"],
  //   weakness:
  //     "难以忍受繁琐、周而复始的秩序行政流程，常常丢三落四，情绪波动频繁。",
  //   celestialForce:
  //     "闪烁流金星河。携带着狂飙般的欢欣，在冷硬宇宙中奏响烂漫探险曲。他的狂欢与大笑是驱散晦暗的大地之盾。",
  //   milestones: [
  //     "萌芽：在灰暗的生活细节里发现了通往奇迹世界门扉的荧光",
  //     "交汇：以富有感召力的创意狂潮，激活一个沉寂多年的古老群落",
  //     "王权：成为万众瞩目的星汉旅人，谱写星河间最璀璨的一页爱与自由的冒险神传",
  //   ],
  //   historicalFigures: [
  //     "Robert Downey Jr.",
  //     "Robin Williams",
  //     "Quentin Tarantino",
  //     "Kelly Clarkson",
  //   ],
  // },

  {
    id: "INFJ",
    name: "提倡者",
    englishName: "Advocate",
    title: "提倡者 (The Celestial Advocate)",
    group: "Diplomats",
    icon: "Flame",
    description:
      "具有深沉的使命感与敏锐的洞察力，善于看见他人的潜力和事物的深层意义。在安静的外表下，怀有对理想世界的坚定信念。",
    avatar: "🕯️",
    traits: ["深刻洞察", "理想主义", "共情力强", "信念坚定"],
    stats: { resonance: 98, empathy: 95, creation: 88, order: 80 },
    bestPartners: ["ENFP", "ENTP"],
    weakness: "可能因过度吸收他人的情绪而陷入自我消耗，需要学会设立情感边界。",
    celestialForce: "以深邃的共情力连接他人，在无声中带来疗愈与引导",
    milestones: [
      "发现他人难以言说的需求",
      "为他人指明前行的方向",
      "以信念凝聚群体实现共同愿景",
    ],
    historicalFigures: [
      "Martin Luther King",
      "Mahatma Gandhi",
      "Nelson Mandela",
      "Fyodor Dostoevsky",
    ],
  },
  {
    id: "INFP",
    name: "调停者",
    englishName: "Mediator",
    title: "调解者 (The Forest Mediator)",
    group: "Diplomats",
    icon: "Feather",
    description:
      "怀有深厚的价值观和敏锐的感性，对真诚与意义抱有执着追求。善于以独特的方式捕捉和理解人类情感的微妙层次。",
    avatar: "🦋",
    traits: ["价值驱动", "深度共情", "创造性表达", "真诚正直"],
    stats: { resonance: 90, empathy: 98, creation: 92, order: 45 },
    bestPartners: ["ENFJ", "ENTJ"],
    weakness: "可能因过度理想化而回避现实的复杂性，在压力下容易陷入自我怀疑。",
    celestialForce: "以诗意的视角看待世界，在细微处发现生命的温度",
    milestones: [
      "在孤独中确立自我的核心价值观",
      "以艺术或行动触动他人",
      "以善意的力量融化对立与隔阂",
    ],
    historicalFigures: [
      "William Shakespeare",
      "J.R.R. Tolkien",
      "Alicia Keys",
      "Tom Hiddleston",
    ],
  },
  {
    id: "ENFJ",
    name: "主人公",
    englishName: "Protagonist",
    title: "主人公 (The Divine Protagonist)",
    group: "Diplomats",
    icon: "HeartHandshake",
    description:
      "富有感染力的引导者，善于发现和培养他人的潜能。具备自然的领袖魅力，能够激励他人共同追求更高的目标。",
    avatar: "🌟",
    traits: ["鼓舞他人", "领导魅力", "利他精神", "人际协调"],
    stats: { resonance: 96, empathy: 92, creation: 85, order: 86 },
    bestPartners: ["INFP", "INTP"],
    weakness:
      "可能因过度投入于他人的需求而忽略自己的边界，容易在助人过程中迷失自我。",
    celestialForce: "以温暖的光芒照亮他人，在关怀中引领前行的方向",
    milestones: [
      "在群体冲突中主动协调",
      "创立互助性社区或组织",
      "以爱的影响力建立持久的连接网络",
    ],
    historicalFigures: [
      "Barack Obama",
      "Oprah Winfrey",
      "Malala Yousafzai",
      "Maya Angelou",
    ],
  },
  {
    id: "ENFP",
    name: "竞选者",
    englishName: "Campaigner",
    title: "竞选者 (The Astral Campaigner)",
    group: "Diplomats",
    icon: "Smile",
    description:
      "充满热情与好奇心的可能性探索者，善于在平凡中发现非凡。以开放的心态和感染力，激发周围人的热情与创造力。",
    avatar: "🎨",
    traits: ["热情洋溢", "创意丰富", "人际敏感", "开放好奇"],
    stats: { resonance: 94, empathy: 88, creation: 94, order: 52 },
    bestPartners: ["INTJ", "INFJ"],
    weakness:
      "可能因过度追求新奇而难以专注于长期事务，在应对繁琐细节时容易分散注意力。",
    celestialForce: "以无尽的热情点燃他人，在日常中发现魔法与奇迹",
    milestones: [
      "在平凡中发现独特的可能性",
      "以创意激活被忽视的社群或领域",
      "以自由与爱的精神影响一代人",
    ],
    historicalFigures: [
      "Robert Downey Jr.",
      "Robin Williams",
      "Quentin Tarantino",
      "Kelly Clarkson",
    ],
  },

  // Sentinels (ISTJ, ISFJ, ESTJ, ESFJ)
  // {
  //   id: "ISTJ",
  //   name: "守护者",
  //   englishName: "Logistician",
  //   title: "守护者 (The Sacred Sentinel)",
  //   group: "Sentinels",
  //   icon: "ShieldAlert",
  //   description:
  //     "笃实、靠谱的时空锚定者。他们对履约、责任与秩序抱有近乎神圣的准则，任凭外界潮汐变幻，一言九鼎，始终如一。",
  //   avatar: "🛡️",
  //   traits: ["千锤百炼", "忠诚可靠", "秩序谨严", "实干典范"],
  //   stats: { resonance: 80, empathy: 55, creation: 70, order: 98 },
  //   bestPartners: ["ESFP", "ESTP"],
  //   weakness:
  //     "因过分因袭旧章而显得僵死保守，对未知的浪漫幻想和突然的变化充满防卫与抗拒。",
  //   celestialForce:
  //     "万年巍峨山岳。默默奠定大地的根基，万物依其规律春生秋藏。提供宇宙间最让人安心的秩序压舱石。",
  //   milestones: [
  //     "萌芽：在一次变故中完美担负起看守祖庙的繁琐任务，从未出错",
  //     "交汇：数十年如一日细心运营整座繁杂的文明基石档案库",
  //     "王权：当周遭秩序全部碎裂时，用磐石般的坚忍逆势重建星云律法与家园",
  //   ],
  //   historicalFigures: [
  //     "George Washington",
  //     "Angela Merkel",
  //     "Natalie Portman",
  //     "Anthony Hopkins",
  //   ],
  // },
  // {
  //   id: "ISFJ",
  //   name: "守卫者",
  //   englishName: "Defender",
  //   title: "护卫者 (The Galactic Defender)",
  //   group: "Sentinels",
  //   icon: "Shield",
  //   description:
  //     "极其温存、体恤的奉献守护者。在寂静中，他们用细致入微、无怨无悔的实干暖流，将身边的亲朋合群在繁华日常中紧紧相拥。",
  //   avatar: "🏡",
  //   traits: ["体贴入微", "无私奉献", "脚踏实地", "极具长性"],
  //   stats: { resonance: 82, empathy: 85, creation: 72, order: 92 },
  //   bestPartners: ["ESFP", "ESTP"],
  //   weakness:
  //     "习惯将负累与委屈独自咀嚼、独自吞咽，不自觉地用委屈撑大贤惠的假象，深受不甘啃噬。",
  //   celestialForce:
  //     "深情烛照温火。在黑夜的风霜木窗前默默长明。不祈求大世界的狂澜，只祈愿方寸温饱、柴米油盐、家宅长宁。",
  //   milestones: [
  //     "萌芽：细心记下周围每一个人的生理特征与内心敏感底线",
  //     "交汇：独自支撑起遭遇变故、人心散逸的大家族之起居生计",
  //     "王权：成为一方净土中千万归人公认的心灵港湾与至温圣母织网者",
  //   ],
  //   historicalFigures: [
  //     "Queen Elizabeth II",
  //     "Beyoncé",
  //     "Kate Middleton",
  //     "Anne Hathaway",
  //   ],
  // },
  // {
  //   id: "ESTJ",
  //   name: "总经理",
  //   englishName: "Executive",
  //   title: "执行官 (The Sovereign Overseer)",
  //   group: "Sentinels",
  //   icon: "ClipboardCheck",
  //   description:
  //     "秩序与高效率的集大成者。他们擅长于重整混乱的劳动机制、规划公共关系分流，雷厉风行，对规则具有本能的崇敬。",
  //   avatar: "📐",
  //   traits: ["统筹天资", "赏罚严明", "社群脊梁", "实务高手"],
  //   stats: { resonance: 85, empathy: 48, creation: 75, order: 99 },
  //   bestPartners: ["ISFP", "ISTP"],
  //   weakness:
  //     "主导欲过甚，不自觉间化身为死板教条甚至控制狂，对打破制度常规的情感天才产生极度不悦。",
  //   celestialForce:
  //     "至严律法天尺。一分不差地厘定功绩，构建严丝合缝的星系运转发令塔。是世俗宏大秩序的高效推手。",
  //   milestones: [
  //     "萌芽：在学校班会或小型公会里快速确立起高效无尘的考勤奖惩",
  //     "交汇：主持跨省或跨部门的中大型资源和物流紧急调配，名声大噪",
  //     "王权：成为国家重工业或太空枢纽项目的最高执政，制定万世不移的标准",
  //   ],
  //   historicalFigures: [
  //     "John D. Rockefeller",
  //     "Judge Judy",
  //     "Frank Sinatra",
  //     "Sonia Sotomayor",
  //   ],
  // },
  // {
  //   id: "ESFJ",
  //   name: "执政官",
  //   englishName: "Consul",
  //   title: "执政官 (The Radiant Consul)",
  //   group: "Sentinels",
  //   icon: "Users",
  //   description:
  //     "热心肠的社交中心织网人。他们以强大的服务和组织能力，致力于通过家庭宴会、校友联谊等具体仪典，维系并光大社群的温情与荣誉。",
  //   avatar: "🍰",
  //   traits: ["极富好意", "人情至纯", "极重责任", "善解意气"],
  //   stats: { resonance: 88, empathy: 82, creation: 78, order: 90 },
  //   bestPartners: ["ISFP", "ISTP"],
  //   weakness:
  //     "极为介意外界的评价与脸色。如果没有在人群中获得肯定，就会体验到剧烈的自我放逐感与忧伤苦涩。",
  //   celestialForce:
  //     "流光溢彩织网。用最细密的温情丝线织就社交网，网罗住每一只渴望归岸的社交迷乱孤帆。",
  //   milestones: [
  //     "萌芽：在家庭聚会或班级聚餐里因绝妙的体恤安排成为人际焦点",
  //     "交汇：自发担任公益慈善组织的核心，让千万人吃上可口的感恩晚宴",
  //     "王权：在充满戒备与竞争的冷漠都市里，铸就了一座座高黏度、充满爱意联结的和谐熟人小镇",
  //   ],
  //   historicalFigures: [
  //     "Taylor Swift",
  //     "Bill Clinton",
  //     "Jennifer Lopez",
  //     "Steve Harvey",
  //   ],
  // },

  {
    id: "ISTJ",
    name: "守护者",
    englishName: "Logistician",
    title: "守护者 (The Sacred Sentinel)",
    group: "Sentinels",
    icon: "ShieldAlert",
    description:
      "可靠、务实的执行者，以强烈的责任感和纪律性著称。习惯于按照既定程序和标准工作，是组织和系统中值得信赖的中坚力量。",
    avatar: "🛡️",
    traits: ["可靠务实", "责任至上", "遵守规范", "坚韧不拔"],
    stats: { resonance: 80, empathy: 55, creation: 70, order: 98 },
    bestPartners: ["ESFP", "ESTP"],
    weakness:
      "可能因过度遵循既定规则而抗拒变革，对新事物和突发变化持谨慎甚至排斥态度。",
    celestialForce: "以扎实的行动奠定基础，在稳定中守护秩序",
    milestones: [
      "在关键时刻承担重要职责",
      "长期如一地维护组织运转",
      "在秩序崩溃时重建系统",
    ],
    historicalFigures: [
      "George Washington",
      "Angela Merkel",
      "Natalie Portman",
      "Anthony Hopkins",
    ],
  },
  {
    id: "ISFJ",
    name: "守卫者",
    englishName: "Defender",
    title: "护卫者 (The Galactic Defender)",
    group: "Sentinels",
    icon: "Shield",
    description:
      "体贴、尽职的关怀者，善于以实际行动表达关心。注重细节和承诺，在温和的外表下拥有坚定的奉献精神。",
    avatar: "🏡",
    traits: ["细致体贴", "忠诚奉献", "脚踏实地", "持之以恒"],
    stats: { resonance: 82, empathy: 85, creation: 72, order: 92 },
    bestPartners: ["ESFP", "ESTP"],
    weakness:
      "可能因过度牺牲自我而积累委屈，不善于表达自己的需求，容易陷入被动的付出模式。",
    celestialForce: "以默默的关怀守护他人，在微小的行动中传递温度",
    milestones: [
      "铭记身边人的需求与细节",
      "在家庭或组织危机中独自支撑",
      "成为社群公认的温暖核心",
    ],
    historicalFigures: [
      "Queen Elizabeth II",
      "Beyoncé",
      "Kate Middleton",
      "Anne Hathaway",
    ],
  },
  {
    id: "ESTJ",
    name: "总经理",
    englishName: "Executive",
    title: "执行官 (The Sovereign Overseer)",
    group: "Sentinels",
    icon: "ClipboardCheck",
    description:
      "高效、果断的组织者，善于在复杂事务中建立秩序和标准。对传统和规则有天然的尊重，擅长运营管理和团队协调。",
    avatar: "📐",
    traits: ["高效管理", "规范执行", "决策果断", "社群支柱"],
    stats: { resonance: 85, empathy: 48, creation: 75, order: 99 },
    bestPartners: ["ISFP", "ISTP"],
    weakness:
      "可能因过度强调规则和效率而缺乏灵活性，对不符合标准的方式持抵制态度。",
    celestialForce: "以清晰的规则推动进步，在秩序中提升效率",
    milestones: [
      "在团队中建立高效的工作机制",
      "主持大型项目并成功交付",
      "成为行业或社会领域的标准制定者",
    ],
    historicalFigures: [
      "John D. Rockefeller",
      "Judge Judy",
      "Frank Sinatra",
      "Sonia Sotomayor",
    ],
  },
  {
    id: "ESFJ",
    name: "执政官",
    englishName: "Consul",
    title: "执政官 (The Radiant Consul)",
    group: "Sentinels",
    icon: "Users",
    description:
      "热心、善于社交的社群维系者，擅长创造和谐的集体氛围。以真诚的关怀和扎实的行动力，凝聚人心、增进社群纽带。",
    avatar: "🍰",
    traits: ["热心助人", "社交和谐", "责任意识", "社群凝聚"],
    stats: { resonance: 88, empathy: 82, creation: 78, order: 90 },
    bestPartners: ["ISFP", "ISTP"],
    weakness:
      "可能因过度依赖外部认可而失去自我价值判断，在缺乏反馈时容易感到焦虑和不被需要。",
    celestialForce: "以温暖的连接编织社群，在互动中创造归属",
    milestones: [
      "在集体活动中成为自然的组织者",
      "推动公益或社区项目造福他人",
      "在冷漠环境中建立充满关怀的社群",
    ],
    historicalFigures: [
      "Taylor Swift",
      "Bill Clinton",
      "Jennifer Lopez",
      "Steve Harvey",
    ],
  },
  // Explorers (ISTP, ISFP, ESTP, ESFP)
  // {
  //   id: "ISTP",
  //   name: "鉴赏家",
  //   englishName: "Virtuoso",
  //   title: "鉴赏家 (The Abyssal Virtuoso)",
  //   group: "Explorers",
  //   icon: "Wrench",
  //   description:
  //     "低调的机电宗师或隐修刀客。他们生就一双极其手巧、专注的眼睛，能冷静、自得其乐地在静默中玩转高智制造、极限户外或工具修理。",
  //   avatar: "⚙️",
  //   traits: ["少言极简", "极客本能", "绝佳应变", "实用逻辑"],
  //   stats: { resonance: 84, empathy: 42, creation: 91, order: 68 },
  //   bestPartners: ["ESTJ", "ESFJ"],
  //   weakness:
  //     "情感沟通时木讷死板甚至带有破坏性的冷漠，对长程的情感承诺和沉重的社会束缚持戒备抗拒态度。",
  //   celestialForce:
  //     "冷寂星陨玄铁。蕴含着极致的爆发力与工匠之光。在绝对无声的静谧中，能将万两杂质沙砾锻造为无双仙刃。",
  //   milestones: [
  //     "萌芽：独自在阁楼将拆毁废弃的古董钟表或马达完美还原组装",
  //     "交汇：绝顶冷静、单枪匹马在极端暴雨山难中利用野外知识全身而退",
  //     "王权：成为整个星系特行机制中，负责攻克最棘手、最高难度硬核缺陷的传奇拆弹人",
  //   ],
  //   historicalFigures: [
  //     "Michael Jordan",
  //     "Tom Cruise",
  //     "Bear Grylls",
  //     "Daniel Craig",
  //   ],
  // },
  // {
  //   id: "ISFP",
  //   name: "艺术家",
  //   englishName: "Adventurer",
  //   title: "艺术家 (The Ethereal Composer)",
  //   group: "Explorers",
  //   icon: "Palette",
  //   description:
  //     "活在当下的浮光精灵。他们热爱音乐、色彩等流动的直觉波纹，不屑拘束他人，极享用温和、含蓄的方式对万物生命投以脉脉温情。",
  //   avatar: "🎨",
  //   traits: ["极致审美", "无声野性", "温柔慈和", "不喜束缚"],
  //   stats: { resonance: 86, empathy: 82, creation: 93, order: 48 },
  //   bestPartners: ["ESTJ", "ESFJ"],
  //   weakness:
  //     "过分抗拒计划。在长线目标拆解、人生宏图竞争以及压力遭遇中，极易选择弃刀流浪、消极自闭。",
  //   celestialForce:
  //     "月影浮水幻流。它静美、自足、流动。你无法将其拘束在固定的容器里，它却以无形无言的清辉照亮了黑夜。",
  //   milestones: [
  //     "萌芽：为了一场转瞬即逝的落日，放弃了高升考证并表示毫无悔恨",
  //     "交汇：设计出震惊圈内、以天然不着雕琢为极致灵魂的小众艺术流派",
  //     "王权：化为千家万户枯燥生活中，一汪无处不在但又不可多得的纯粹美感甘泉",
  //   ],
  //   historicalFigures: [
  //     "Michael Jackson",
  //     "Frida Kahlo",
  //     "Lana Del Rey",
  //     "Jimi Hendrix",
  //   ],
  // },
  // {
  //   id: "ESTP",
  //   name: "企业家",
  //   englishName: "Entrepreneur",
  //   title: "挑战者 (The Solar Daredevil)",
  //   group: "Explorers",
  //   icon: "ShieldAlert",
  //   description:
  //     "风暴中央的高能逐浪者。他们具有猎犬般对当前商机、物理危机的最速捕捉力，说干就干，在极其极限甚至危险的境地中飞流起舞。",
  //   avatar: "⚡",
  //   traits: ["活在极限", "天生机敏", "气场爆格", "实战大师"],
  //   stats: { resonance: 90, empathy: 58, creation: 82, order: 55 },
  //   bestPartners: ["ISTJ", "ISFJ"],
  //   weakness:
  //     "注意力漂移，经常忽视潜在的长程系统风险，行事可能粗俗蛮干，不顾人情细微涟漪。",
  //   celestialForce:
  //     "极光闪电狂澜。它一瞬洞穿夜空，将狂野的电流注入毫无生气的地方。它带来极端的激情与现世果断。",
  //   milestones: [
  //     "萌芽：在同龄人犹疑不决时率先下海做生意或挑战最难滑雪赛道，赚得第一桶金",
  //     "交汇：在巨大的金融危机或物资断裂风暴中，凭借闪电般的人情和魄力瞬间逆转局面",
  //     "王权：缔造出在极限风口上，能随时极速漂移并傲立不倒的传奇实体商业巨帆",
  //   ],
  //   historicalFigures: [
  //     "Donald Trump",
  //     "Madonna",
  //     "Ernest Hemingway",
  //     "Bruce Willis",
  //   ],
  // },
  // {
  //   id: "ESFP",
  //   name: "表演者",
  //   englishName: "Entertainer",
  //   title: "表演者 (The Aurora Entertainer)",
  //   group: "Explorers",
  //   icon: "Radio",
  //   description:
  //     "人生即是闪亮高光的璀璨天生明星。他们拥有极其惊人的热情氛围制造力，走到哪里，哪里就是欢声笑语、觥筹交错与生活赞歌。",
  //   avatar: "🎷",
  //   traits: ["自带聚光", "极乐主义", "高尚社交", "热忱生活"],
  //   stats: { resonance: 92, empathy: 75, creation: 88, order: 58 },
  //   bestPartners: ["ISTJ", "ISFJ"],
  //   weakness:
  //     "难以独处，对深度痛苦、严峻话题等具有深深的防御与回避冲动，往往沦入极肤浅的人际狂欢中。",
  //   celestialForce:
  //     "绚丽节日烟花。当它升空炸开的那一刻，千万颗晦暗麻木的眼睛都在它的映照下，流露出重回童年的幸福流光。",
  //   milestones: [
  //     "萌芽：在极尴尬的同学聚餐上，以一个不可思议的脱口秀绝活完美挽救全场",
  //     "交汇：主导或担纲整个城池、整个学校中最大、最闪耀、凝聚万千笑容的超级狂欢演秀",
  //     "王权：成为划时代的艺术、潮流或人际感官文化图腾，定义一整代青年群体的娱乐狂想与不夜信念",
  //   ],
  //   historicalFigures: [
  //     "Marilyn Monroe",
  //     "Elvis Presley",
  //     "Serena Williams",
  //     "Cristiano Ronaldo",
  //   ],
  // },

  {
    id: "ISTP",
    name: "鉴赏家",
    englishName: "Virtuoso",
    title: "鉴赏家 (The Abyssal Virtuoso)",
    group: "Explorers",
    icon: "Wrench",
    description:
      "冷静、灵活的问题解决者，善于在动手实践中掌握技能。对机械原理和物理世界有天然的敏锐，享受独立操作的满足感。",
    avatar: "⚙️",
    traits: ["动手能力", "冷静应变", "独立操作", "实用导向"],
    stats: { resonance: 84, empathy: 42, creation: 91, order: 68 },
    bestPartners: ["ESTJ", "ESFJ"],
    weakness: "在情感沟通方面可能显得笨拙或疏远，对长期承诺和责任感到束缚。",
    celestialForce: "以精湛的技艺解决难题，在安静中展现卓越",
    milestones: [
      "独立完成复杂的技术修复",
      "在极端环境中依靠技能全身而退",
      "成为解决最棘手问题的权威专家",
    ],
    historicalFigures: [
      "Michael Jordan",
      "Tom Cruise",
      "Bear Grylls",
      "Daniel Craig",
    ],
  },
  {
    id: "ISFP",
    name: "艺术家",
    englishName: "Adventurer",
    title: "艺术家 (The Ethereal Composer)",
    group: "Explorers",
    icon: "Palette",
    description:
      "敏感、富有审美力的感性体验者，善于捕捉生活中的细微美感。以低调和温和的方式表达自我，对自然和真实有天然的亲近。",
    avatar: "🎨",
    traits: ["审美敏锐", "温和敏感", "活在当下", "自然真实"],
    stats: { resonance: 86, empathy: 82, creation: 93, order: 48 },
    bestPartners: ["ESTJ", "ESFJ"],
    weakness:
      "可能因抗拒结构和规划而在长期目标面前感到力不从心，面对压力时倾向于退缩。",
    celestialForce: "以无言的审美照亮日常，在平凡中创造诗意",
    milestones: [
      "为追求心动的瞬间而放弃安全选项",
      "以独特的风格影响审美潮流",
      "成为生活中不可或缺的美感泉源",
    ],
    historicalFigures: [
      "Michael Jackson",
      "Frida Kahlo",
      "Lana Del Rey",
      "Jimi Hendrix",
    ],
  },
  {
    id: "ESTP",
    name: "企业家",
    englishName: "Entrepreneur",
    title: "挑战者 (The Solar Daredevil)",
    group: "Explorers",
    icon: "ShieldAlert",
    description:
      "精力充沛、善于把握机遇的实践者，对当下的环境和机会有敏锐的感知。擅长在快速变化的情境中做出判断并果断行动。",
    avatar: "⚡",
    traits: ["行动导向", "机遇敏锐", "果断大胆", "实战能手"],
    stats: { resonance: 90, empathy: 58, creation: 82, order: 55 },
    bestPartners: ["ISTJ", "ISFJ"],
    weakness: "可能因过于关注眼前而忽视长远规划，行事风格有时显得冲动或粗放。",
    celestialForce: "以敏锐的行动抓住机遇，在动态中创造价值",
    milestones: [
      "在他人犹豫时率先行动并取得成功",
      "在危机中快速反转局面",
      "在激烈竞争中建立不可撼动的优势",
    ],
    historicalFigures: [
      "Donald Trump",
      "Madonna",
      "Ernest Hemingway",
      "Bruce Willis",
    ],
  },
  {
    id: "ESFP",
    name: "表演者",
    englishName: "Entertainer",
    title: "表演者 (The Aurora Entertainer)",
    group: "Explorers",
    icon: "Radio",
    description:
      "活力四射、热爱分享的快乐传播者，善于创造欢乐和温暖的氛围。以自然流露的热情和感染力，让周围的人感到轻松和被接纳。",
    avatar: "🎷",
    traits: ["热情洋溢", "氛围营造", "人际魅力", "享受当下"],
    stats: { resonance: 92, empathy: 75, creation: 88, order: 58 },
    bestPartners: ["ISTJ", "ISFJ"],
    weakness:
      "可能因过度依赖外界刺激而难以独处，对消极情绪或严肃话题有回避倾向。",
    celestialForce: "以不可抗拒的活力点亮空间，在欢笑中治愈他人",
    milestones: [
      "在尴尬场合中凭借自然魅力挽救气氛",
      "成为大型活动的核心组织或表演者",
      "定义一个时代的娱乐与流行文化符号",
    ],
    historicalFigures: [
      "Marilyn Monroe",
      "Elvis Presley",
      "Serena Williams",
      "Cristiano Ronaldo",
    ],
  },
];
