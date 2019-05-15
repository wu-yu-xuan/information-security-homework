import * as React from "react";

interface IObjRender {
  obj: {}
}

export default function ObjRender({ obj }: IObjRender) {
  return <ul>{Object.keys(obj).map((v, i) => <li key={i}>{v}: {obj[v]}<br /></li>)}</ul>;
}