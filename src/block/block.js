/**
 * BLOCK: type
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

import Type from '../components/type';
//import font from '../components/font';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType, InspectorControls, BlockControls, RichText } = wp.blocks; // Import registerBlockType() from wp.blocks
const { RangeControl, TextControl, AlignmentToolbar, Button } = wp.components;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'gs/block-type', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Type' ), // Block title.
	icon: 'edit', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'type' ),
	],

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: '.gs-type-content',
		},
		displayContent: {
			type: 'string',
			source: 'attribute',
			attribute: 'data-display',
			selector: '.gs-type'
		},
		letterSpacing: {
			type: 'integer',
			default: 5
		}
	},

	edit: function( props ) {
		const changeContent = (content) => {
			let cString = content.map((e) => typeof e === 'object' ? e.props.children : e).join('');
			props.setAttributes( {
				content: content,
				displayContent: cString
			} )
		};
		const onChangeLetterSpacing = ( c ) => {
			props.setAttributes( {
				letterSpacing: c
			} )
		}

		const content = props.attributes.content && props.attributes.content.length > 0 ? props.attributes.content : null;

		return [ props.focus && (
			<InspectorControls>
				<RangeControl
					label="Letter Spacing"
					value={ props.attributes.letterSpacing }
					onChange={ onChangeLetterSpacing }
					min={ 0 }
					max={ 50 }
				/>
			</InspectorControls>
		),
			props.focus && (
				<div>
					<RichText
						tagName="span"
						className={ 'rich-content' }
						value={ content }
						onChange={ changeContent  }
						placeholder={'Enter Text Here...'}
						formattingControls={['bold']}
						isSelected={props.focus}
						keepPlaceholderOnFocus={true}
					/>
				</div>
			),
			<div className={props.className}>
				<Type rawContent={content} letterSpacing={ props.attributes.letterSpacing }>{props.attributes.displayContent}</Type>
			</div>

		];
	},


	save: function( props ) {
		const content = props.attributes.content;
		const display = props.attributes.displayContent;
		return (
			<div className={ 'gs-type ' + props.className } data-content={content} data-display={props.attributes.displayContent}>
				<span className="gs-type-content">{content}</span>
				<Type rawContent={content} letterSpacing={ props.attributes.letterSpacing }>{display}</Type>
			</div>
		);
	},
} );

