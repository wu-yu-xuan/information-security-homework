import * as React from 'react';
import './base.scss';
import * as style from './style.scss';
import { Input, Button } from 'antd';
import ObjRender from './ObjRender';
import debounce from './debounce';

export default function App() {
  const [url1, setUrl1] = useInput();
  const [url2, setUrl2] = useInput();
  const { loading, article1, article2, tf1, tf2, similarity, handleClick } = useUrl(url1, url2);
  const { ref1, ref2 } = useScroll();
  return (
    <div className={style.container}>
      <div className={style.inputRow}>
        <label className={style.label}>URL1:</label>
        <Input className={style.input} value={url1} onChange={setUrl1} />
      </div>
      <div className={style.inputRow}>
        <label className={style.label}>URL2:</label>
        <Input className={style.input} value={url2} onChange={setUrl2} />
      </div>
      <div className={style.inputRow}>
        <Button type="primary" block={true} loading={loading} onClick={handleClick}>计算</Button>
      </div>
      <div className={style.inputRow}>
        <label className={style.label}>余弦相似度:</label>
        <p className={style.input}>{similarity}</p>
      </div>
      <div className={style.displayRow}>
        <div className={style.displayContainer}>
          <p>文章一:</p>
          <article>{article1}</article>
        </div>
        <div className={style.displayContainer}>
          <p>文章二:</p>
          <article>{article2}</article>
        </div>
      </div>
      <div className={style.displayRow}>
        <div className={style.displayContainer} ref={ref1}>
          <p>文章一 TF:</p>
          <ObjRender obj={tf1} />
        </div>
        <div className={style.displayContainer} ref={ref2}>
          <p>文章二 TF:</p>
          <ObjRender obj={tf2} />
        </div>
      </div>
    </div>
  );
}

function useInput(): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void
] {
  const [value, setValue] = React.useState('');
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);
  return [value, handleChange];
}

function useUrl(url1: string, url2: string) {
  const [loading, setLoading] = React.useState(false);
  const [article1, setArticle1] = React.useState('');
  const [article2, setArticle2] = React.useState('');
  const [tf1, setTf1] = React.useState({});
  const [tf2, setTf2] = React.useState({});
  const [similarity, setSimilarity] = React.useState(0);
  const handleClick = async () => {
    setLoading(true);
    const res = await fetch('/url', {
      body: JSON.stringify({ url1, url2 }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    const result = await res.json();
    setLoading(false);
    setArticle1(result.article1);
    setArticle2(result.article2);
    setTf1(result.tf1);
    setTf2(result.tf2);
    setSimilarity(result.similarity);
  }
  return { loading, article1, article2, tf1, tf2, similarity, handleClick };
}

/**
 * 使两个元素同步滚动
 * 滚动性能优化真是一言难尽
 */
function useScroll() {
  const ref1 = React.useRef<HTMLDivElement>(null);
  const ref2 = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleScroll = debounce(() => ref2.current.scrollTo(0, ref1.current.scrollTop), 500, false);
    if (ref1.current) {
      ref1.current.addEventListener('scroll', handleScroll, { passive: true });
      return () => ref1.current.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [ref1.current]);
  React.useEffect(() => {
    const handleScroll = debounce(() => ref1.current.scrollTo(0, ref2.current.scrollTop), 500, false);
    if (ref2.current) {
      ref2.current.addEventListener('scroll', handleScroll, { passive: true });
      return () => ref2.current.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [ref2.current]);
  return { ref1, ref2 };
}