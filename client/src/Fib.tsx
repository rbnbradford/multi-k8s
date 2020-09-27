import React from 'react';

type CalculatedValue = { index: number, value: number };

const CalculatedValue = ({ index, value }: CalculatedValue) => <div key={index}>
	For index {index} I calculated {value}
</div>

export const Fib = (props: {
	index: string,
	setIndex: (s: string) => void
	onSubmitIndex: () => void,
	seenIndexes: number[]
	calculatedValues: CalculatedValue[];
}) =>
	<div>
		<form onSubmit={e => {
			e.preventDefault();
			props.onSubmitIndex();
		}}>
			<label>Enter your index:</label>
			<input
				type={'number'}
				pattern={'[0-9]*'}
				value={props.index}
				onChange={ev => props.setIndex(ev.target.value)}
			/>
			<button>Submit</button>
		</form>
		<h3>Indexes I have seen:</h3>
		{props.seenIndexes.join(', ')}
		<h3>Calculated Values:</h3>
		{props.calculatedValues.map(CalculatedValue)}
	</div>
