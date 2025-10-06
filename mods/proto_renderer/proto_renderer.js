// Blockly
import * as Blockly from 'blockly';

export class ProtoRenderer extends Blockly.blockRendering.Renderer {
	constructor() {
		super();
	}

	makeConstants_() {
		return new ProtoRendererConstantProvider();
	}

}

export class ProtoRendererConstantProvider extends Blockly.blockRendering.ConstantProvider {

	//optional modifiers
	//FIELD_TEXT_FONTSIZE = 10;

	//FIELD_TEXT_FONTWEIGHT = 'bold';

	//FIELD_TEXT_FONTFAMILY = '"Helvetica Neue", "Segoe UI", Helvetica, sans-serif';
	//FIELD_TEXT_FONTFAMILY = 'Ubuntu Mono, monospace';

	constructor() {
		// Set up all of the constants from the base provider.
		super();

		//width of all vertical connection points
		this.NOTCH_WIDTH = 18;

		//height of all vertical connection points
		this.NOTCH_HEIGHT = 6;

		//how round the blocks are
		this.CORNER_RADIUS = 3;

		// the width of all horizontal connection points
		this.TAB_WIDTH = 10;

		// the height of all horizontal connection points
		this.TAB_HEIGHT = 10;
	}

	init() {
		super.init();

		this.RECT_VERTICAL = this.makeRectangularVerticalConn();
		this.RECT_HORIZONTAL = this.makeRectangularHorizontalConn();
		this.ROUND_VERTICAL = this.makeRoundedVerticalConn();
		this.ROUND_HORIZONTAL = this.makeRoundedHorizontalConn();
		this.TRIANGULAR_HORIZONTAL = this.makeTriangularHorizontalConn(); 
		this.TRIANGULAR_VERTICAL = this.NOTCH;
		this.DEFAULT_VERTICAL = this.makeBetterNotch();
		this.DEFAULT_HORIZONTAL = this.PUZZLE_TAB;
	}

