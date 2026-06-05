const form = document.querySelector("#launchForm");
const result = document.querySelector("#result");
const emptyState = document.querySelector("#emptyState");
const typeBadge = document.querySelector("#typeBadge");
const historyList = document.querySelector("#historyList");
const generateAIButton = document.querySelector("#generateAI");
const downloadPptButton = document.querySelector("#downloadPpt");
const apiProviderInput = document.querySelector("#apiProvider");
const apiKeyInput = document.querySelector("#apiKey");
const apiBaseUrlInput = document.querySelector("#apiBaseUrl");
const apiModelInput = document.querySelector("#apiModel");
const apiStatus = document.querySelector("#apiStatus");
const saveApiConfigButton = document.querySelector("#saveApiConfig");
const clearApiConfigButton = document.querySelector("#clearApiConfig");

const storageKey = "ukec-live-launch-history";
const apiConfigKey = "ukec-live-launch-api-config";
let latestMarkdown = "";
let latestData = null;

const providerPresets = {
  openai: {
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4.1-mini",
  },
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
  },
  doubao: {
    label: "豆包 / 火山方舟",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    model: "请填写你的豆包模型 Endpoint ID",
  },
  custom: {
    label: "自定义兼容接口",
    baseUrl: "",
    model: "",
  },
};

const sample = {
  targetType: "天赋志愿场",
  time: "6月11日 14:00",
  topic: "高考结束后第一步：孩子未来方向怎么判断？",
  audience: "高考后学生家长",
  guest: "彭威老师，遇见天赋项目负责人",
  goal: "品牌层：让大家信赖 UKEC 的实力\n内容层：让家长知道这个阶段要如何选专业\n促销层：售卖遇见天赋产品",
  brandGoal: "通过高考后天赋志愿直播，强化 UKEC 在高考后升学规划中的专业陪伴认知，单场观看目标800+，评论互动80+。",
  contentGoal: "让高考后家长看完后，能理解孩子专业方向判断不能只看分数，并知道先做一次专业方向评估。",
  marketingGoal: "用遇见天赋自评表吸引家长回复关键词，用案例增强信任，用免费1v1规划名额推动私域承接。",
  conversionGoal: "直播后24小时内沉淀30个资料领取，10个有效咨询，3个1v1规划预约。",
  pain: "1. 不知道高考之后选什么专业\n2. 不知道现在这个阶段要做什么",
  marketInsight: "高考刚结束，分数未出，家长进入等待期和焦虑期，开始担心专业、志愿和未来路径。",
  userSegment: "高考后学生家长；孩子专业方向不清楚、家长希望提前做预案的家庭。",
  productPosition: "遇见天赋产品 + 高考后专业方向1v1规划。",
  valueProp: "UKEC帮助家庭先看清孩子特点和路径选择，再决定志愿、专业和海外本科备选方案。",
  channelStrategy: "视频号直播间引流，社群和朋友圈预热，小助手承接关键词，顾问私域跟进1v1规划。",
  caseEvidence: "建议准备1个专业方向从模糊到清晰的学生案例，包含原始困惑、评估发现、方向调整和后续规划建议。",
  hostQuestions:
    "高考刚结束，分数还没出来，现在就看专业方向会不会太早？\n很多家长说孩子不知道自己喜欢什么，这种情况应该怎么判断？\n判断孩子适合什么专业，除了分数还要看哪些维度？\n如果孩子和家长对专业方向想法不一致，应该听谁的？\n高考后选专业，家长最容易踩的坑是什么？\n彭老师有没有遇到过方向模糊但通过评估变清楚的案例？\n今天听完之后，家长第一步应该做什么？",
  keyword: "天赋",
  leadMagnet: "遇见天赋自评表",
  lottery: "每10分钟抽1个登机箱",
  benefit: "10个免费1v1规划名额",
  attentionHook: "分数还没出，家长现在到底能为孩子未来方向做什么？",
  interestHook: "用遇见天赋自评表帮助家长先做专业方向初筛。",
  desireHook: "直播间限量10个免费1v1规划名额，让老师帮孩子做一次方向判断。",
  actionHook: "评论区回复【天赋】领取自评表，回复【评估】预约1v1规划。",
  foggMotivation: "高考后窗口期短，越早评估，出分后越不容易被动。",
  foggAbility: "用户不需要马上签约，只需回复关键词领取资料或预约评估。",
  foggTrigger: "开场预告、Q3后提醒、Q6后强调、结尾集中CTA。",
  reviewTargets: "观看800+、评论互动80+、关键词回复50+、资料领取30+、有效咨询10+、1v1预约3+。",
  next: "6月11日 19点 家长专场：高考后留学，家长最关心的7个问题",
};

const typeConfig = [
  {
    name: "天赋志愿场",
    terms: ["天赋", "专业", "志愿", "方向", "适合"],
    keyword: "天赋",
    lead: "专业方向测评表",
    action: "预约天赋/专业方向评估",
    dimensions: ["兴趣偏好", "能力优势", "性格特质", "价值观", "未来路径"],
  },
  {
    name: "留学路径场",
    terms: ["留学", "路径", "Plan B", "本科", "直录", "本预", "国际大一"],
    keyword: "路径",
    lead: "高考后本科路径图",
    action: "预约本科路径1v1评估",
    dimensions: ["高考成绩", "英语基础", "预算区间", "目标国家", "入学时间"],
  },
  {
    name: "家长决策场",
    terms: ["家长", "预算", "决策", "费用", "是否适合"],
    keyword: "评估",
    lead: "家长决策清单",
    action: "对接顾问做家庭方案判断",
    dimensions: ["成绩预期", "家庭预算", "孩子意愿", "风险承受", "路径匹配"],
  },
  {
    name: "出分前准备场",
    terms: ["出分前", "准备", "预案", "分数未出"],
    keyword: "准备",
    lead: "出分前准备清单",
    action: "预约出分前规划",
    dimensions: ["预估分数", "院校区间", "专业方向", "备选路径", "时间节点"],
  },
  {
    name: "出分后补救场",
    terms: ["出分后", "补救", "滑档", "补录", "分数段", "不理想"],
    keyword: "补救",
    lead: "不同分数段路径建议表",
    action: "预约出分后补救方案",
    dimensions: ["实际分数", "录取风险", "补录机会", "海外备选", "时间成本"],
  },
];

const defaultType = {
  name: "高考后综合规划场",
  keyword: "评估",
  lead: "高考后规划清单",
  action: "预约高考后1v1评估",
  dimensions: ["成绩情况", "专业方向", "英语基础", "家庭预算", "备选路径"],
};

function getData() {
  return Object.fromEntries(new FormData(form).entries());
}

function fillForm(data) {
  Object.entries(data).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
  updateBadge();
}

function clean(value, fallback = "【待确认】") {
  return String(value || "").trim() || fallback;
}

