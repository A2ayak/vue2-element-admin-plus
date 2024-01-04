<template>
	<li
		v-show="visible"
		class="el-select-dropdown__item"
		:class="{
			selected: itemSelected,
			'is-disabled': disabled || groupDisabled || limitReached,
			hover: hover,
		}"
		@mouseenter="hoverItem"
		@click.stop="selectOptionClick"
	>
		<slot>
			<span>{{ currentLabel }}</span>
		</slot>
	</li>
</template>

<script>
import { Option } from 'element-ui'
export default {
	name: 'ElSelectOption',
	extends: Option,
	props: {
		disableElOptionClickEvent: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		selectOptionClick() {
			if (
				this.disabled !== true &&
				this.groupDisabled !== true &&
				!this.disableElOptionClickEvent
			) {
				this.dispatch('ElSelect', 'handleOptionClick', [this, true])
			}
		},
	},
}
</script>
