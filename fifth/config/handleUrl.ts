const ajax = require('node-fetch');
const DomParser = require('dom-parser');
const Segment = require('segment');

const domParser = new DomParser();
const segment: any = new Segment();
segment.useDefault();

module.exports = async function handleUrl(url1: string, url2: string) {
  const [article1, article2] = await Promise.all([getArticle(url1), getArticle(url2)]);
  const segment1 = cutWords(article1);
  const segment2 = cutWords(article2);
  const segments = new Set([...segment1, ...segment2]);
  const tf1 = calcTf(article1, segments);
  const tf2 = calcTf(article2, segments);
  const similarity = calcSimilarity(Object.keys(tf1).map(k => tf1[k]), Object.keys(tf2).map(k => tf2[k]));
  return { article1, article2, tf1, tf2, similarity };
}

/**
 * 从目标URL获取文章
 */
async function getArticle(url: string) {
  const res = await ajax(url);
  const html = await res.text();
  const dom = new domParser.parseFromString(html);
  const body: Node = dom.getElementsByTagName('body')[0];
  return body.textContent.replace(/\n+/g, '\n');
}

/**
 * 分词
 */
function cutWords(article: string): string[] {
  return segment.doSegment(article, {
    simple: true, // 不返回词性
    stripPunctuation: true // 去除标点符号
  });
}

/**
 * 计算TF
 * @param article 文章
 * @param segments 分词
 */
function calcTf(article: string, segments: Set<string>) {
  const tf = {};
  for (const s of segments) {
    const re = article.match(new RegExp(s, 'g'));
    tf[s] = (re ? re.length : 0) / article.length;
  }
  return tf;
}

/**
 * 计算余弦相似度
 */
function calcSimilarity(vector1: number[], vector2: number[]) {
  if (vector1.length !== vector2.length) {
    throw new Error('两个向量长度必须相等');
  }
  let sum = 0;
  let r1 = 0;
  let r2 = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += vector1[i] * vector2[i];
    r1 += vector1[i] ** 2;
    r2 += vector2[i] ** 2;
  }
  return sum / (Math.sqrt(r1) * Math.sqrt(r2));
}