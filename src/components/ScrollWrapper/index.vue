<template>
	<div
		ref="wrapper"
		class="roll"
		@mouseenter="isHover = true"
		@mouseleave="isHover = false"
	>
		<el-scrollbar wrap-class="overflow-x-hidden" style="height: 100%">
			<div
				class="roll-ul"
				:class="{ animationCls: isAnimation }"
				:style="{
					marginTop: isAnimation ? `-${lineHeight + itemGap}px` : '',
					'padding-right': scrollPaddingRight + 'px',
					'--scrollTime': scrollTime + 'ms',
				}"
			>
				<div
					v-for="item in compScrollData"
					:key="item.keyIndex"
					class="roll-li"
					:style="{ height: `${lineHeight}px`, '--itemGap': `${itemGap}px` }"
				>
					<slot :item="item.data" :index="item.keyIndex"> </slot>
				</div>
			</div>
		</el-scrollbar>
	</div>
</template>

<script>
export default {
	name: 'ScrollWrapper',
	props: {
		// 滚动数据
		scrollData: {
			type: Array,
			default: () => [],
		},
		// 列表显示的数据数量
		showNum: {
			type: Number,
			default: 5,
		},
		// 是否开启滚动
		isScroll: {
			type: Boolean,
			default: true,
		},
		// 滚动等待时间
		waitTime: {
			type: Number,
			default: 5500,
		},
		// 右侧padding，为滚动条预留宽度
		scrollPaddingRight: {
			type: Number,
			default: 12,
		},
		// 滚动item的上下间隔
		itemGap: {
			type: Number,
			default: 0,
		},
		// 滚动动画时间
		scrollTime: {
			type: Number,
			default: 600,
		},
	},
	data() {
		return {
			maxValue: null,
			isHover: false,
			timer: null,
			lineHeight: 0, // 每行行高
			isAnimation: false, // 是否开启动画
			compScrollData: [],
		}
	},
	watch: {
		scrollData: {
			handler(newVal) {
				if (newVal) {
					this.compScrollData = newVal.map((data, index) => {
						return { keyIndex: index + 1, data }
					})
				}
			},
			deep: true,
			immediate: true,
		},
	},
	mounted() {
		this.lineHeight =
			(this.$refs['wrapper'].offsetHeight - this.itemGap * (this.showNum - 1)) /
			this.showNum
		if (this.isScroll) {
			this.timer = setInterval(this.move, this.waitTime)
		}
	},
	beforeDestroy() {
		clearInterval(this.timer)
	},
	methods: {
		move() {
			if (!this.isHover && this.scrollData.length > this.showNum) {
				this.isAnimation = true
				setTimeout(() => {
					this.compScrollData.push(this.compScrollData[0])
					this.compScrollData.shift()
					this.isAnimation = false
				}, this.scrollTime + 500)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.roll {
	border: none;
	width: 100%;
	height: 100%;

	&:hover {
		overflow-y: auto;
	}

	::v-deep .el-scrollbar__view {
		height: 100%;
	}

	.roll-ul {
		width: 100%;
		will-change: margin;

		&.animationCls {
			transition: all ease var(--scrollTime);
		}

		li {
			list-style: none;

			&.roll-li {
				widows: 100%;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-top: var(--itemGap);

				&:first-child {
					margin-top: 0;
				}
			}
		}
	}
}
</style>
