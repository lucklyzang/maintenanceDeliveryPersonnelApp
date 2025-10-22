<template>
	<view class="num-box">
		<view class="subtract-box"
			@click.stop="minusNumEvent">
			<u-icon name="minus"></u-icon>
		</view>
		<input
			@click.stop="inpuntEvent"
			type="number"
			:disabled="disabled"
			:value="val"
			@blur="inputBlur"
			@input="stepperValChange"
		/>
		<view class="plus-box"
			@click.stop="plusNumEvent">
			<u-icon name="plus" color="#fff"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Number,
				default: 0
			},
			min: {
				type: [String, Number],
				default: 0
			},
			max: {
				type: [String, Number],
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			// index: {
			// 	type: Number,
			// 	default: 0
			// },
			innerIndex: {
				type: Number,
				default: 0
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				val: this.value
			};
		},
		watch: {
			val: {
				immediate: true,
				handler (val) {
					this.$emit('change', this.val, this.innerIndex);
					this.$emit('input',this.val);
				},
				deep:true
			},
			value: {
				immediate: true,
				handler (val) {
					this.val = val;
				},
				deep:true
			}
		},
		methods: {
			// 输入框点击事件
			inpuntEvent ($event) {
				this.$emit('inpuntClick',$event)
			},
			// 输入框失去焦点事件
			inputBlur ($event) {
				if ($event.target.value == '' || isNaN($event.target.value)) {
					this.val = 0
				} else {
					this.val = parseInt($event.target.value)
				};
				this.$emit('input', parseInt(this.val));
				this.$emit('inputBlur',$event, this.val, this.innerIndex)
			},
			// input框获取焦点输入事件
			stepperValChange ($event) {
				if ($event.target.value == '' || isNaN($event.target.value)) {
					this.val = 0
				} else {
					this.val = parseInt($event.target.value)
				}
				this.$emit('input', parseInt(this.val))
			},
			// 加号点击事件
			plusNumEvent ($event) {
				if (this.disabled) return;
				if (this.val >= Number(this.max)) {
					return
				};
				this.val += this.step;
				this.$emit('plus', $event, this.val, this.innerIndex)
			},
			// 减号点击事件
			minusNumEvent ($event) {
				if (this.disabled) return;
				if (this.val <= Number(this.min)) {
					return
				};
				this.val -= this.step;
				this.$emit('minus', $event, this.val, this.innerIndex)
			}
		}
	}
</script>

<style lang="less">
	.num-box {
		height: 100%;
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		.subtract-box  {
			width: 30px;
			height: 33px;
			background: #d2d2d2;
			display: flex;
			justify-content: center;
			align-items: center;
		};
		input {
			flex: 1;
			height: 100%;
			background: #a7a7a7;
		};
		.plus-box  {
			width: 30px;
			height: 33px;
			background: #d2d2d2;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>