const fieldGuides = {
  targetType: ["场次定位", "先选直播类型。它会影响默认关键词、资料包、判断维度和转化动作。", "不要选太泛；如果本场主推天赋产品，就选天赋志愿场。"],
  time: ["5W1H-When", "写清楚日期和时间，建议统一成“6月11日 14:00”。", "不要只写“周三下午”，后续排期和海报容易出错。"],
  topic: ["AIDA-注意 + 痛点标题法", "标题要包含用户场景、痛点或结果，例如“高考结束后第一步：孩子未来方向怎么判断？”。", "不要写成内部项目名；用户看不懂就不会停留。"],
  audience: ["5W1H-Who + 用户分层", "写1-2类核心用户，如“高考后学生家长”“分数未出但想提前做预案的家庭”。", "不要同时覆盖所有人群，直播主线会散。"],
  guest: ["5W1H-Who", "写姓名 + 身份 + 权威来源，如“彭威老师，遇见天赋项目负责人”。", "不要只写姓名；主持人口播需要身份背书。"],
  goal: ["目标总览", "用一句话概括品牌、内容、促销三层目的。下面四个目标会再拆细。", "不要只写“提升转化”，要说明推什么、为什么推。"],
  brandGoal: ["SMART + 品牌认知", "写“通过什么直播，强化用户对UKEC什么能力的认知，目标数据是什么”。", "不要写空泛的“提升品牌影响力”。"],
  contentGoal: ["5W1H + 痛点解决", "写“让谁看完后理解什么问题，并知道下一步做什么”。", "不要只写“科普专业知识”，要写看完后的判断能力。"],
  marketingGoal: ["AIDA", "写“用什么痛点吸引注意，用什么资料/案例激发兴趣，用什么福利推动行动”。", "不要把营销目标写成最终成交，直播先推动关键词和咨询。"],
  conversionGoal: ["SMART + 行为路径", "写直播后24小时内的资料领取、有效咨询、评估预约目标。", "不要只写“促进转化”，要有数量和时间范围。"],
  pain: ["福格-动机", "写用户当下最焦虑的2-4个问题，最好来自评论区或顾问反馈。", "不要写机构想讲什么，要写用户真的担心什么。"],
  marketInsight: ["市场营销八大模块-市场洞察", "写用户所处阶段和真实焦虑：刚考完、等出分、填志愿、分数不理想。", "不要写宏观行业判断，重点是这场直播用户的当下处境。"],
  userSegment: ["市场营销八大模块-用户细分", "写本场只服务哪1-2类用户。", "不要把高分、中段、低分、家长、学生全部塞进同一场。"],
  productPosition: ["市场营销八大模块-产品定位", "写本场主推的产品或服务入口，如天赋志愿、1v1评估、本科路径规划。", "不要同时推太多产品，承接会乱。"],
  valueProp: ["市场营销八大模块-价值主张", "写用户为什么要听UKEC讲，而不是自己查资料。", "不要写机构口号，要写用户获得的具体价值。"],
  channelStrategy: ["市场营销八大模块-渠道策略", "写引流和承接渠道：视频号、社群、朋友圈、小助手、顾问私域。", "不要只写“线上推广”，要能分配给执行同事。"],
  caseEvidence: ["说服圆环-案例/证据", "写嘉宾可用的案例、数据、经验或流程。没有公开案例就写【待业务补充案例】。", "不要编造具体学生故事，避免后续合规和口径风险。"],
  hostQuestions: ["提问翻译器", "一行一个普通问题即可。系统会翻译成标准版、场景冲突版、金句版。抓耳版会自动补充用户场景、家长冲突和追问。", "不要自己写成长段口播；只写核心问题，系统负责翻译成直播间问法。"],
  keyword: ["福格-触发", "写一个用户容易打出来的词，如“天赋”“路径”“评估”。", "不要用太长或多个复杂关键词。"],
  leadMagnet: ["AIDA-兴趣", "写用户回复关键词后能拿到的具体资料包。", "不要写泛泛的“资料”，要有名称。"],
  lottery: ["福格-能力 + 触发", "写抽什么、怎么参与、什么时候抽。", "不要只写“抽奖待定”，执行同事无法口播。"],
  benefit: ["AIDA-欲望", "写直播间专属权益、名额、使用条件或待确认项。", "不要承诺未确认价格或签约权益。"],
  attentionHook: ["AIDA-Attention", "写一句能让用户停留的问题或标题。", "不要写内部卖点，要写用户第一眼关心的问题。"],
  interestHook: ["AIDA-Interest", "写用什么资料、案例或清单让用户愿意继续听。", "不要和福利混在一起，兴趣钩子主要负责资料领取。"],
  desireHook: ["AIDA-Desire", "写用户为什么觉得现在领取/咨询有价值。", "不要只说“限时福利”，要说明适合谁。"],
  actionHook: ["AIDA-Action", "写用户具体动作：回复哪个关键词、找谁、领取什么。", "不要出现多个互相冲突的CTA。"],
  foggMotivation: ["福格-动机", "写用户为什么现在就要行动。", "不要制造过度焦虑，要和高考后窗口期相关。"],
  foggAbility: ["福格-能力", "写如何降低行动门槛：不要求马上签约，只需回复关键词/预约评估。", "不要让第一步太重。"],
  foggTrigger: ["福格-触发", "写在哪些直播节点提醒：开场、Q3后、Q6后、结尾。", "不要只在结尾说，用户可能已经离开。"],
  reviewTargets: ["SMART-复盘指标", "写观看、互动、关键词、资料领取、有效咨询、评估预约的数量目标。", "不要只看观看人数，转化链路每一步都要复盘。"],
  next: ["5W1H-下一步", "写下一场时间 + 主题，用于结尾预约。", "不要只写“下一场待定”，会浪费结尾流量。"],
};

function initFieldGuides() {
  Object.entries(fieldGuides).forEach(([name, [model, guide, warning]]) => {
    const field = form.elements[name] || document.querySelector(`#${name}`);
    if (!field) return;
    const label = field.closest("label");
    if (!label || label.querySelector(".field-guide")) return;
    const meta = document.createElement("div");
    meta.className = "field-guide";
    meta.innerHTML = `<strong>${model}</strong><span>${guide}</span><em>${warning}</em>`;
    label.appendChild(meta);
  });
}

function getApiConfig() {
  try {
    return JSON.parse(localStorage.getItem(apiConfigKey) || "{}");
  } catch {
    return {};
  }
}

function saveApiConfig() {
  const provider = apiProviderInput.value;
  const apiKey = apiKeyInput.value.trim();
  const baseUrl = apiBaseUrlInput.value.trim();
  const model = apiModelInput.value.trim();
  if (!apiKey) return showToast("请先填写 API Key");
  if (!baseUrl) return showToast("请先填写 Base URL");
  if (!model) return showToast("请先填写模型");
  localStorage.setItem(apiConfigKey, JSON.stringify({ provider, apiKey, baseUrl, model }));
  updateApiConfigView();
  showToast("API配置已保存");
}

function clearApiConfig() {
  localStorage.removeItem(apiConfigKey);
  apiProviderInput.value = "openai";
  apiKeyInput.value = "";
  apiBaseUrlInput.value = providerPresets.openai.baseUrl;
  apiModelInput.value = providerPresets.openai.model;
  updateApiConfigView();
  showToast("API配置已清除");
}

function updateApiConfigView() {
  const config = getApiConfig();
  const provider = config.provider || "openai";
  const preset = providerPresets[provider] || providerPresets.openai;
  apiProviderInput.value = provider;
  apiKeyInput.value = config.apiKey || "";
  apiBaseUrlInput.value = config.baseUrl || preset.baseUrl;
  apiModelInput.value = config.model || preset.model;
  apiStatus.textContent = config.apiKey ? `已配置：${preset.label}` : "未配置";
}

