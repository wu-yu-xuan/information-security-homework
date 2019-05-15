import * as React from 'react';
import './base.scss';
import * as style from './style.scss';
import { Input, Button } from 'antd';
import ObjRender from './ObjRender';

export default function App() {
  const [value1, setValue1] = React.useState('');
  const [value2, setValue2] = React.useState('');
  const [TF1, setTF1] = React.useState({});
  const [TF2, setTF2] = React.useState({});
  const [IDF, setIDF] = React.useState({});
  const [TFIDF1, setTFIDF1] = React.useState({});
  const [TFIDF2, setTFIDF2] = React.useState({});
  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => setValue1(e.target.value);
  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => setValue2(e.target.value);
  const handleClick = () => {
    const set = new Set([...Array.from(value1), ...Array.from(value2)]);
    const newTF1 = {};
    const newTF2 = {};
    const newIDF = {};
    const newTFIDF1 = {};
    const newTFIDF2 = {};
    set.forEach(v => {
      newTF1[v] = Array.from(value1).reduce((acc, cur) => {
        if (cur === v) {
          acc++;
        }
        return acc;
      }, 0) / value1.length;
      newTF2[v] = Array.from(value2).reduce((acc, cur) => {
        if (cur === v) {
          acc++;
        }
        return acc;
      }, 0) / value2.length;
      // tslint:disable-next-line: no-bitwise
      newIDF[v] = Math.log10(2 / (~~value1.includes(v) + ~~value2.includes(v)));
      newTFIDF1[v] = newTF1[v] * newIDF[v];
      newTFIDF2[v] = newTF2[v] * newIDF[v];
    });
    setTF1(newTF1);
    setTF2(newTF2);
    setIDF(newIDF);
    setTFIDF1(newTFIDF1);
    setTFIDF2(newTFIDF2);
  }
  return (
    <div className={style.container}>
      <div className={style.inputRow}>
        <label className={style.label}>s1:</label>
        <Input className={style.input} value={value1} onChange={handleChange1} />
      </div>
      <div className={style.inputRow}>
        <label className={style.label}>s2:</label>
        <Input className={style.input} value={value2} onChange={handleChange2} />
      </div>
      <Button block={true} type="primary" onClick={handleClick}>计算TF.IDF</Button>
      <div className={style.resultContainer}>
        <div className={style.result}>
          <p>s1 TF</p>
          <ObjRender obj={TF1} />
        </div>
        <div className={style.result}>
          <p>s2 TF</p>
          <ObjRender obj={TF2} />
        </div>
        <div className={style.result}>
          <p>IDF</p>
          <ObjRender obj={IDF} />
        </div>
        <div className={style.result}>
          <p>s1 TF.IDF</p>
          <ObjRender obj={TFIDF1} />
        </div>
        <div className={style.result}>
          <p>s2 TF.IDF</p>
          <ObjRender obj={TFIDF2} />
        </div>
      </div>
    </div>
  );
}