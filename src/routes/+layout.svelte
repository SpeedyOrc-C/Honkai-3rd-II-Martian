<script lang="ts">
    import "../app.css"
    import { ModeWatcher } from 'mode-watcher'

	const { children } = $props()
</script>

<ModeWatcher />
{@render children()}
