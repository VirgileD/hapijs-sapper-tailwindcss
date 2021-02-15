<script>
	import { goto } from '@sapper/app';
	$: email = '';
	$: password = '';
	$: error = undefined;

	function handleLogin() {
	    console.log(process.env.API_URI);
	    goto("/demos");
	}
</script>

<style>
</style>

<svelte:head>
	<title>Login to DemoPlan&amp;Check</title>
</svelte:head>

<div class="flex h-screen bg-wlblue">
    <div class="max-w-xs w-full m-auto bg-indigo-100 rounded p-5">
        <header>
            <img alt="WL" class="w-20 mx-auto mb-5" src="wl-small-logo-cyan.png" />
        </header>
        <div class="w-full container text-wlgray antialiased bg-white">
            <form on:submit|preventDefault="{handleLogin}">
                <div>
                    <label class="block mb-2 text-wlblue" for="username">Username</label>
                    <input class="w-full p-2 mb-6 text-wlgray border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="text" name="email" bind:value="{email}"/>
                </div>
                <div>
                    <label class="block mb-2 text-wlblue" for="password">Password</label>
                    <input class="w-full p-2 mb-6 text-wlgray border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="password" name="password" bind:value="{password}"/>
                </div>
                <div>          
                    <input class="w-full bg-wlblue hover:bg-wlcyan text-white font-bold py-2 px-4 mb-6 rounded" value="Login" type="submit"/>
                </div>       
            </form>
        <footer>
        <div class="text-wlpink text-sm">
    {#if error}
        <p>{error}</p>
    {:else}
        <p>Enter your credentials</p>
    {/if}
  </div>
</footer> 
</div>
</div>
</div>
