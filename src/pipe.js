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


export {
  Pipe,
  piper,
};
