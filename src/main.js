/**
 * ---------------------------------------------------------
 * ppph: Pipe Props Pass to Hoc
 * ---------------------------------------------------------
 *
 * before:
 *  <AnyComp p1="p1" p2="p2" />
 * after:
 *  <P2 p1="p1" p2="p2" >
 *    <P1 p1="p1" p2="p2">
 *      <AnyComp p1="p1" p2="p2" />
 *    </P1>
 *  </P2>
 *
 * ---------------------------------------------------------
 * runtime surprise!
 * ---------------------------------------------------------
 */

import React from 'react';
import { Pipe, piper } from './pipe';

const ReactCreateElement = React.createElement;
const NATIVE_FLAG = '__ppph_flag_gao_yin_tian_zhong_yin_zhun_di_yin_chen_zong_zhi__';
const isType = (o, t) => Object.prototype.toString.call(o) === `[object ${t}]`;
const getChildren = (children) => {
  if (!children) return children;
  if (children.length === 0) return null;
  if (children.length === 1) return children[0];
  return children;
};

/**
 * - [HOC]
 *   - [Comp]
 *     - instance
 *     - refers
 */

class Cache {
   map = new Map();

   has(HOC, Comp) {
     return this.map.has(HOC) && this.map.get(HOC).has(Comp);
   }

   // refers 联动 clean
   get(HOC, Comp) {
     const next = this.map.get(HOC).get(Comp);
     //  next.refers++; // eslint-disable-line
     this.map.get(HOC).set(Comp, next);
     return this.map.get(HOC).get(Comp).instance;
   }

   set(HOC, Comp, instance) {
     if (!this.map.has(HOC)) {
       this.map.set(HOC, new Map());
     }
     if (!this.map.get(HOC).has(Comp)) {
       this.map.get(HOC).set(Comp, { instance, refers: 0 });
     }
     const next = this.map.get(HOC).get(Comp);
     next.refers++; // eslint-disable-line
     return this.map.get(HOC).set(Comp, next);
   }

   // 联动get中的refers
   clean(HOC, Comp) {
     const info = this.map.get(HOC).get(Comp);
     info.refers--; // eslint-disable-line
     if (info.refers === 0) {
       this.map.get(HOC).delete(Comp);
       if (this.map.get(HOC).size === 0) {
         this.map.delete(HOC);
       }
     } else {
       this.map.get(HOC).set(Comp, info);
     }
   }
}

const cache = new Cache();

const getHOC = (pipe, c, isNewRefer) => {
  let HOC;
  if (cache.has(pipe.how, c.type)) {
    HOC = cache.get(pipe.how, c.type, isNewRefer);
  } else {
    try {
      HOC = pipe.how(c.type);
      cache.set(pipe.how, c.type, HOC);
    } catch (e) {
      pipe.why(e);
      return c;
    }
  }
  return HOC;
};


const ppph = {
  pipes: [],
  use(pipe) {
    if (pipe instanceof Pipe) {
      this.pipes.push(pipe);
      try {
        this.pipes.sort((p, n) => {
        /**
         * 氢离子浓度指数（hydrogen ion concentration），一般称为“pH”
         * ph 越小, 表明权重高
         */
          const { ph: [pph = 7] = [] } = p;
          const { ph: [nph = 7] = [] } = n;
          return pph - nph;
        });
      } catch (e) {
        console.warn('[ppph] now pieps');
        console.log(this.pipes);
        throw new Error(`[ppph] pipes sort error, pleas check pipes [ph], normally it should be looks like this
        -----------------------------------
        export const yourPipe = piper({
          who: 'pipeName',                              // your pipe name
          when: (type, props) => props && props[key],   // your condition
          how: yourHOC,                                 // your hoc
          why: (e) => {},                               // your catcher
          ph: [-100, 'key'],                            // [ph: number, key: string] || or no this field
        });
      `);
      }
    } else {
      throw new Error(`[ppph] use param must be type: Pipe, which can be make by piper,
        import { piper } from 'ppph'
        -----------------------------------
        at ${pipe.who} but now is ${pipe}; normally is should be looks like this

        export const yourPipe = piper({
          who: 'pipeName',                              // your pipe name
          when: (type, props) => props && props[key],   // your condition
          how: yourHOC,                                 // your hoc
          why: (e) => {},                               // your catcher
          ph: [-100, 'key'],                            // [ph: number, key: string] or no this field
        });
      `);
    }
  },
  getNeedPipes(type, props) {
    const keyIndexMap = Object.keys(props).reduce((map, key, index) => {
      map[key] = index + 7;  // eslint-disable-line
      return map;
    }, {});

    const needs = ppph.pipes.filter(p => p.when(type, props));
    try {
      needs.sort((p, n) => {
        const { ph: [pph = 7, pKey] = [] } = p;
        const { ph: [nph = 7, nKey] = [] } = n;
        const ppH = Math.min(pph, (keyIndexMap[pKey] || 7));
        const npH = Math.min(nph, (keyIndexMap[nKey] || 7));
        return ppH - npH;
      });
    } catch (e) {
      console.warn('[ppph] now pieps');
      console.log(this.pipes);
      throw new Error(`[ppph] pipes sort error, pleas check pipes [ph], normally it should be looks like this
        -----------------------------------
        export const yourPipe = piper({
          who: 'pipeName',                              // your pipe name
          when: (type, props) => props && props[key],   // your condition
          how: yourHOC,                                 // your hoc
          why: (e) => {},                               // your catcher
          ph: [-100, 'key'],                            // [ph: number, key: string] || or no this field
        });
      `);
    }


    return needs;
  },
  flush(type, props, childArray) {
    const children = getChildren(childArray);
    const pipes = ppph.getNeedPipes(type, props);
    const ctxProps = { ...props, [NATIVE_FLAG]: NATIVE_FLAG, ref: (ref) => { console.log('ref', ref); } };

    const element = pipes.reduce((c, pipe) => {
      const ctx = {
        ...c.props,
        ref: props.ref,
        children,
      };
      const HOC = getHOC(pipe, c);

      return ReactCreateElement(HOC, ctx, ctx.children);
    }, ReactCreateElement(type, ctxProps, children));
    return element;
  },

  /**
   *
   * @param type
   * @param props
   * @param children
   * @return {*}
   */
  ppphInjectCreateElement(type, props, ...children) {
    const shouldPipe = isType(props, 'Object')
      && !props[NATIVE_FLAG]
      && ppph.getNeedPipes(type, props).length > 0;

    if (shouldPipe) {
      return ppph.flush(type, props, children);
    }

    return ReactCreateElement(type, props, ...children);
  },

  inject() {
    React.createElement = ppph.ppphInjectCreateElement;
  },
};


export default ppph;

export {
  piper,
};
