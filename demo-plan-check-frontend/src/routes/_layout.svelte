<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style global lang="postcss">
    /* only apply purgecss on utilities, per Tailwind docs */
    /* purgecss start ignore */
    @tailwind base;
    @tailwind components;
    /* purgecss end ignore */

    @tailwind utilities;
</style>

<Nav {segment}/>

<slot></slot>
