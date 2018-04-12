import React from 'react';
import font from '../font';
import spacing from '../spacing';

//const ThisLetter = font[39];

const getCharCode = (c) => {

	return c.charAt(0).toUpperCase().charCodeAt(0);
};

const LetterWrapper = ({x,y, children, isBold}) => <svg className={isBold ? 'bold' : ''} x={x} y={y}>{children}</svg>

const Letter = ({char, x, isBold}) => {
	const charNum = getCharCode(char);
	const y = (spacing[charNum] ? spacing[charNum].h : 100 ) - 100;
	if (!font.hasOwnProperty(charNum)) {
		return null;
	}
	const ThisLetter = font[charNum]
	return (
		<LetterWrapper isBold={isBold} y={y} x={x}>
			<ThisLetter />
		</LetterWrapper>
	);
}

const indexBold = ( rawContent ) => {
	rawContent = rawContent || [''];
	let locations = rawContent.map(e =>  (typeof e === 'string' ? {text: e, bold: false} : {text: e.props.children || null, bold: true}));
	let boldObj = locations.reduce((a, v, i, loc) => {
		let b = { index: a.index, text: a.text, boldLocations: a.boldLocations };
		b.text = a.text + v.text;
		b.index = a.index + (v.text ? v.text.length : 0);
		if (v.bold) b.boldLocations.push([a.index, b.index]);
		return b
	}, {text: '', index: 0, boldLocations: []});
	return boldObj
};

const inRange = (x, ranges) => {
	return ranges.filter(e => x >= e[0] && x < e[1] ).length > 0;
}

const SVGWrapper = ( { children, x, y, text } ) => <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 -20 " + x + " " + y }>
	<title>{text}</title>
	{children}
	</svg>;

class Type extends React.Component {

	constructor(props) {
		super(props);

	}

	xVal(pos, string, letterSpacing = 5) {
		if (pos === 0) return 0;
		const charCode =  getCharCode( string[ pos-1 ] );
		if (!spacing.hasOwnProperty(charCode)) return null
		return spacing[charCode].w + letterSpacing
	}

	xVals(string, letterSpacing) {
		let fn = (a,v,i,s) => {
			a.push(this.xVal(i, s, letterSpacing) + ( i > 0 ? a[i-1] : 0));
			return a;
		};
		return string.split('').reduce(fn, [])
	}

	render( ) {
		const text = (this.props.children && this.props.children.length > 0 ? this.props.children : '');
		const xVals = this.xVals(text, this.props.letterSpacing);
		const x = text.length > 2 ? xVals[text.length - 1] + this.xVal(text.length, text, this.props.letterSpacing) + 50 : 200;
		const boldIndex = indexBold(this.props.rawContent);
		const letters = text.split("").map((e, i)=> <Letter isBold={inRange(i, boldIndex['boldLocations'])} char={e} key={i} x={ xVals[i] } />)
		return (
			<div className={"gs-type-graphic"}>
				<SVGWrapper text={this.props.children} x={x} y={"160"}>
					{letters}
					</SVGWrapper>
			</div>
			);
	}
}

export default Type;
