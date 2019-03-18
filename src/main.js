/**
 * ----------------------------------------------------------------------------
 * ppph: Pipe Props Pass to Hoc
 * ----------------------------------------------------------------------------
 * // in code
 *   <AnyComp p1="p1" p2="p2" p3="p3" />
 * ->
 * // in Chrome React DevTools
 *  <P3 p1="p1" p2="p2" p3="p3">
 *    <P2 p1="p1" p2="p2" p3="p3">
 *      <P1 p1="p1" p2="p2" p3="p3">
 *        <AnyComp p1="p1" p2="p2" p3="p3" />
 *      </P1>
 *    </P2>
 *  </P3>
 * ----------------------------------------------------------------------------
 * PipeHOC diff with normal HOC
 * 1. statics:  because is no decorator or HOC(Comp) to write, so statics is no need to hoist
 * 2. forwardRef: will be 2nd param for Pipe HOC, gift for you.
 * ----------------------------------------------------------------------------
 * runtime surprise!
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
   ph: [ph, key]
  }) => void;
  --------------------------------------------
`;

/**
 * pipe for ppph's constructor
 * @param who string; name for pipe
 * @param when (type, props) => boolean | any; when to use the pipe
 * @param how: (Comp: ReactElement) => ReactElement, how to deal with HOC
 * @param why (e) => void; will be call when error occur.
 * @param ph [ph, key]; the important for your pipe,
 * min ph mean height power just like pH, key is sort by your props write sort, default ph is 7.
 * @constructor
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

const getHOC = (pipe, c, ref) => {
  let HOC;
  if (CACHE.has(pipe.how)
    && CACHE.get(pipe.how).has(c.type)
    && CACHE.get(pipe.how).get(c.type).has(ref)
  ) {
    HOC = CACHE.get(pipe.how).get(c.type).get(ref);
  } else {
    try {
      HOC = pipe.how(c.type, ref);
    } catch (e) {
      pipe.why(e);
      return c;
    }
    if (!CACHE.has(pipe.how)) {
      CACHE.set(pipe.how, new Map());
    }
    if (!CACHE.get(pipe.how).has(c.type)) {
      CACHE.get(pipe.how).set(c.type, new Map());
    }
    if (!CACHE.get(pipe.how).get(c.type).has(ref)) {
      CACHE.get(pipe.how).get(c.type).set(ref, HOC);
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
      map[key] = index + 7;
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
    const deepChild = React.createElement(type, ctxProps, children);

    const vdom = pipes.reduce((c, pipe) => {
      // null to fix input like no children
      const ctx = {
        ...c.props,
        ref: ctxProps.ref,
        children: children.length === 0 ? null : children,
      };

      const forwardRefHOC = React.forwardRef((fprops, ref) => {
        const HOC = getHOC(pipe, c, ref);
        return React.createElement(HOC, { ...fprops, forwardRef: ref });
      });

      return React.createElement(forwardRefHOC, ctx, ctx.children);
    }, deepChild);
    return vdom;
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
      console.log(props);
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
