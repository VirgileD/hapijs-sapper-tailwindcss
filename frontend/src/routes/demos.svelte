<!-- Demos -->
<script>
    import wlSmallLogoRound from 'images/wl-small-logo-round.png';
</script>

<style>
</style>

<svelte:head>
	<title>Demos</title>
</svelte:head>

<div class="rounded bg-white shadow max-w-md mx-auto">
    <div class="rounded-lg border-2 border-wlblue shadow max-w-md mx-auto">
        <header class="flex flex-row space-x-6">
            <div class="my-auto">
                <img alt="wl logo" class="mx-auto ml-2 mt-2" src="{wlSmallLogoRound}" />
            </div>
            <div class="container my-auto">
                <h3 class="text-lg font-bold">Demo Label</h3>
                <div class="container">
                    <i class="text-xs text-gray-700 fas fa-user align-middle"></i>&nbsp;
                    <span class="text-xs text-gray-700">Virgile Devaux</span>
                </div>
                <div class="container">
                    <i class="text-xs text-gray-700 fas fa-clock align-middle"></i>&nbsp;
                    <span class="text-xs text-gray-700">2021/05/03 16:40</span>
                </div>
            </div>
            <div class="container my-auto text-middle">
                <i class="text-4xl text-wlgreen fas fa-heartbeat"></i>
            </div>
        </header>
        <section class="ml-6 pt-6">
            <div class="container my-auto text-left">
                <i class="text-wlblue fas fa-handshake align-middle"></i>&nbsp;<span class="text-wlblue">Client Name</span>
            </div>
        </section>
        <section class="pt-6">
            <div class="flex flex-row">
                <div class="container my-auto text-left">
                    <i class="text-wlblue fas fa-link align-middle"></i>&nbsp;<span class="ml-2 text-wlblue">Demoed Service 1</span>
                </div>
                <div class="container my-auto text-middle">
                    <span  class="text-wlgreen fas fa-heartbeat"></span>
                </div>
            </div>
            <div class="flex flex-row">
                <div class="container my-auto text-left">
                    <i class="text-wlblue fas fa-link align-middle"></i>&nbsp;<span class="ml-2 text-wlblue">Demoed Service 1</span>
                </div>
                <div class="container my-auto text-middle">
                    <span  class="text-wlgreen fas fa-heartbeat"></span>
                </div>
            </div>
        </section>
         <footer class="p-4">
          <a href="/" class="uppercase font-bold text-sm text-blue-700 hover:underline">Details</a>        
        </footer>
    </div>
</div>