function applyProviderPreset() {
  const preset = providerPresets[apiProviderInput.value] || providerPresets.custom;
  apiBaseUrlInput.value = preset.baseUrl;
  apiModelInput.value = preset.model;
}

function inferType(data) {
  if (data.targetType && data.targetType !== "auto") {
    return typeConfig.find((item) => item.name === data.targetType) || defaultType;
  }
  const haystack = `${data.topic || ""} ${data.goal || ""} ${data.pain || ""} ${data.keyword || ""} ${data.leadMagnet || ""}`;
  const ranked = typeConfig
    .map((item) => ({
      item,
      score: item.terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);
  return ranked[0].score > 0 ? ranked[0].item : defaultType;
}

function updateBadge() {
  const data = getData();
  const config = inferType(getData());
  typeBadge.textContent = data.targetType && data.targetType !== "auto" ? `已选择：${config.name}` : `自动识别：${config.name}`;
}

function guestName(guest) {
  const value = clean(guest, "嘉宾老师");
  return value.split(/[，,、\s]/).filter(Boolean)[0] || value;
}

function parseCustomQuestions(value) {
  return String(value || "")
    .split(/\n+/)
    .map((line) =>
      line
        .trim()
        .replace(/^[-*•\d\s.、)）]+/, "")
        .replace(/^Q\d+[:：\s]*/i, "")
        .trim(),
    )
    .filter(Boolean);
}

function buildQuestions(data, config) {
  const customQuestions = parseCustomQuestions(data.hostQuestions);
  const questionTypes = ["现状判断", "用户焦虑", "方法拆解", "路径选择", "避坑提醒", "案例说明", "行动建议"];
  if (customQuestions.length) {
    return customQuestions.map((question, index) => [`Q${index + 1}`, questionTypes[index] || "补充提问", question]);
  }

  const topic = clean(data.topic, "本场主题");
  const keyword = clean(data.keyword, config.keyword);
  return [
    ["Q1", "现状判断", `高考刚结束，现在就开始关注「${topic}」，会不会太早？`],
    ["Q2", "用户焦虑", `很多家长现在最纠结的是「${clean(data.pain, "孩子方向不清楚")}」，这个问题应该先从哪里判断？`],
    ["Q3", "方法拆解", `判断孩子适合什么方向，不能只看分数，那具体还要看哪些维度？`],
    ["Q4", "路径选择", `如果孩子现在没有明确想法，或者兴趣很多但不确定，家长应该怎么帮他缩小范围？`],
    ["Q5", "避坑提醒", `围绕${keyword}和专业选择，家长最容易踩哪些坑？`],
    ["Q6", "案例说明", `有没有真实案例可以参考，说明方向判断清楚后，后续规划会发生什么变化？`],
    ["Q7", "行动建议", `家长今天听完以后，今晚第一步最应该做什么？怎么判断要不要做一次1v1评估？`],
  ];
}

function buildAIPrompt(data, config) {
  const customQuestions = parseCustomQuestions(data.hostQuestions);
  return `
请为一场高考后升学规划直播生成“轻量化启动模板 2.0”。

核心逻辑：一张启动表 + 四个模型翻译器。每个需要填写的位置，都必须标明使用模型和产出要求。

必须严格输出 Markdown，并保持以下模块标题：

# 【直播主题】轻量化启动模板 2.0
## 1. 单场直播启动表 2.0
## 2. 活动目的填写器
## 3. 整体思路填写器
## 4. 主持人提问翻译器
## 5. 嘉宾回答填写器：说服圆环
## 6. PPT轻量版结构：观点-证据-行动
## 7. 促销&钩子填写器
## 8. 主持人口播模块
## 9. 朋友圈转发话术
## 10. 小助手承接话术
## 11. 复盘指标
## 12. 待业务确认事项

要求：
- 不写长篇完整策划案。
- 不写完整逐字稿。
- 单场直播启动表必须包含：基础信息、活动目的、内容设计、主持人提问、嘉宾回答、PPT文稿、促销&钩子、复盘指标。
- 活动目的必须用 SMART 拆成品牌目标、内容目标、营销目标、转化目标、业务目标。
- 整体思路必须用市场营销八大模块 + 福格行为模型。
- 主持人提问必须优先使用用户填写的问题，并为每个问题输出标准版、抓耳版、金句版。
- 抓耳版必须是“具体场景 + 用户冲突 + 追问”的直播间口播问题，不能只是短句改写。示例：用户原始问题“高考刚结束，分数还没出来，现在就看专业方向会不会太早？”应翻译成“高考刚结束，很多孩子只想先好好睡一觉，但家长已经开始查专业、看学校、问升学路径了。问题是，分数还没出来，现在看专业方向，到底是太早、太焦虑，还是恰恰应该趁这几天先把方向想清楚？”
- 嘉宾答题卡必须按说服圆环输出：共情痛点、核心结论、判断标准、案例/证据、行动建议、关键词。
- 案例不足时写【待业务补充案例】，不要编造具体学生故事。
- PPT控制在5页，按观点-证据-行动模型输出。
- 促销&钩子必须用 AIDA + 福格行为模型。
- 复盘指标必须用 SMART，包含观看、互动、关键词、资料领取、有效咨询、评估预约。
- 必须生成 3 轮朋友圈转发话术：开场转发、中段抽奖转发、结尾福利转发。每条 100 字以内，必须结合直播主题、资料钩子、抽奖机制或直播间福利，适合直播中引导团队转发朋友圈。
- 必须输出“模型-板块对应表”，说明每个实际使用板块对应哪个模型、使用哪些填写项、为什么用这个模型。
- 每个填写项都要给具体填写引导，避免执行同事凭感觉填写。
- 转化链路固定为：评论区关键词 → 小助手 → 资料领取 → 1v1评估 → 顾问承接。
- 话术要口语化，有直播间承接感，但不要过度销售。

本场信息：
- 目标场次：${config.name}
- 直播时间：${clean(data.time)}
- 直播主题：${clean(data.topic)}
- 面向人群：${clean(data.audience)}
- 嘉宾姓名和身份：${clean(data.guest)}
- 本场核心目的：${clean(data.goal)}
- 品牌目标：${clean(data.brandGoal)}
- 内容目标：${clean(data.contentGoal)}
- 营销目标：${clean(data.marketingGoal)}
- 转化目标：${clean(data.conversionGoal)}
- 用户痛点：${clean(data.pain)}
- 市场洞察：${clean(data.marketInsight)}
- 用户细分：${clean(data.userSegment)}
- 产品定位：${clean(data.productPosition)}
- 价值主张：${clean(data.valueProp)}
- 渠道策略：${clean(data.channelStrategy)}
- 案例/证据素材：${clean(data.caseEvidence)}
- 主持人提问：${customQuestions.join(" / ") || "用户未填写，请按场次自动生成"}
- 主关键词：${clean(data.keyword, config.keyword)}
- 资料钩子：${clean(data.leadMagnet, config.lead)}
- 抽奖机制：${clean(data.lottery)}
- 直播间福利：${clean(data.benefit)}
- AIDA Attention：${clean(data.attentionHook)}
- AIDA Interest：${clean(data.interestHook)}
- AIDA Desire：${clean(data.desireHook)}
- AIDA Action：${clean(data.actionHook)}
- 福格-动机：${clean(data.foggMotivation)}
- 福格-能力：${clean(data.foggAbility)}
- 福格-触发：${clean(data.foggTrigger)}
- 复盘目标：${clean(data.reviewTargets)}
- 下一场预告：${clean(data.next)}
`;
}

function extractResponseText(payload) {
  if (payload.choices?.[0]?.message?.content) return payload.choices[0].message.content.trim();
  if (payload.output_text) return payload.output_text;
  const chunks = [];
  (payload.output || []).forEach((item) => {
    (item.content || []).forEach((content) => {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
      if (content.type === "text" && content.text) chunks.push(content.text);
    });
  });
  return chunks.join("\n").trim();
}

function buildChatMessages(data, config) {
  return [
    {
      role: "system",
      content:
        "你是 UKEC 直播运营方案专家，擅长把高考后升学规划直播压缩成轻量、稳定、可执行的启动包。只输出 Markdown，不要输出解释。",
    },
    {
      role: "user",
      content: buildAIPrompt(data, config),
    },
  ];
}

function joinUrl(baseUrl, path) {
  return `${String(baseUrl || "").replace(/\/+$/, "")}${path}`;
}

function translateQuestion(question) {
  const raw = clean(question, "本场问题");
  const isMajor = /专业|方向|天赋/.test(raw);
  const isStudy = /留学|海外|本科|路径|Plan B|本预|直录|国际大一/.test(raw);
  const isScore = /分数|成绩|出分|高考/.test(raw);
  const isEnglish = /英语|雅思|语言/.test(raw);
  const isParent = /家长|现在|做什么|准备|预案/.test(raw);
  const isTooEarly = /早|来得及|晚/.test(raw);
  const isMismatch = /不一致|听谁|分歧|意见/.test(raw);
  const isPitfall = /坑|误区|热门|避坑/.test(raw);
  const isCase = /案例|真实|参考/.test(raw);
  const standard = raw.endsWith("？") || raw.endsWith("?") ? raw : `${raw}？`;
  let catchy = `很多家长其实不是没有问题，而是问题太多：孩子还没想清楚，家长已经开始查资料、问学校、看路径了。那回到今天这个问题，${standard}这到底是可以先等等，还是现在就应该先判断清楚？`;
  let golden = "先评估，再决定";

  if (isMajor && isTooEarly) {
    catchy =
      "高考刚结束，很多孩子只想先好好睡一觉，但家长已经开始查专业、看学校、问升学路径了。问题是，分数还没出来，现在看专业方向，到底是太早、太焦虑，还是恰恰应该趁这几天先把方向想清楚？";
    golden = "选专业不是追热门，是找匹配";
  } else if (isMajor && isMismatch) {
    catchy =
      "很多家庭一聊专业就容易吵起来：孩子说想按兴趣选，家长担心就业和稳定；孩子觉得家长不懂自己，家长又怕孩子一时冲动。那这种时候，专业方向到底应该听孩子的、听家长的，还是应该先用一套标准把双方拉回同一张桌子上？";
    golden = "意见不一致时，先回到判断标准";
  } else if (isMajor && isPitfall) {
    catchy =
      "每年高考后，很多家长第一反应都是去查热门专业、就业排行、薪资榜单，好像选到热门就安全了。但问题是，热门专业真的等于适合孩子吗？如果只看热度，最容易在哪一步把孩子带偏？";
    golden = "热门只能参考，匹配才是答案";
  } else if (isMajor) {
    catchy =
      "很多孩子不是没有未来方向，而是还没被好好拆开看：他喜欢什么、擅长什么、适合什么学习方式、未来能走到哪里。那家长到底应该怎么判断孩子适合学什么，而不是一上来就被热门专业牵着走？";
    golden = "选专业不是追热门，是找匹配";
  } else if (isStudy) {
    catchy =
      "高考已经结束了，有些家庭才突然发现，国内志愿不是唯一选择，海外本科也可能是一条路。但家长最担心的是：现在才开始了解留学，会不会已经太晚？还有没有来得及准备的路径？";
    golden = "真正晚的不是现在才开始，而是一直不评估";
  } else if (isScore) {
    catchy =
      "分数没出来的时候，家长焦虑；分数出来以后，很多家庭反而更焦虑。高了怕浪费，低了怕没路走。那高考分数在后续升学判断里，到底应该怎么用？高了怎么用，低了又该怎么办？";
    golden = "分数不是终点，是路径判断的起点";
  } else if (isEnglish) {
    catchy =
      "很多家长一想到留学，第一反应就是英语：雅思还没考、口语也一般、孩子平时英语成绩不算突出。那这种情况下，现在考虑海外本科到底现实吗？英语是不是一票否决的门槛？";
    golden = "英语不是门槛的全部，路径才是关键";
  } else if (isCase) {
    catchy =
      "很多家长听方法的时候会点头，但心里还是会想：这套判断放到真实孩子身上到底有没有用？有没有那种一开始方向很模糊，后来通过评估和规划逐渐变清楚的案例，可以让我们对照一下？";
    golden = "案例不是故事，是判断方法的落地";
  } else if (isParent) {
    catchy =
      "分数还没出来，很多家长表面上是在等，实际上已经很难安心等了：怕错过信息、怕准备太晚、又怕现在做太多变成无效焦虑。那这个阶段家长到底能做什么，哪些事值得先做，哪些事反而不用急？";
    golden = "先做预案，别等分数逼你做决定";
  }

  return { raw, standard, catchy, golden };
}

function buildQuestionTranslations(questions) {
  return questions.map((question) => {
    const translated = translateQuestion(question[2]);
    return [question[0], translated.raw, translated.standard, translated.catchy, translated.golden];
  });
}

function trimCopy(text, limit = 100) {
  const value = String(text || "").replace(/\s+/g, "");
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

function buildMomentsCopy(data, config) {
  const topic = clean(data.topic, "高考后升学规划直播");
  const keyword = clean(data.keyword, config.keyword);
  const lead = clean(data.leadMagnet, config.lead);
  const lottery = clean(data.lottery, "直播间抽奖");
  const benefit = clean(data.benefit, "直播间专属福利");
  return [
    [
      "第1轮：开场转发",
      "开播前/开场3分钟内",
      trimCopy(`正在直播：${topic}。适合高考后还在纠结专业、志愿和路径的家长，进直播间回复【${keyword}】可领${lead}。`),
    ],
    [
      "第2轮：中段抽奖转发",
      "Q2-Q4后",
      trimCopy(`直播进行中：${topic}。今晚有${lottery}，也会讲孩子方向怎么判断。转给身边高考后家庭，一起进来听。`),
    ],
    [
      "第3轮：福利转发",
      "Q6后/结尾前",
      trimCopy(`最后一轮提醒：${topic}直播间还有${benefit}。家里正在纠结专业方向或升学路径的，可以进来回复【评估】。`),
    ],
  ];
}

function buildAnswerCards(data, config, questions) {
  const guest = clean(data.guest, "嘉宾老师【待确认】");
  const lead = clean(data.leadMagnet, config.lead);
  const keyword = clean(data.keyword, config.keyword);
  const dimensions = config.dimensions.join("、");
  const evidence = clean(
    data.caseEvidence,
    "【待业务补充案例】建议补充1个可公开学生案例，包含原始困惑、评估发现、方向调整和后续路径建议。",
  );
  return questions.map((question, index) => [
    question[0],
    guest,
    "这个问题很多家长都会担心，尤其是高考刚结束，大家会觉得现在信息太多、时间太紧，不知道该先抓哪一步。",
    index === 0 ? "结论是：现在就应该开始判断，但不需要马上拍板。" : "结论是：先做结构化评估，再进入具体选择。",
    `建议至少看${dimensions}；不要只看单一分数、热门趋势或亲友建议。`,
    evidence,
    `评论区回复【${keyword}】领取${lead}；如果情况不确定，回复【评估】预约1v1判断。`,
    keyword,
  ]);
}

function table(headers, rows) {
  return `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function mdTable(headers, rows) {
  const line = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell).replaceAll("\n", "<br>").replaceAll("|", "｜")).join(" | ")} |`);
  return [line, sep, ...body].join("\n");
}

function htmlToPlain(value) {
  return String(value).replaceAll("<br>", "\n").replace(/<[^>]+>/g, "");
}

function generate(data) {
  const config = inferType(data);
  const topic = clean(data.topic, "【直播主题待确认】");
  const time = clean(data.time);
  const audience = clean(data.audience, "高考后家长/学生【待确认】");
  const guest = clean(data.guest, "嘉宾【待确认】");
  const hostGuest = guestName(data.guest);
  const goal = clean(data.goal, "品牌层：建立 UKEC 专业信赖；内容层：讲清本场核心问题；促销层：引导1v1评估和产品承接");
  const pain = clean(data.pain, "用户当前痛点【待确认】");
  const keyword = clean(data.keyword, config.keyword);
  const lead = clean(data.leadMagnet, config.lead);
  const lottery = clean(data.lottery, "本场抽奖机制【待确认】");
  const benefit = clean(data.benefit, "直播间专属福利【待确认】");
  const next = clean(data.next, "下一场直播时间和主题【待确认】");
  const questions = buildQuestions(data, config);
  const translations = buildQuestionTranslations(questions);
  const cards = buildAnswerCards(data, config, questions);
  const brandGoal = clean(data.brandGoal, `通过【${topic}】强化用户对 UKEC 高考后升学规划能力的认知，建议设置观看、互动和停留目标。`);
  const contentGoal = clean(data.contentGoal, `让${audience}看完后，能理解【${topic}】的核心判断逻辑，并知道下一步可以回复【${keyword}】领取资料或预约评估。`);
  const marketingGoal = clean(data.marketingGoal, `用【${lead}】吸引回复关键词，用案例增强信任，用【${benefit}】推动私域承接。`);
  const conversionGoal = clean(data.conversionGoal, "建议设置直播后24小时内资料领取、有效咨询和1v1评估预约目标。");
  const marketInsight = clean(data.marketInsight, "高考后家庭处在等待出分和志愿预案阶段，焦虑集中在专业方向、分数使用和升学路径选择。");
  const userSegment = clean(data.userSegment, audience);
  const productPosition = clean(data.productPosition, `${config.action} / ${benefit}`);
  const valueProp = clean(data.valueProp, "UKEC帮助家庭降低信息差，先评估、再决定，把孩子特点和路径选择放在一起判断。");
  const channelStrategy = clean(data.channelStrategy, "视频号、社群、朋友圈、小助手、顾问私域");
  const caseEvidence = clean(data.caseEvidence, "【待业务补充案例】建议准备1-2个可公开学生案例。");
  const attentionHook = clean(data.attentionHook, topic);
  const interestHook = clean(data.interestHook, lead);
  const desireHook = clean(data.desireHook, benefit);
  const actionHook = clean(data.actionHook, `评论区回复【${keyword}】领取资料，回复【评估】预约1v1判断。`);
  const foggMotivation = clean(data.foggMotivation, "高考后窗口期短，越早评估，出分后越不容易被动。");
  const foggAbility = clean(data.foggAbility, "不要求用户马上签约，只需要回复关键词领取资料或预约评估。");
  const foggTrigger = clean(data.foggTrigger, "开场、Q3后、Q6后、结尾集中提醒。");
  const reviewTargets = clean(data.reviewTargets, "观看、互动、关键词回复、资料领取、有效咨询、1v1预约均需设置同一组复盘指标。");
  const momentsRows = buildMomentsCopy(data, config);
  const pptRows = [
    ["1", "观点", `封面：${topic}<br>证据：嘉宾身份 ${guest}<br>行动：明确本场适合${audience}`],
    ["2", "观点", `今天解决的问题：${questions.map((q) => q[2]).join("<br>")}<br>行动：引导评论区说出当前困惑`],
    ["3", "观点", `核心判断表：${config.dimensions.join(" / ")}<br>行动：回复【${keyword}】领取${lead}`],
    ["4", "证据", "案例/误区清单：热门不等于适合；分数不等于方向；家长判断不等于孩子适配<br>行动：引导用户对照自家孩子情况"],
    ["5", "行动", `关键词福利页：回复【${keyword}】领取${lead}；回复【评估】预约${benefit}；抽奖：${lottery}；下一场：${next}`],
  ];
  const startRows = [
    ["基础信息", "直播主题、时间、人群、嘉宾、形式", "5W1H", `主题：${topic}<br>时间：${time}<br>人群：${audience}<br>嘉宾：${guest}<br>形式：1主持人 + 1位嘉宾，45-60分钟`],
    ["活动目的", "品牌目标、内容目标、营销目标、转化目标", "SMART + 市场营销八大模块", `品牌：${brandGoal}<br>内容：${contentGoal}<br>营销：${marketingGoal}<br>转化：${conversionGoal}`],
    ["内容设计", "用户痛点、核心问题、直播主线", "福格行为模型 + 5W1H", `痛点：${pain.replaceAll("\n", "<br>")}<br>主线：先接住焦虑，再给判断模型，最后导向资料和评估`],
    ["主持人提问", "5-7个主持人问题", "提问翻译器", "每个问题输出标准版、场景冲突版、金句版，分别用于策划案、口播和切片传播"],
    ["嘉宾回答", "每个问题的回答框架", "说服圆环", "每题按共情痛点、核心结论、判断标准、案例证据、行动建议、关键词输出"],
    ["PPT文稿", "PPT结构、主持人串词、嘉宾答题卡", "观点-证据-行动模型", "每页一个观点，每个问题最后都有动作"],
    ["促销&钩子", "关键词、资料包、抽奖、直播间福利", "福格行为模型 + AIDA", `关键词：${keyword}<br>资料：${lead}<br>抽奖：${lottery}<br>福利：${benefit}`],
    ["复盘指标", "观看、互动、关键词、资料领取、咨询、评估预约", "SMART", reviewTargets],
  ];
  const objectiveRows = [
    ["品牌目标", "SMART + 品牌认知", `通过【${topic}】强化用户对 UKEC【高考后升学规划 / ${config.name}】的认知`, brandGoal],
    ["内容目标", "5W1H + 痛点解决", `让【${audience}】看完后理解【${topic}】，并知道下一步动作`, contentGoal],
    ["营销目标", "AIDA", `用【${attentionHook}】吸引注意，用【${lead}】激发兴趣，用【${benefit}】推动行动`, marketingGoal],
    ["转化目标", "SMART + 行为路径", "在直播后24小时内沉淀资料领取、有效咨询、评估预约", conversionGoal],
    ["业务目标", "市场营销八大模块", "围绕产品、用户、渠道、促销、转化链路完成承接", `通过直播将高考后家庭从内容观看引导至${config.action}`],
  ];
  const strategyRows = [
    ["市场洞察", "高考后家庭正在经历什么焦虑", marketInsight],
    ["用户细分", "本场只服务1-2类核心用户", userSegment],
    ["产品定位", "本场要推什么产品或服务", productPosition],
    ["价值主张", "用户为什么要听 UKEC 讲", valueProp],
    ["内容策略", "用什么内容承接用户痛点", `5-7个问题、案例、${config.dimensions.join("、")}判断表、避坑清单`],
    ["渠道策略", "从哪里引流和承接", channelStrategy],
    ["促销策略", "用什么促进行动", `${lead}、${lottery}、${benefit}`],
    ["转化链路", "看完之后怎么进入咨询", `评论区回复【${keyword}】 → 小助手 → 资料领取 → 1v1评估 → 顾问跟进`],
  ];
  const modelMapRows = [
    ["基础信息", "5W1H", "直播主题、时间、人群、嘉宾、形式", "确保执行同事知道谁来看、为什么看、看完做什么"],
    ["活动目的", "SMART + 品牌/内容/营销/转化", "品牌目标、内容目标、营销目标、转化目标", "避免空泛目标，方便复盘"],
    ["内容设计", "市场营销八大模块 + 福格行为模型", "市场洞察、用户细分、产品定位、价值主张、渠道策略", "让内容主线和转化链路闭环"],
    ["主持人提问", "提问翻译器", "主持人问题", "把普通业务问题变成标准版、场景冲突版、金句版"],
    ["嘉宾回答", "说服圆环", "案例/证据素材 + 嘉宾答题卡", "让嘉宾回答有共情、结论、证据和行动"],
    ["PPT文稿", "观点-证据-行动", "PPT轻量版结构", "每页一个观点，每页都有下一步动作"],
    ["促销&钩子", "AIDA + 福格行为模型", "关键词、资料、抽奖、福利、AIDA四项、福格三项", "降低行动门槛并完成即时触发"],
    ["复盘指标", "SMART", "观看、互动、关键词、资料领取、咨询、评估预约", "让每场直播可以用同一组指标复盘"],
  ];
  const foggRows = [
    ["动机", "讲用户最焦虑的问题", foggMotivation],
    ["能力", "降低行动门槛", foggAbility],
    ["触发", "明确告诉用户现在做什么", foggTrigger],
  ];
  const promoRows = [
    ["Attention 注意", "用什么标题/问题吸引用户停留", attentionHook],
    ["Interest 兴趣", "用什么资料让用户愿意回复关键词", interestHook],
    ["Desire 欲望", "用什么权益让用户觉得现在领取有价值", desireHook],
    ["Action 行动", "用户具体做什么", actionHook],
    ["福格-动机", "用户为什么现在要行动", foggMotivation],
    ["福格-能力", "行动是否足够简单", foggAbility],
    ["福格-触发", "什么时候提醒", foggTrigger],
  ];
  const reviewRows = [
    ["观看", "SMART", reviewTargets.includes("观看") ? reviewTargets : "建议填写观看人数目标"],
    ["互动", "SMART", reviewTargets.includes("评论") || reviewTargets.includes("互动") ? reviewTargets : "建议填写评论、转发、停留等互动目标"],
    ["关键词", "SMART", "统计【" + keyword + "】【评估】【福利】等关键词回复量"],
    ["资料领取", "SMART", `统计${lead}领取人数和后续回复率`],
    ["咨询", "SMART", "统计有效咨询数和顾问承接情况"],
    ["评估预约", "SMART", "统计1v1评估预约数、到场数和后续转化"],
  ];
  const confirmItems = [
    "抽奖奖品规格、数量和领取规则",
    "抽奖执行方式：评论抽取 / 后台抽取 / 小助手截图",
    "直播间福利的具体权益、名额门槛和截止时间",
    "本场产品权益、价格、优惠口径和承接负责人",
    "关键词是否统一，或同时使用【" + keyword + "】【评估】【福利】",
    "嘉宾可公开讲述的学生案例",
    "下一场直播是否需要预约链接或评论区关键词",
  ];

  const html = `
    <h1>${topic}轻量化启动模板 2.0</h1>
    <h2>1. 单场直播启动表 2.0</h2>
    ${table(["模块", "填写项", "使用模型", "产出要求"], startRows)}
    <h2>2. 模型-板块对应表</h2>
    ${table(["实际板块", "对应模型", "使用的填写项", "为什么用这个模型"], modelMapRows)}
    <h2>3. 活动目的填写器</h2>
    ${table(["目标类型", "使用模型", "填写公式", "本场填写"], objectiveRows)}
    <h2>4. 整体思路填写器</h2>
    ${table(["市场营销模块", "对应直播设计", "本场填写"], strategyRows)}
    <h3>福格行为模型</h3>
    ${table(["模型要素", "直播中怎么设计", "本场填写"], foggRows)}
    <h2>5. 主持人提问翻译器</h2>
    ${table(["顺序", "原始问题", "标准版", "抓耳版", "金句版"], translations)}
    <h2>6. 嘉宾回答填写器：说服圆环</h2>
    <p>本场案例/证据素材：${caseEvidence}</p>
    ${table(["问题", "主答嘉宾", "共情痛点", "核心结论", "判断标准", "案例/证据", "行动建议", "关键词"], cards)}
    <h2>7. PPT轻量版结构：观点-证据-行动</h2>
    ${table(["页码", "页面角色", "内容"], pptRows)}
    <h2>8. 促销&钩子填写器</h2>
    ${table(["模型", "填写项", "本场填写"], promoRows)}
    <h2>9. 主持人口播模块</h2>
    <h3>开场话术</h3>
    <p>大家好，欢迎来到 UKEC 高考后升学规划直播。今天这场主要适合${audience}来看，我们会重点解决一个问题：${topic}</p>
    <p>高考结束后，很多家庭现在还没到真正填志愿的时候，但已经开始纠结：${pain.replaceAll("\n", " ")}。所以今天我们请到${guest}，帮大家把这个问题拆清楚。想领取本场资料的，可以在评论区回复【${keyword}】，领取${lead}。今天直播间也有${benefit}，抽奖安排是：${lottery}。</p>
    <h3>提问串联话术</h3>
    <p>刚刚${hostGuest}讲到了一个很关键的点，就是不能只看分数，还要看孩子本身的特点。那我想继续追问一下，很多家长可能会说：孩子自己也不确定方向，这种情况下还能判断吗？这个问题能不能请${hostGuest}再具体讲一下？</p>
    <h3>钩子领取话术</h3>
    <p>刚刚这部分内容，其实很多高考后家庭都会遇到。我们也把它整理成了【${lead}】。大家可以在评论区回复【${keyword}】，小助手会把领取方式发给大家。如果你不确定孩子适合哪条路径，也可以顺便预约一次1v1评估。</p>
    <h3>抽奖话术</h3>
    <p>提醒一下大家，今天直播间的抽奖安排是：${lottery}。大家可以在评论区留言【${keyword}】或者直接留下你现在最纠结的问题，我们稍后会抽取。中奖后请及时联系小助手登记信息。</p>
    <h3>福利话术</h3>
    <p>今天直播间也有高考后专属福利：${benefit}。这个福利适合正在纠结专业方向、志愿选择、本科路径，或者家长和孩子意见不一致的家庭。想了解的家长可以在评论区回复【福利】或【评估】，小助手会帮大家登记。</p>
    <h3>结尾话术</h3>
    <p>今天这场直播，我们不是让大家马上做决定，而是先把【${topic}】这个问题看清楚。高考后这个阶段，最重要的是先判断孩子有哪些路径，适合什么方向，接下来哪一步最急。</p>
    <p>想领取资料的，可以继续回复【${keyword}】。想让老师帮你做一次1v1判断的，可以回复【评估】。想了解直播间专属福利的，可以回复【福利】。我们下一场直播是：${next}，也欢迎大家预约观看。</p>
    <h2>10. 朋友圈转发话术</h2>
    ${table(["轮次", "建议使用时机", "100字以内话术"], momentsRows)}
    <h2>11. 小助手承接话术</h2>
    <h3>关键词【${keyword}】资料领取</h3>
    <p>收到～这是本场直播提到的【${lead}】。</p>
    <p>为了方便老师给你匹配更适合的方案，可以先补充这几个信息：<br>1. 学生是今年高考生吗？<br>2. 预计分数区间大概是多少？<br>3. 英语基础怎么样？<br>4. 目前更关注专业方向、国内志愿，还是海外本科路径？<br>5. 是否需要老师帮你做一次1v1评估？</p>
    <p>补充后我们可以安排老师对接。</p>
    <h3>评估承接</h3>
    <p>可以的，这类情况建议先做一次1v1评估。评估不是让你马上做决定，主要是帮你把孩子的成绩、英语、预算、专业方向和可选路径放在一起看清楚。看完之后，再判断适合哪条升学路径。我这边先帮你登记，后续会有老师联系你。</p>
    <h3>福利承接</h3>
    <p>本场直播间专属福利为【${benefit}】。适合正在纠结专业方向、志愿选择、高考后路径规划，或者家长和孩子意见不一致的家庭。具体名额和使用规则以老师确认结果为准。你可以先补充一下学生情况，我帮你看看是否适用。</p>
    <h3>抽奖中奖承接</h3>
    <p>恭喜你获得本场直播抽奖福利。请补充姓名、联系方式和领取信息，我们会安排后续登记。也可以顺便告诉我学生目前的高考情况，老师可以一起帮你看看后续方向。</p>
    <h2>12. 复盘指标</h2>
    ${table(["指标", "使用模型", "本场复盘口径"], reviewRows)}
    <h2>13. 待业务确认事项</h2>
    <ul>${confirmItems.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;

  const markdown = [
    `# ${topic}轻量化启动模板 2.0`,
    "## 1. 单场直播启动表 2.0",
    mdTable(["模块", "填写项", "使用模型", "产出要求"], startRows.map((row) => row.map(htmlToPlain))),
    "## 2. 模型-板块对应表",
    mdTable(["实际板块", "对应模型", "使用的填写项", "为什么用这个模型"], modelMapRows),
    "## 3. 活动目的填写器",
    mdTable(["目标类型", "使用模型", "填写公式", "本场填写"], objectiveRows),
    "## 4. 整体思路填写器",
    mdTable(["市场营销模块", "对应直播设计", "本场填写"], strategyRows),
    "### 福格行为模型",
    mdTable(["模型要素", "直播中怎么设计", "本场填写"], foggRows),
    "## 5. 主持人提问翻译器",
    mdTable(["顺序", "原始问题", "标准版", "抓耳版", "金句版"], translations),
    "## 6. 嘉宾回答填写器：说服圆环",
    `本场案例/证据素材：${caseEvidence}`,
    mdTable(["问题", "主答嘉宾", "共情痛点", "核心结论", "判断标准", "案例/证据", "行动建议", "关键词"], cards),
    "## 7. PPT轻量版结构：观点-证据-行动",
    mdTable(["页码", "页面角色", "内容"], pptRows.map((row) => row.map(htmlToPlain))),
    "## 8. 促销&钩子填写器",
    mdTable(["模型", "填写项", "本场填写"], promoRows),
    "## 9. 主持人口播模块",
    "### 开场话术",
    `大家好，欢迎来到 UKEC 高考后升学规划直播。今天这场主要适合${audience}来看，我们会重点解决一个问题：${topic}`,
    `高考结束后，很多家庭现在还没到真正填志愿的时候，但已经开始纠结：${pain.replaceAll("\n", " ")}。所以今天我们请到${guest}，帮大家把这个问题拆清楚。想领取本场资料的，可以在评论区回复【${keyword}】，领取${lead}。今天直播间也有${benefit}，抽奖安排是：${lottery}。`,
    "### 提问串联话术",
    `刚刚${hostGuest}讲到了一个很关键的点，就是不能只看分数，还要看孩子本身的特点。那我想继续追问一下，很多家长可能会说：孩子自己也不确定方向，这种情况下还能判断吗？这个问题能不能请${hostGuest}再具体讲一下？`,
    "### 钩子领取话术",
    `刚刚这部分内容，其实很多高考后家庭都会遇到。我们也把它整理成了【${lead}】。大家可以在评论区回复【${keyword}】，小助手会把领取方式发给大家。如果你不确定孩子适合哪条路径，也可以顺便预约一次1v1评估。`,
    "### 抽奖话术",
    `提醒一下大家，今天直播间的抽奖安排是：${lottery}。大家可以在评论区留言【${keyword}】或者直接留下你现在最纠结的问题，我们稍后会抽取。中奖后请及时联系小助手登记信息。`,
    "### 福利话术",
    `今天直播间也有高考后专属福利：${benefit}。这个福利适合正在纠结专业方向、志愿选择、本科路径，或者家长和孩子意见不一致的家庭。想了解的家长可以在评论区回复【福利】或【评估】，小助手会帮大家登记。`,
    "### 结尾话术",
    `今天这场直播，我们不是让大家马上做决定，而是先把【${topic}】这个问题看清楚。高考后这个阶段，最重要的是先判断孩子有哪些路径，适合什么方向，接下来哪一步最急。`,
    `想领取资料的，可以继续回复【${keyword}】。想让老师帮你做一次1v1判断的，可以回复【评估】。想了解直播间专属福利的，可以回复【福利】。我们下一场直播是：${next}，也欢迎大家预约观看。`,
    "## 10. 朋友圈转发话术",
    mdTable(["轮次", "建议使用时机", "100字以内话术"], momentsRows),
    "## 11. 小助手承接话术",
    `### 关键词【${keyword}】资料领取`,
    `收到～这是本场直播提到的【${lead}】。\n\n为了方便老师给你匹配更适合的方案，可以先补充这几个信息：\n\n1. 学生是今年高考生吗？\n2. 预计分数区间大概是多少？\n3. 英语基础怎么样？\n4. 目前更关注专业方向、国内志愿，还是海外本科路径？\n5. 是否需要老师帮你做一次1v1评估？\n\n补充后我们可以安排老师对接。`,
    "### 评估承接",
    "可以的，这类情况建议先做一次1v1评估。评估不是让你马上做决定，主要是帮你把孩子的成绩、英语、预算、专业方向和可选路径放在一起看清楚。看完之后，再判断适合哪条升学路径。我这边先帮你登记，后续会有老师联系你。",
    "### 福利承接",
    `本场直播间专属福利为【${benefit}】。适合正在纠结专业方向、志愿选择、高考后路径规划，或者家长和孩子意见不一致的家庭。具体名额和使用规则以老师确认结果为准。你可以先补充一下学生情况，我帮你看看是否适用。`,
    "### 抽奖中奖承接",
    "恭喜你获得本场直播抽奖福利。请补充姓名、联系方式和领取信息，我们会安排后续登记。也可以顺便告诉我学生目前的高考情况，老师可以一起帮你看看后续方向。",
    "## 12. 复盘指标",
    mdTable(["指标", "使用模型", "本场复盘口径"], reviewRows),
    "## 13. 待业务确认事项",
    confirmItems.map((item) => `- ${item}`).join("\n"),
  ].join("\n\n");

  return { html, markdown, config };
}

