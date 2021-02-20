<!-- Nav -->
<script>
    import { goto, stores } from '@sapper/app';
    const { session } = stores();
    export let segment;
    $: current = segment;
    
    let selected = 'text-white bg-gray-900 border-2 border-wlpink';
    let unselected = 'text-gray-300 hover:bg-gray-700 hover:text-white';
    function switchTo() {
        if(current==='events') {
            current = 'services';
            goto('services');
        } else {
            current = 'events';
            goto('events');
        }
    }
    const handleLogout = async () => {
	    const response = await fetch("/logout", { method: "GET" });
	    
        delete $session.token;
        goto("/");
        return false;
    }
</script>

<style>
    .clickon {
        cursor: pointer;
    }
</style>

<nav class="bg-gray-800">
  <div class="ml-6 px-2 sm:px-6 lg:px-8">
    <div class="relative flex items-center justify-between h-16">
      <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex-shrink-0 flex items-center">
          <img class="h-8 w-auto" src="wl-small-logo-gray.png" alt="Workflow">
        </div>
        <div class="hidden sm:block sm:ml-6">
          <div class="flex space-x-4">
            <div on:click="{switchTo}" class="{current === 'events' ? selected : unselected} clickon px-3 py-2 rounded-md text-sm font-medium">Events</div>
            <div on:click="{switchTo}" class="{current === 'services' ? selected : unselected} clickon px-3 py-2 rounded-md text-sm font-medium">Services</div>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span class="sr-only">View unhealthy</span>
          <!-- Heroicon name: outline/bell -->
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div class="ml-3 relative">
          <div>
            <button class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
              <div class="clickon" on:click="{handleLogout}"><i class="text-xl rounded-full text-white fas fa-sign-out-alt"></i></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
