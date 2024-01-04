<template>
	<div
		v-clickoutside="handleClose"
		class="el-select"
		:class="[
			selectSize ? 'el-select--' + selectSize : '',
			tagEditable ? 'hide-options' : '',
		]"
		@click.stop="toggleMenu"
	>
		<div
			v-if="multiple"
			ref="tags"
			class="el-select__tags"
			:style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }"
		>
			<span v-if="collapseTags && selected.length">
				<el-tag
					:closable="!selectDisabled"
					:size="collapseTagSize"
					:hit="selected[0].hitState"
					type="info"
					disable-transitions
					@close="deleteTag($event, selected[0])"
				>
					<span class="el-select__tags-text">{{
						selected[0].currentLabel
					}}</span>
				</el-tag>
				<el-tag
					v-if="selected.length > 1"
					:closable="false"
					:size="collapseTagSize"
					type="info"
					disable-transitions
				>
					<span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
				</el-tag>
			</span>
			<transition-group v-if="!collapseTags" @after-leave="resetInputHeight">
				<el-tag
					v-for="(item, index) in selected"
					:key="getValueKey(item)"
					:closable="!selectDisabled"
					:size="collapseTagSize"
					:hit="item.hitState"
					:class="{ isEdit: item.isEdit }"
					type="info"
					disable-transitions
					@close="deleteTag($event, item)"
					@click.stop
					@dblclick.native="dbClickTag(item, index)"
				>
					<span v-if="!item.isEdit" class="el-select__tags-text">{{
						item.currentLabel
					}}</span>
					<el-input
						v-else
						:ref="'tagInput' + index"
						v-model.trim="customVal"
						type="text"
						@blur="saveTag(item, index)"
						@keyup.native.enter.stop="saveTag(item, index)"
					/>
				</el-tag>
			</transition-group>

			<input
				v-if="filterable"
				ref="input"
				v-model="query"
				type="text"
				class="el-select__input"
				:class="[selectSize ? `is-${selectSize}` : '']"
				:disabled="selectDisabled"
				:autocomplete="autoComplete || autocomplete"
				:style="{
					'flex-grow': '1',
					width: inputLength / (inputWidth - 32) + '%',
					'max-width': inputWidth - 42 + 'px',
				}"
				@focus="handleFocus"
				@blur="softFocus = false"
				@keyup="managePlaceholder"
				@keydown="resetInputState"
				@keydown.down.prevent="navigateOptions('next')"
				@keydown.up.prevent="navigateOptions('prev')"
				@keydown.enter.prevent="selectOption"
				@keydown.esc.stop.prevent="visible = false"
				@keydown.delete="deletePrevTag"
				@keydown.tab="visible = false"
				@compositionstart="handleComposition"
				@compositionupdate="handleComposition"
				@compositionend="handleComposition"
				@input="debouncedQueryChange"
			/>
		</div>
		<el-input
			:id="id"
			ref="reference"
			v-model="selectedLabel"
			type="text"
			:placeholder="currentPlaceholder"
			:name="name"
			:autocomplete="autoComplete || autocomplete"
			:size="selectSize"
			:disabled="selectDisabled"
			:readonly="readonly"
			:validate-event="false"
			:class="{ 'is-focus': visible }"
			:tabindex="multiple && filterable ? '-1' : null"
			@focus="handleFocus"
			@blur="handleBlur"
			@keyup.native="debouncedOnInputChange"
			@keydown.native.down.stop.prevent="navigateOptions('next')"
			@keydown.native.up.stop.prevent="navigateOptions('prev')"
			@keydown.native.enter.prevent="selectOption"
			@keydown.native.esc.stop.prevent="visible = false"
			@keydown.native.tab="visible = false"
			@paste.native="debouncedOnInputChange"
			@mouseenter.native="inputHovering = true"
			@mouseleave.native="inputHovering = false"
		>
			<template v-if="$slots.prefix" slot="prefix">
				<slot name="prefix"></slot>
			</template>
			<template slot="suffix">
				<i
					v-show="!showClose"
					:class="[
						'el-select__caret',
						'el-input__icon',
						'el-icon-' + iconClass,
					]"
				></i>
				<i
					v-if="showClose"
					class="el-select__caret el-input__icon el-icon-circle-close"
					@click="handleClearClick"
				></i>
			</template>
		</el-input>
		<transition
			name="el-zoom-in-top"
			@before-enter="handleMenuEnter"
			@after-leave="doDestroy"
		>
			<el-select-menu
				v-show="visible && emptyText !== false"
				ref="popper"
				:append-to-body="popperAppendToBody"
				:class="{ 'custom-hide-el-select-dropdown-menu': tagEditable }"
			>
				<el-select-option
					v-if="allowCreateCustomOption"
					label=""
					value=""
					disable-el-option-click-event
					class="custom-option-input"
				>
					<div style="width: 100%; height: 100%" @click.stop.prevent>
						<div v-show="!showCustom" @click="showCustomOption">+自定义</div>
						<el-input
							v-show="showCustom"
							ref="customOption"
							v-model.trim="inputValue"
							maxlength="32"
							size="small"
							@keydown.enter.native="addOptions"
						/>
					</div>
				</el-select-option>
				<el-scrollbar
					v-show="options.length > 0 && !loading"
					ref="scrollbar"
					tag="ul"
					wrap-class="el-select-dropdown__wrap"
					view-class="el-select-dropdown__list"
					:class="{
						'is-empty': !allowCreate && query && filteredOptionsCount === 0,
					}"
				>
					<el-option v-if="showNewOption" :value="query" created />
					<slot></slot>
				</el-scrollbar>
				<template
					v-if="
						emptyText &&
						(!allowCreate || loading || (allowCreate && options.length === 0))
					"
				>
					<slot v-if="$slots.empty" name="empty"></slot>
					<p v-else class="el-select-dropdown__empty">
						{{ emptyText }}
					</p>
				</template>
			</el-select-menu>
		</transition>
	</div>
