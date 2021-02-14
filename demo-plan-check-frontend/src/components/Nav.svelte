<script>
	export let segment;
</script>

<style>
</style>

<svelte:head>
	<title>Ugly but working</title>
</svelte:head>

<div class="flex flex-row text-wlgray h-16 my-6">
    <div class="rounded-lg border-2 border-wlgray bg-wlcyan flex flex-row text-wlgray h-16">
        <img class="mr-4" alt="WL" src="wl-small-logo-cyan.png"/>
        <div class="mr-4 capitalize flex items-center justify-center text-2xl font-extrabold">Demo Plan &amp; Check</div>
    </div>
    <div class="mx-4 rounded-lg {segment===undefined? 'bg-wlpink' : 'border-wlpink border-2 hover:bg-wloldpink' } flex flex-row text-wlgray h-16">
        <a href="/"><div class="h-16 px-4 text-wlgray flex items-center justify-center text-2xl">Demos</div></a>
    </div>
    <div class="mx-4 rounded-lg {segment==='services'? 'bg-wlpink' : 'border-wlpink border-2 hover:bg-wloldpink' } flex flex-row text-wlgray h-16">
        <a href="/services"><div class="h-16 px-4 text-wlgray flex items-center justify-center text-2xl">Services</div></a>
    </div>
</div>