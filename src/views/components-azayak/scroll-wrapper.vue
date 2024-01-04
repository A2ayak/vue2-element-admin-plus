<template>
	<div class="base-wrapper">
		<ScrollWrapper
			:scroll-data="scrollData"
			class="scroll-container"
			:show-num="8"
		>
			<template slot-scope="{ index, item }">
				<div class="row">
					<div class="seq">{{ index }}</div>
					<div class="text">{{ item.text }}</div>
				</div>
			</template>
		</ScrollWrapper>
	</div>
</template>

<script>
import ScrollWrapper from '@/components/ScrollWrapper'
export default {
	name: 'ScrollWrapperDemo',
	components: { ScrollWrapper },
	data() {
		return {
			scrollData: new Array(30)
				.fill(0)
				.map((i, index) => ({ text: `我是第${index + 1}行数据` })),
		}
	},
}
</script>
<style scoped lang="scss">
.base-wrapper {
	.scroll-container {
		width: 400px;
		height: 400px;
		border: 1px solid #409eff;
		margin-left: 40px;
		padding: 0 16px;
		.row {
			height: 100%;
			display: flex;
			align-items: center;
			.seq {
				margin-right: 16px;
				color: #409eff;
			}
			.text {
				color: #000;
			}
		}
	}
}
</style>
