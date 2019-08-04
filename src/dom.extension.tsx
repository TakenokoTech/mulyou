import ReactDOM from 'react-dom';
import { ReactInstance } from 'react';

export type CustomMouseEvent = MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>;

export function dom(ref: ReactInstance) {
    const node = ReactDOM.findDOMNode(ref) as Element;
    const height = node.getBoundingClientRect().height;
    const width = node.getBoundingClientRect().width;
    return { height: height, width: width };
}
