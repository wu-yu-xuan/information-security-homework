import * as React from 'react';
import './base.scss';
import * as style from './style.scss';
import { Input, Button } from 'antd';

export default function App() {
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState('');
  const [textContent, setTextContent] = React.useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  const handleClick = async () => {
    const response = await fetch('/url', {
      body: JSON.stringify({ url: value }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    const text = await response.text();
    setResult(text);
  }
  React.useEffect(() => {
    const dom = new DOMParser().parseFromString(result, 'text/html');
    setTextContent(dom.body.textContent);
  }, [result]);
  return (
    <div className={style.container}>
      <div className={style.inputRow}>
        <Input className={style.input} value={value} onChange={handleChange} />
        <Button className={style.btn} type="primary" onClick={handleClick}>解析HTML</Button>
      </div>
      <div className={style.iframeRow}>
        <textarea className={style.iframe} value={textContent} readOnly={true} />
        <iframe className={style.iframe} srcDoc={result} sandbox="" />
      </div>
    </div>
  );
}