</template>

<script>
import { Select } from 'element-ui'
import ElSelectOption from './ElSelectOption'
export default {
	name: 'ElSelectPlus',
	components: { ElSelectOption },
	extends: Select,
	props: {
		// 是否允许新增选项
		allowCreateCustomOption: {
			type: Boolean,
			default: true,
		},
		// tag是否可编辑
		tagEditable: {
			type: Boolean,
			default: false,
		},
		// 原el-select属性，样式相关
		popperAppendToBody: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			customVal: '',
			showCustom: false,
			inputValue: '',
		}
	},
	methods: {
		dbClickTag(item, index) {
			item.isEdit = true
			this.customVal = item.currentLabel
			this.$forceUpdate()
			setTimeout(() => {
				const ref = this.$refs['tagInput' + index]
				ref[0] && ref[0].focus()
			})
		},
		// 按enter键或输入框失焦，保存已编辑tag
		saveTag(item, index) {
			this.$set(item, 'isEdit', false)
			this.$nextTick(() => {
				this.$set(this.value, index, this.customVal)
			})
		},
		// 新增选项
		addOptions() {
			if (!this.inputValue) return
			if (this.inputValue.includes(',')) {
				const newOptions = this.inputValue.split(',').map((i) => {
					return { label: i, value: i }
				})
				this.$emit('addOptions', newOptions)
			} else {
				this.$emit('addOptions', {
					label: this.inputValue,
					value: this.inputValue,
				})
			}
			this.inputValue = ''
		},
		// 删除tag
		deleteTag(event, tag) {
			const index = this.selected.indexOf(tag)
			if (index > -1 && !this.selectDisabled) {
				const value = this.value.slice()
				value.splice(index, 1)
				this.$emit('input', value)
				this.emitChange(value)
				this.$emit('remove-tag', tag.value)
			}
			event.stopPropagation()
			this.$emit('delCustomTag', tag)
		},
		handleOptionSelect(option, byClick) {
			if (this.multiple) {
				const value = (this.value || []).slice()
				const optionIndex = this.getValueIndex(value, option.value)
				if (optionIndex > -1) {
					value.splice(optionIndex, 1)
				} else if (
					this.multipleLimit <= 0 ||
					value.length < this.multipleLimit
				) {
					// 处理带逗号的批量输入
					if (option.value.includes(',')) {
						option.value.split(',').map((val) => {
							value.push(val)
						})
					} else {
						value.push(option.value)
					}
				}
				this.$emit('input', value)
				this.emitChange(value)
				if (option.created) {
					this.query = ''
					this.handleQueryChange('')
					this.inputLength = 20
				}
				if (this.filterable) this.$refs.input.focus()
			} else {
				this.$emit('input', option.value)
				this.emitChange(option.value)
				this.visible = false
			}
			this.isSilentBlur = byClick
			this.setSoftFocus()
			if (this.visible) return
			this.$nextTick(() => {
				this.scrollToOption(option)
			})
		},
		handleClose() {
			this.showCustom = false
			this.visible = false
		},
		showCustomOption() {
			this.showCustom = true
			this.$nextTick(() => {
				this.$refs['customOption'] && this.$refs['customOption'].focus()
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.el-select {
	::v-deep .el-select__tags {
		.el-tag {
			&.isEdit {
				.el-tag__close {
					display: none;
				}
			}
			.el-input {
				height: 20px;
				.el-input__inner {
					height: 20px;
					line-height: 20px;
					padding: 0 5px;
					border: none;
				}
			}
		}
	}

	&.hide-options {
		.el-popper.el-select-dropdown {
			display: none;
		}
		::v-deep .el-input .el-input__suffix {
			display: none;
		}
	}

	::v-deep .el-select-dropdown {
		.custom-option-input::marker {
			content: '';
		}
	}
}
</style>
