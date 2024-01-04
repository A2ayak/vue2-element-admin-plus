<template>
	<div class="base-wrapper">
		<el-form :model="formData" label-position="right" label-width="140px">
			<el-form-item label="xxx范围">
				<el-select-plus
					v-model="formData.arr"
					placeholder="请输入，按回车添加下一个"
					default-first-option
					multiple
					filterable
					allow-create
					style="width: 500px"
					@addOptions="addOptions"
					@delCustomTag="delCustomTag"
				>
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select-plus>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import ElSelectPlus from '@/components/ElementModify/ElSelectPlus'
export default {
	name: 'ScrollWrapperDemo',
	components: { ElSelectPlus },
	props: {},
	data() {
		return {
			formData: {
				arr: [],
			},
			options: [],
		}
	},
	mounted() {},
	methods: {
		// 新增自定义选项
		addOptions(newOption) {
			if (Array.isArray(newOption)) {
				const existOption = []
				newOption.map((opt) => {
					const hasOption = this.options.find((i) => i.value === opt.value)
					if (!hasOption) {
						this.options.unshift({ ...opt, isNew: true })
						this.tempModel.arr.push(opt.value)
					} else {
						existOption.push(opt.value)
					}
					if (existOption.length) {
						const str = existOption.join(',')
						this.$message.warning(`已存在选项 ${str}`)
					}
				})
			} else {
				const hasOption = this.options.find((i) => i.value === newOption.value)
				if (!hasOption) {
					this.options.unshift({ ...newOption, isNew: true })
				} else {
					this.$message.warning('已存在该选项')
				}
			}
		},
		// 删除自定义tag选项
		delCustomTag(tag) {
			const delOptIndex = this.options.findIndex((i) => i.value === tag.value)
			if (delOptIndex !== -1 && this.options[delOptIndex].isNew) {
				this.options.splice(delOptIndex, 1)
			}
		},
	},
}
</script>
<style scoped lang="scss">
.base-wrapper {
	margin-top: 50px;
}
</style>