	shapeFor(connection) {
		var checks = connection.getCheck();
		switch (connection.type) {
			case Blockly.INPUT_VALUE:
			case Blockly.OUTPUT_VALUE:
				if (checks && checks.includes('Number')) {
					return this.ROUND_HORIZONTAL;
				}
				if (checks && checks.includes('String')) {
					return this.ROUND_HORIZONTAL;
				}
				if (checks && checks.includes('Boolean')) {
				    return this.TRIANGULAR_HORIZONTAL;
				}
				return this.ROUND_HORIZONTAL;
			case Blockly.PREVIOUS_STATEMENT:
			case Blockly.NEXT_STATEMENT:
				return this.DEFAULT_VERTICAL;
			default:
				throw Error('Unknown connection type');
		}
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Shape Generators
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	makeBetterNotch() {
		const width = this.NOTCH_WIDTH;
		const height = this.NOTCH_HEIGHT;

		const innerWidth = width / 3;
		const curveWidth = innerWidth / 3;

		const halfHeight = height / 2;
		const quarterHeight = halfHeight / 2;

		function makeMainPath(dir) {
			return (
				Blockly.utils.svgPaths.curve('c', [
					Blockly.utils.svgPaths.point((dir * curveWidth) / 2, 0),
					Blockly.utils.svgPaths.point((dir * curveWidth * 3) / 4, quarterHeight / 2),
					Blockly.utils.svgPaths.point(dir * curveWidth, quarterHeight),
				]) +
				Blockly.utils.svgPaths.line([Blockly.utils.svgPaths.point(dir * curveWidth, halfHeight)]) +
				Blockly.utils.svgPaths.curve('c', [
					Blockly.utils.svgPaths.point((dir * curveWidth) / 4, quarterHeight / 2),
					Blockly.utils.svgPaths.point((dir * curveWidth) / 2, quarterHeight),
					Blockly.utils.svgPaths.point(dir * curveWidth, quarterHeight),
				]) +
				Blockly.utils.svgPaths.lineOnAxis('h', dir * innerWidth) +
				Blockly.utils.svgPaths.curve('c', [
					Blockly.utils.svgPaths.point((dir * curveWidth) / 2, 0),
					Blockly.utils.svgPaths.point((dir * curveWidth * 3) / 4, -(quarterHeight / 2)),
					Blockly.utils.svgPaths.point(dir * curveWidth, -quarterHeight),
				]) +
				Blockly.utils.svgPaths.line([Blockly.utils.svgPaths.point(dir * curveWidth, -halfHeight)]) +
				Blockly.utils.svgPaths.curve('c', [
					Blockly.utils.svgPaths.point((dir * curveWidth) / 4, -(quarterHeight / 2)),
					Blockly.utils.svgPaths.point((dir * curveWidth) / 2, -quarterHeight),
					Blockly.utils.svgPaths.point(dir * curveWidth, -quarterHeight),
				])
			);
		}

		const pathLeft = makeMainPath(1);
		const pathRight = makeMainPath(-1);

		return {
			type: this.SHAPES.NOTCH,
			width,
			height,
			pathLeft,
			pathRight,
		};
	}

	makeRectangularVerticalConn() {
		const width = this.NOTCH_WIDTH;
		const height = this.NOTCH_HEIGHT;

		function makeMainPath(dir) {
			return Blockly.utils.svgPaths.line(
					[
						Blockly.utils.svgPaths.point(0, height),
						Blockly.utils.svgPaths.point(dir * width, 0),
						Blockly.utils.svgPaths.point(0, -height),
					]);
		}
		const pathLeft = makeMainPath(1);
		const pathRight = makeMainPath(-1);

		return {
			width: width,
			height: height,
			pathLeft: pathLeft,
			pathRight: pathRight,
		};
	}

	makeRectangularHorizontalConn() {
		const width = this.TAB_WIDTH;
		const height = this.TAB_HEIGHT;

		function makeMainPath(dir) {
			return Blockly.utils.svgPaths.line(
					[
						Blockly.utils.svgPaths.point(-width, 0),
						Blockly.utils.svgPaths.point(0, dir * height),
						Blockly.utils.svgPaths.point(width, 0),
					]);
		}
		const pathUp = makeMainPath(-1);
		const pathDown = makeMainPath(1);

		return {
			width: width,
			height: height,
			pathUp: pathUp,
			pathDown: pathDown,
		};
	}

	makeRoundedVerticalConn() {
		const width = this.NOTCH_WIDTH;
		const height = this.NOTCH_HEIGHT;
		const radius = this.CORNER_RADIUS || 4;

		function makeMainPath(dir) {
			const sweepFlag = dir === 1 ? 0 : 1;
			return (
				Blockly.utils.svgPaths.line([Blockly.utils.svgPaths.point(0, height - radius)]) +
				Blockly.utils.svgPaths.arc(
				'a',
				`0 0,${sweepFlag}`,
				radius,
				Blockly.utils.svgPaths.point(dir * radius, radius)
				) +
				Blockly.utils.svgPaths.lineOnAxis('h', dir * (width - 2 * radius)) +
				Blockly.utils.svgPaths.arc(
				'a',
				`0 0,${sweepFlag}`,
				radius,
				Blockly.utils.svgPaths.point(dir * radius, -radius)
				) +
				Blockly.utils.svgPaths.line([Blockly.utils.svgPaths.point(0, -height + radius)])
			);
		}

		return {
			width: width,
			height: height,
			pathLeft: makeMainPath(1),
			pathRight: makeMainPath(-1),
		};
	}

	makeRoundedHorizontalConn() {
		const width = this.TAB_WIDTH / 3;
		const height = this.TAB_HEIGHT;
		const radius = (this.CORNER_RADIUS || 4) * 0.6;

		function makeMainPath(dir) {
			const sweepFlag = dir === 1 ? 0 : 1;
			return (
				Blockly.utils.svgPaths.line([Blockly.utils.svgPaths.point(-width + radius, 0)]) +
				Blockly.utils.svgPaths.arc(
					'a',
					`0 0,${sweepFlag}`,
					radius,
					Blockly.utils.svgPaths.point(-radius, dir * radius)
				) +
				Blockly.utils.svgPaths.lineOnAxis('v', dir * (height - 2 * radius)) +
				Blockly.utils.svgPaths.arc(
					'a',
					`0 0,${sweepFlag}`,
					radius,
					Blockly.utils.svgPaths.point(radius, dir * radius)
				) +
				Blockly.utils.svgPaths.line([Blockly.utils.svgPaths.point(width - radius, 0)])
			);
		}

		return {
			width: width,
			height: height,
			pathDown: makeMainPath(1),
			pathUp: makeMainPath(-1),
		};
	}

	makeTriangularHorizontalConn() {
		const width = this.TAB_WIDTH;
		const height = this.TAB_HEIGHT;

		function makeMainPath(up) {
			const forward = up ? -1 : 1;
			const back = -forward;
			const overlap = -3;
			const halfHeight = height / 2;
			const control1Y = halfHeight;
			const control2Y = halfHeight - halfHeight * 1.5;
			const control3Y = overlap;
			const endPoint1 = Blockly.utils.svgPaths.point(-width, forward * halfHeight);
			const endPoint2 = Blockly.utils.svgPaths.point(width, forward * halfHeight);
			return (
				Blockly.utils.svgPaths.curve('c', [
					Blockly.utils.svgPaths.point(0, forward * control1Y / 1.5),
					Blockly.utils.svgPaths.point(-width, back * control2Y / 0.8),
					endPoint1,
				]) +
				Blockly.utils.svgPaths.curve('s', [
					Blockly.utils.svgPaths.point(width, back * control3Y),
					endPoint2,
				])
			);
		}
		const pathUp = makeMainPath(true);
		const pathDown = makeMainPath(false);
		return {
			type: this.SHAPES.PUZZLE,
			width,
			height,
			pathDown,
			pathUp,
		};

	}



}