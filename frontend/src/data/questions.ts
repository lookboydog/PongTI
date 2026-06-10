/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "小马谷要举办“夏日庆典”，你更愿意：",
    category: "EI",
    options: [
      {
        text: "主动报名表演节目，像萍琪派那样到处拉票、组织观众互动，成为全场的焦点",
        value: "E",
        score: 6,
      },
      {
        text: "参加集体游戏和合唱，和大家一起热闹，但不用自己出风头",
        value: "E",
        score: 4,
      },
      {
        text: "帮忙布置场地或准备食物，然后在安静角落像小蝶那样观看庆典",
        value: "I",
        score: 2,
      },
      {
        text: "根本不去庆典，宁愿独自在家看书（像暮光闪闪）或照顾宠物",
        value: "I",
        score: 0,
      },
    ],
  },
  {
    id: 2,
    text: "在甜苹果园帮忙时，你更喜欢：",
    category: "EI",
    options: [
      {
        text: "和苹果嘉儿、大麦哥一起边干活边聊天，大声说笑",
        value: "E",
        score: 6,
      },
      { text: "加入摘苹果的队伍，和大家一起唱劳动号子", value: "E", score: 4 },
      { text: "独自负责给苹果分类装箱，安静地完成工作", value: "I", score: 2 },
      {
        text: "宁可一个人去后院修篱笆，也不愿意在人群里干活",
        value: "I",
        score: 0,
      },
    ],
  },
  {
    id: 3,
    text: "你参加云宝黛西组织的“新秀飞行比赛”，观众很多，你会：",
    category: "EI",
    options: [
      {
        text: "兴奋地朝观众挥手，大声喊口号鼓动气氛，像云宝那样炫酷",
        value: "E",
        score: 6,
      },
      { text: "和队友击掌互相打气，享受观众的欢呼", value: "E", score: 4 },
      { text: "专注在自己的技术动作上，尽量忽略观众", value: "I", score: 2 },
      {
        text: "感到压力很大，希望比赛快点结束，然后一个人复盘",
        value: "I",
        score: 0,
      },
    ],
  },
  {
    id: 4,
    text: "在坎特洛特皇家化装舞会上，你更喜欢：",
    category: "EI",
    options: [
      {
        text: "穿最闪亮的服装，成为全场焦点，主动和所有小马碰杯聊天",
        value: "E",
        score: 6,
      },
      {
        text: "和几个熟悉的朋友组成小圈子，玩闹拍照，偶尔接纳新人",
        value: "E",
        score: 4,
      },
      {
        text: "安静地站在角落观察别人的装扮，偶尔和靠近的小马聊聊",
        value: "I",
        score: 2,
      },
      {
        text: "待一会儿就找借口离开，回家享受一个人的宁静",
        value: "I",
        score: 0,
      },
    ],
  },
  {
    id: 5,
    text: "你来到一座全是陌生小马的新城市（比如马哈顿），你会怎么交朋友？",
    category: "EI",
    options: [
      {
        text: "主动去市集、咖啡馆等人多的地方，微笑着向每个小马介绍自己",
        value: "E",
        score: 6,
      },
      {
        text: "参加当地的兴趣小组（闪电飞马队后备营或编织俱乐部），在活动中自然认识小马",
        value: "E",
        score: 4,
      },
      {
        text: "先观察谁看起来友善，然后找机会一对一聊天",
        value: "I",
        score: 2,
      },
      {
        text: "不太会主动，希望有人能先来和我说话；或者保持独来独往",
        value: "I",
        score: 0,
      },
    ],
  },
  {
    id: 6,
    text: "你发现了一本记载失传魔法的古籍，据说来自星璇大法师，你会：",
    category: "SN",
    options: [
      {
        text: "立刻按照书上的步骤精确施法，观察实际效果",
        value: "S",
        score: 6,
      },
      {
        text: "先找其他资料验证咒语的安全性，再小范围实验",
        value: "S",
        score: 4,
      },
      {
        text: "不着急施法，而是思考这个魔法的历史背景和宇宙原理",
        value: "N",
        score: 2,
      },
      {
        text: "大胆改编咒语，加入自己的创意，像无序那样创造前所未有的新魔法",
        value: "N",
        score: 0,
      },
    ],
  },
  {
    id: 7,
    text: "你得到一颗神秘的种子，据说能长出像谐律之树那样的神奇植物，你会：",
    category: "SN",
    options: [
      {
        text: "按种植手册的标准流程，种在最好的土壤里，每天记录生长",
        value: "S",
        score: 6,
      },
      {
        text: "请教苹果嘉儿或史密夫婆婆等有经验的农夫，参考实际案例来种植",
        value: "S",
        score: 4,
      },
      {
        text: "想象它会长出彩虹花或会唱歌的果实，尝试用月光和音乐培育",
        value: "N",
        score: 2,
      },
      {
        text: "把它放在各种奇怪条件下（比如颠倒浇水、闪电施肥），看能激发什么变异",
        value: "N",
        score: 0,
      },
    ],
  },
  {
    id: 8,
    text: "你在无尽森林的废墟里寻找一件古代神器（如谐律元素），你会怎么找？",
    category: "SN",
    options: [
      {
        text: "拿着地图，按照房间功能（卧室、书房、宝库）逐步搜索",
        value: "S",
        score: 6,
      },
      {
        text: "留意地上的痕迹、灰尘厚度、蜘蛛网分布这些实际线索",
        value: "S",
        score: 4,
      },
      {
        text: "凭直觉猜测先代会把神器藏在最隐秘的暗格里，并尝试触发机关",
        value: "N",
        score: 2,
      },
      {
        text: "闭上眼睛感受魔法能量流动，跟着“命运指引”走",
        value: "N",
        score: 0,
      },
    ],
  },
  {
    id: 9,
    text: "你想为朋友（比如瑞瑞）制作一份独特的生日礼物，你会：",
    category: "SN",
    options: [
      {
        text: "根据她平时提过的喜好，做一件实用又精美的物品，比如宝石围巾或魔法蛋糕",
        value: "S",
        score: 6,
      },
      {
        text: "参考旋转珍宝时装店的经典教程，一步步复刻出来",
        value: "S",
        score: 4,
      },
      {
        text: "做一件象征你们友谊的抽象艺术品，比如画满回忆符号的水晶球",
        value: "N",
        score: 2,
      },
      {
        text: "凭空发明一种全新的礼物形式，例如“会讲笑话的魔法帽子”",
        value: "N",
        score: 0,
      },
    ],
  },
  {
    id: 10,
    text: "你发现了一本空白的魔法书（类似塞拉斯蒂娅公主的古老典籍），写在上面的字会变成现实，你会写：",
    category: "SN",
    options: [
      {
        text: "写“一桶美味的苹果汁”，然后享受真实的苹果汁",
        value: "S",
        score: 6,
      },
      {
        text: "写“一本关于草药配方的实用手册”，获得知识",
        value: "S",
        score: 4,
      },
      {
        text: "试着写一段关于“永恒友谊”的诗句，看它如何具象化",
        value: "N",
        score: 2,
      },
      {
        text: "写下一个全新的小马物种描述，让它从想象中诞生",
        value: "N",
        score: 0,
      },
    ],
  },
  {
    id: 11,
    text: "小蝶的朋友因为被嘲笑而伤心哭泣，你会：",
    category: "TF",
    options: [
      {
        text: "拥抱她，说“我完全理解你的感受，我会一直陪着你”",
        value: "F",
        score: 6,
      },
      {
        text: "安慰她，然后一起分析谁对谁错，想办法解决",
        value: "F",
        score: 4,
      },
      {
        text: "理性指出她可能也有些问题，建议她如何改进",
        value: "T",
        score: 2,
      },
      {
        text: "直接去找嘲笑者理论，用逻辑和事实让对方道歉",
        value: "T",
        score: 0,
      },
    ],
  },
  {
    id: 12,
    text: "在小蝶的动物收容所里，一只受惊的兔子（比如天使兔）咬坏了你心爱的围巾，你会：",
    category: "TF",
    options: [
      {
        text: "先安抚兔子，说“没关系，我知道你不是故意的”",
        value: "F",
        score: 6,
      },
      {
        text: "有点难过但不会责怪，和小蝶一起让兔子平静下来",
        value: "F",
        score: 4,
      },
      {
        text: "冷静评估围巾还能否修补，并思考如何避免兔子再接近贵重物品",
        value: "T",
        score: 2,
      },
      {
        text: "认为兔子需要接受行为训练，建议给小动物们建立严格的规则",
        value: "T",
        score: 0,
      },
    ],
  },
  {
    id: 13,
    text: "同学因为考试不及格而哭，但他平时从不学习（就像年轻的穗龙偶尔贪玩），你会：",
    category: "TF",
    options: [
      {
        text: "先安慰情绪，然后温和地问“需不需要一起复习？”",
        value: "F",
        score: 6,
      },
      {
        text: "觉得他确实该哭，但依然陪他吃冰淇淋让他好受点",
        value: "F",
        score: 4,
      },
      {
        text: "告诉他“这次没努力的结果就是这样，下次认真学吧”",
        value: "T",
        score: 2,
      },
      {
        text: "直接给他制定一个严格的学习计划表，要求他执行",
        value: "T",
        score: 0,
      },
    ],
  },
  {
    id: 14,
    text: "你在甜苹果园不小心撞倒了一大摞苹果桶，你会：",
    category: "TF",
    options: [
      {
        text: "马上道歉并感到非常愧疚，主动熬夜加班把所有苹果重新整理好",
        value: "F",
        score: 6,
      },
      {
        text: "诚恳道歉，并请大麦哥喝一杯苹果汁作为补偿",
        value: "F",
        score: 4,
      },
      {
        text: "冷静地评估损失，然后想一个更高效的整理方案来弥补时间",
        value: "T",
        score: 2,
      },
      {
        text: "承认错误并接受批评，但指出苹果桶摆放的位置本来就不合理",
        value: "T",
        score: 0,
      },
    ],
  },
  {
    id: 15,
    text: "朋友沉迷梦想（比如像特丽克西那样想当伟大魔术师）而荒废了正事，你会：",
    category: "TF",
    options: [
      {
        text: "支持她的梦想，帮她联系声乐老师，即使她现在唱得不好",
        value: "F",
        score: 6,
      },
      {
        text: "委婉地提醒她，但依然鼓励她尝试，同时帮她兼顾日常责任",
        value: "F",
        score: 4,
      },
      {
        text: "直接指出她的天赋暂时不够，建议她先完成学业再发展爱好",
        value: "T",
        score: 2,
      },
      {
        text: "列出她成功的概率和失败后的退路，让她理性决策",
        value: "T",
        score: 0,
      },
    ],
  },
  {
    id: 16,
    text: "你和朋友们计划一次长途旅行（比如去水晶帝国），你更倾向：",
    category: "JP",
    options: [
      {
        text: "提前做好详细行程表，订好每一站的马车票和旅馆",
        value: "J",
        score: 6,
      },
      {
        text: "定下几个必须去的景点（如水晶爱心、冰雪城堡），其余时间灵活安排",
        value: "J",
        score: 4,
      },
      {
        text: "只定一个大致方向，走到哪玩到哪，随遇而安",
        value: "P",
        score: 2,
      },
      {
        text: "完全没有计划，甚至可能因为发现有趣的小路而彻底改变目的地",
        value: "P",
        score: 0,
      },
    ],
  },
  {
    id: 17,
    text: "友谊学校布置了“友谊报告”作业，你会选择：",
    category: "JP",
    options: [
      {
        text: "提前一周规划好提纲，每天写一点，确保准时交上完美报告",
        value: "J",
        score: 6,
      },
      { text: "先收集素材，再集中两天写完，留时间检查", value: "J", score: 4 },
      { text: "截止前一天才开始写，但能保证完成", value: "P", score: 2 },
      {
        text: "总是拖到最后一刻，甚至可能因为灵光乍现而彻底推翻重写",
        value: "P",
        score: 0,
      },
    ],
  },
  {
    id: 18,
    text: "你房间突然出现一扇通往未知世界的魔法门（类似星璇的时空门），你会：",
    category: "JP",
    options: [
      {
        text: "不进去，先向塞拉斯蒂娅公主报告，等许可并准备充分再探索",
        value: "J",
        score: 6,
      },
      {
        text: "在门口留标记，回去拿上地图、干粮和应急魔法道具再进入",
        value: "J",
        score: 4,
      },
      {
        text: "好奇地探头看一眼，如果觉得有趣就直接走进去",
        value: "P",
        score: 2,
      },
      { text: "毫不犹豫跳进去，享受未知带来的刺激", value: "P", score: 0 },
    ],
  },
  {
    id: 19,
    text: "无序给你寄了一封恶作剧邀请函，说他的混沌城堡里有宝藏但全是混乱陷阱，你会：",
    category: "JP",
    options: [
      {
        text: "拒绝前往，因为无序太不可靠，我才不浪费时间",
        value: "J",
        score: 6,
      },
      {
        text: "先制定一套应对各种陷阱的预案，再和朋友组队前往",
        value: "J",
        score: 4,
      },
      { text: "觉得很有趣，直接去看看他能搞出什么花样", value: "P", score: 2 },
      {
        text: "欣然前往，并且一路上即兴用无序的规则反过来戏弄他",
        value: "P",
        score: 0,
      },
    ],
  },
  {
    id: 20,
    text: "魔法预测今天下午在小马谷上空会有一次罕见的“双彩虹雨”，你会：",
    category: "JP",
    options: [
      {
        text: "提前一小时到最佳观测点（比如云中城）占位置，带上雨伞和相机，按计划欣赏",
        value: "J",
        score: 6,
      },
      {
        text: "准时到场，但也会接受天气的小变化，比如彩虹位置偏移",
        value: "J",
        score: 4,
      },
      {
        text: "有空就去，没空就算了，彩虹雨虽然罕见但未必值得专门安排",
        value: "P",
        score: 2,
      },
      {
        text: "临时起意，如果路上遇到其他有趣的事（比如萍琪派的派对），可能就不去看彩虹雨了",
        value: "P",
        score: 0,
      },
    ],
  },
];
