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

const ReactCreateElement = React.createElement;
const NATIVE_FLAG = '__ppph_flag_gao_yin_tian_zhong_yin_zhun_di_yin_chen_zong_zhi__';
const isType = (o, t) => Object.prototype.toString.call(o) === `[object ${t}]`;

const pipeErrMsg = `[Pipe] param error, check constructor:
  ({
   who: string,
   when: (type: ElementType, props: ElementProps) => boolean | any,
   how: (Comp: ReactElement) => ReactElement,
   why: (e: Error) => void
   ph?: [pH, key]
  }) => void;
  --------------------------------------------
`;

/**
 * -----------------------------------------------
 * pipe type defines
 * -----------------------------------------------
 * ↓ name for pipe
 * @param who required. type: String;
 * ↓ condition to use the pipe
 * @param when required. type: (type, props) => boolean | any;
 * ↓ the HOC for this pipe, means how to deal with it
 * @param how required. type: (Comp: ReactElement) => ReactElement;
 * ↓ a callback will be call when error occur
 * @param why required. type: (e) => void;
 * ↓ pH: means sort weight, just like pH, the lower pH value, the heighter sort weight;",
 * ↓ key: pependent key name in JSX, which will be sort by write order;",
 * @param ph type: [pH, key];
 */

function Pipe({
  who, when, how, why, ph,
}) {
  if (!isType(who, 'String')) {
    throw new Error(`${pipeErrMsg} at who: ${who}`);
  }
  if (!isType(when, 'Function')) {
    throw new Error(`${pipeErrMsg} at when: ${when}`);
  }
  if (!isType(how, 'Function')) {
    throw new Error(`${pipeErrMsg} at how: ${how}`);
  }
  if (!isType(why, 'Function')) {
    throw new Error(`${pipeErrMsg} at why: ${why}`);
  }
  this.who = who;
  this.when = when;
  this.how = how;
  this.why = why;
  this.ph = ph;
}
// TODO: LRU
const CACHE = new Map();

const getHOC = (pipe, c) => {
  let HOC;
  if (CACHE.has(pipe.how) && CACHE.get(pipe.how).has(c.type)) {
    HOC = CACHE.get(pipe.how).get(c.type);
  } else {
    try {
      HOC = pipe.how(c.type);
    } catch (e) {
      pipe.why(e);
      return c;
    }
    if (!CACHE.has(pipe.how)) {
      CACHE.set(pipe.how, new Map());
    }
    if (!CACHE.get(pipe.how).has(c.type)) {
      CACHE.get(pipe.how).set(c.type, HOC);
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
  flush(type, props, children) {
    const pipes = ppph.getNeedPipes(type, props);
    const ctxProps = { ...props, [NATIVE_FLAG]: NATIVE_FLAG };

    const element = pipes.reduce((c, pipe) => {
      // null to fix input like no children
      const ctx = {
        ...c.props,
        ref: props.ref,
        children: children.length === 0 ? null : children,
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


/**
 *
 * @param who
 * @param when
 * @param how
 * @param why
 * @returns {Pipe}
 */
const piper = ({
  who,
  when,
  how,
  why,
  ph,
}) => new Pipe({
  who, when, how, why, ph,
});

export default ppph;

export {
  piper,
};
