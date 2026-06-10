/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates user's comment content against:
 * 1. Code injections & script hacks (e.g., windows & popup triggers, iframe tags, script blocks)
 * 2. URL links & websites
 * 3. Email addresses
 * 4. Contact phone numbers & mobile numbers
 * 5. Sensitive/illegal words (porn, blood, violence, abuse, illegal actions)
 */
export function validateCommentContent(text: string): ValidationResult {
  const trimmedText = text.trim();

  // 1. Check for Code/Script/XSS vulnerabilities & popups
  // Matches alert(), confirm(), prompt(), <script>, onload/onerror/onclick, javascript:, window.x, iframe elements, srcdoc, etc.
  const xssPattern = /(<script\b[^>]*>|onload\s*=|onerror\s*=|alert\s*\(|confirm\s*\(|prompt\s*\(|eval\s*\(|javascript\s*:|<iframe\b|srcdoc\s*=|<embed|window\s*\.|\.location\s*=)/i;
  if (xssPattern.test(trimmedText)) {
    return {
      isValid: false,
      message: "检测到不安全的脚本或代码/漏洞注入风险（例如弹窗/脚本跳转等）。为了系统安全，请精简特殊代码指令，使用纯文本留言。"
    };
  }

  // 2. Check for website/URL links
  // Matches http://, https://, www., or standard domains ending with .com, .cn, etc.
  const urlPattern = /(https?:\/\/[^\s]+|www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9][-a-zA-Z0-9]{0,62}\.(com|cn|net|org|edu|gov|mil|co|io|me|info|biz|cc|tv)\b)/i;
  if (urlPattern.test(trimmedText)) {
    return {
      isValid: false,
      message: "为了维护干净的交流空气、预防垃圾广告推广，留言区域不允许包含网站网址或超链接。"
    };
  }

  // 3. Check for email addresses
  // Matches email address patterns.
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  if (emailPattern.test(trimmedText)) {
    return {
      isValid: false,
      message: "为了维护您的隐私安全，留言中不允许包含电子邮箱地址。"
    };
  }

  // 4. Check for phone numbers
  // Matches common landline or mobile formats, e.g. 11 digit Chinese mobiles starting with 13-19 and common separated formats.
  const phonePattern = /(?:\+?86)?[- ]?1[3-9]\d{9}\b|\b\d{3,4}[- ]?\d{7,8}\b/;
  if (phonePattern.test(trimmedText)) {
    return {
      isValid: false,
      message: "为了维护您的个人隐私与安全，留言中不允许夹带电话号码或手机号码信息。"
    };
  }

  // 5. Check for pornography, violence, blood, drug abuse and vulgar profanities
  const abusePattern = /(色情|裸聊|成人视频|黄卡|爆乳|强奸|轮奸|杀人|群殴|血腥|碎尸|自残|毒品|吸毒|贩毒|海洛因|冰毒|大麻|自杀|砍死|处决|虐待|傻逼|操你妈|婊子|贱货|死全家|支那|脑残)/i;
  if (abusePattern.test(trimmedText)) {
    return {
      isValid: false,
      message: "检测到留言内容存在涉嫌违禁敏感词汇（涉及色情、暴力、血腥、毒品或极端辱骂），请您遵守社区文明条款，修正后再次尝试。"
    };
  }

  return { isValid: true, message: "" };
}
