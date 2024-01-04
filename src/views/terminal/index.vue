<template>
	<div class="app-container">
		<terminal
			name="my-terminal"
			title="web-terminal"
			context="web-terminal"
			@exec-cmd="onExecCmd"
		/>
	</div>
</template>

<script>
import Terminal from 'vue-web-terminal'
// This style needs to be introduced in versions after 3.1.8 and 2.1.12.
// There is no need to introduce theme styles in previous versions.
import 'vue-web-terminal/lib/theme/dark.css'

export default {
	name: 'App',
	components: { Terminal },
	methods: {
		onExecCmd(key, command, success, failed) {
			if (key === 'fail') {
				failed('Something wrong!!!')
			} else if (key === 'date') {
				success(new Date().toDateString())
			} else {
				const allClass = ['success', 'error', 'system', 'info', 'warning']

				const clazz = allClass[Math.floor(Math.random() * allClass.length)]
				success({
					type: 'normal',
					class: clazz,
					tag: '成功',
					content: command,
				})
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.app-container {
	width: 100%;
	height: 800px;
}
</style>
