<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style global lang="postcss">
    /* only apply purgecss on utilities, per Tailwind docs */
    /* purgecss start ignore */
    @tailwind base;
    @layer base {
      html {
        @apply w-full;
      }
    }
    @tailwind components;
    /* purgecss end ignore */

    @tailwind utilities;
</style>
<div class="3xl">

    <Nav {segment}/>
    <slot></slot>

</div>