function saveHistory(data, markdown) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    topic: clean(data.topic, "未命名场次"),
    time: clean(data.time, "时间待确认"),
    data,
    markdown,
  });
  localStorage.setItem(storageKey, JSON.stringify(history.slice(0, 8)));
  renderHistory();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  if (!history.length) {
    historyList.innerHTML = '<p class="muted">还没有历史场次。</p>';
    return;
  }
  historyList.innerHTML = history
    .map(
      (item) => `
      <div class="history-item">
        <strong title="${item.topic}">${item.topic}</strong>
        <span>${item.time}</span>
        <div class="history-buttons">
          <button class="secondary compact" type="button" data-load="${item.id}">复用</button>
          <button class="secondary compact" type="button" data-copy="${item.id}">复制</button>
        </div>
      </div>
    `,
    )
    .join("");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").split("\n");
  const html = [];
  let paragraph = [];
  let list = [];
  let tableBuffer = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${paragraph.map(escapeHtml).join("<br>")}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  const flushTable = () => {
    if (!tableBuffer.length) return;
    const rows = tableBuffer
      .filter((line) => !/^\|\s*-+/.test(line))
      .map((line) =>
        line
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim()),
      );
    if (rows.length) {
      const [head, ...body] = rows;
      html.push(
        `<table><thead><tr>${head.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead><tbody>${body
          .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell).replaceAll("&lt;br&gt;", "<br>")}</td>`).join("")}</tr>`)
          .join("")}</tbody></table>`,
      );
    }
    tableBuffer = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (line.startsWith("|") && line.endsWith("|")) {
      flushParagraph();
      flushList();
      tableBuffer.push(line);
      return;
    }
    flushTable();
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      html.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
      return;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      return;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, ""));
      return;
    }
    paragraph.push(line);
  });

  flushTable();
  flushParagraph();
  flushList();
  return html.join("");
}

