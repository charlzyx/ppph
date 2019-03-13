/**
 * ppph: Pipes Props Pass to Hoc
 * // in code
 *   <AnyComp p1="p1" p1="p2" p1="p3" />
 * ->
 * // in Chrome React DevTools
 *  <P3 p1="p1" p1="p2" p1="p3">
 *    <P2 p1="p1" p1="p2" p1="p3">
 *      <P1 p1="p1" p1="p2" p1="p3">
 *        <AnyComp p1="p1" p1="p2" p1="p3" />
 *      </P1>
 *    </P2>
 *  </P3>
 *
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
  }) => void;
  --------------------------------------------
`;

/**
 * pipe for ppph's constructor
 * @param who string; name for pipe
 * @param when (type, props) => boolean | any; when to use the pipe
 * @param how: (Comp: ReactElement) => ReactElement, how to deal with HOC
 * @param why (e) => void; will be call when error occur.
 * @constructor
 */
function Pipe({
  who, when, how, why,
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
}
// TODO: LRU
const CACHE = new Map();

/**
 *
 * @type {{
 *  use(*=): void,
 *  ppphInjectCreateElement(*=, *=, ...[*]=): (*|*|*),
 *  inject(): void,
 *  pipes: Array
 * }}
 */
const ppph = {
  pipes: [],
  use(pipe) {
    if (pipe instanceof Pipe) {
      this.pipes.push(pipe);
    } else {
      throw new Error(`[ppph] use param must be type: Pipe, which can be make by piper,
        import { piper } from 'ppph'
        -----------------------------------
        at ${pipe.who} but now is ${pipe};
      `);
    }
  },
  getNeedPipes(type, props) {
    // TODO: sort by Object.keys index
    return ppph.pipes.filter(p => p.when(type, props));
  },
  flush(type, props, children) {
    const pipes = ppph.getNeedPipes(type, props);
    const ctxProps = { ...props, [NATIVE_FLAG]: NATIVE_FLAG };

    const vdom = pipes.reduce((c, pipe) => {
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

      // null to fix input like no children
      const ctx = { ...c.props, children: children.length === 0 ? null : children };
      // console.log('prev', c);
      // console.log('ctx', ctx);
      return <HOC {...ctx} />;
    }, { type, props: ctxProps, children });

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
    // console.log(props);
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
}) => new Pipe({
  who, when, how, why,
});

export default ppph;

export {
  piper,
};
