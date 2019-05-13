import * as React from 'react';
import './base.scss';
import * as style from './style.scss';
import { Input, Button } from 'antd';

export default function App() {
  const [value1, setValue1] = React.useState('');
  const [value2, setValue2] = React.useState('');
  const [result, setResult] = React.useState('');
  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => setValue1(e.target.value);
  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => setValue2(e.target.value);
  const handleClick = () => {
    try {
      const arr1 = value1.split(',').map(parseFloat);
      const arr2 = value2.split(',').map(parseFloat);
      let sum = 0;
      let r1 = 0;
      let r2 = 0;
      for (let i = 0; i < arr1.length; i++) {
        sum += arr1[i] * arr2[i];
        r1 += arr1[i] ** 2;
        r2 += arr2[i] ** 2;
      }
      const r = sum / (Math.sqrt(r1) * Math.sqrt(r2));
      setResult(`余弦相似度: ${r}`);
    } catch{
      setResult('出错啦');
    }
  }
  return (
    <div className={style.container}>
      <div className={style.inputRow}>
        <label className={style.label}>向量一:</label>
        <Input className={style.input} value={value1} onChange={handleChange1} />
      </div>
      <div className={style.inputRow}>
        <label className={style.label}>向量二:</label>
        <Input className={style.input} value={value2} onChange={handleChange2} />
      </div>
      <Button block={true} type="primary" onClick={handleClick}>计算余弦相似度</Button>
      <p>{result}</p>
    </div>
  );
}