async function copyText(text) {
  if (!text) return showToast("请先生成方案");
  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast("已复制");
  }
}

function renderPlan(data, plan) {
  result.innerHTML = plan.html;
  latestMarkdown = plan.markdown;
  latestData = data;
  result.hidden = false;
  emptyState.hidden = true;
  typeBadge.textContent = data.targetType && data.targetType !== "auto" ? `已选择：${plan.config.name}` : `自动识别：${plan.config.name}`;
  saveHistory(data, latestMarkdown);
}

async function generateWithAI() {
  const data = getData();
  const config = inferType(data);
  const apiConfig = getApiConfig();
  generateAIButton.disabled = true;
  generateAIButton.textContent = "AI生成中";
  try {
    let markdown = "";
    if (apiConfig.apiKey) {
      const response = await fetch(joinUrl(apiConfig.baseUrl, "/chat/completions"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages: buildChatMessages(data, config),
          temperature: 0.7,
          max_tokens: 6000,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || payload.error || "AI生成失败");
      markdown = extractResponseText(payload);
    } else {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, type: config.name }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "AI生成失败");
      markdown = payload.markdown;
    }
    if (!markdown) throw new Error("AI没有返回可用内容");
    renderPlan(data, {
      markdown,
      html: markdownToHtml(markdown),
      config,
    });
    showToast("AI方案已生成");
  } catch (error) {
    showToast(error.message || "AI生成失败，请检查 API 配置");
  } finally {
    generateAIButton.disabled = false;
    generateAIButton.textContent = "AI生成";
  }
}

async function downloadPpt() {
  if (!latestMarkdown || !latestData) return showToast("请先生成方案");
  downloadPptButton.disabled = true;
  downloadPptButton.textContent = "生成中";
  try {
    const response = await fetch("/api/ppt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: latestData, markdown: latestMarkdown }),
    });
    if (!response.ok) {
      let message = "PPT生成失败";
      try {
        const payload = await response.json();
        message = payload.error || message;
      } catch {}
      throw new Error(message);
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${clean(latestData.topic, "直播轻量化启动方案").replace(/[\\/:*?"<>|]/g, "-")}.pptx`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("PPT已生成");
  } catch (error) {
    showToast(error.message || "PPT生成失败，请确认后端已启动");
  } finally {
    downloadPptButton.disabled = false;
    downloadPptButton.textContent = "生成 PPT";
  }
}

form.addEventListener("input", updateBadge);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getData();
  const plan = generate(data);
  renderPlan(data, plan);
});

document.querySelector("#loadSample").addEventListener("click", () => fillForm(sample));
document.querySelector("#clearForm").addEventListener("click", () => {
  form.reset();
  updateBadge();
});
document.querySelector("#copyMarkdown").addEventListener("click", () => copyText(latestMarkdown));
generateAIButton.addEventListener("click", generateWithAI);
downloadPptButton.addEventListener("click", downloadPpt);
apiProviderInput.addEventListener("change", applyProviderPreset);
saveApiConfigButton.addEventListener("click", saveApiConfig);
clearApiConfigButton.addEventListener("click", clearApiConfig);
document.querySelector("#printPlan").addEventListener("click", () => window.print());
document.querySelector("#downloadMarkdown").addEventListener("click", () => {
  if (!latestMarkdown) return showToast("请先生成方案");
  const blob = new Blob([latestMarkdown], { type: "text/markdown;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "直播轻量化启动方案.md";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.querySelector("#reuseLast").addEventListener("click", () => {
  const [last] = getHistory();
  if (!last) return showToast("还没有上一场");
  fillForm(last.data);
  showToast("已填入上一场");
});

document.querySelector("#clearHistory").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  renderHistory();
  showToast("历史已清除");
});

historyList.addEventListener("click", (event) => {
  const loadId = event.target.dataset.load;
  const copyId = event.target.dataset.copy;
  if (!loadId && !copyId) return;
  const item = getHistory().find((entry) => String(entry.id) === String(loadId || copyId));
  if (!item) return;
  if (loadId) {
    fillForm(item.data);
    showToast("已填入历史场次");
  }
  if (copyId) copyText(item.markdown);
});

fillForm(sample);
updateApiConfigView();
initFieldGuides();
renderHistory();
