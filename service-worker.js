
self.addEventListener('notificationclose', (event) => {
    console.log("Closed")
})


self.addEventListener('notificationclick', (event) => {

    if(event.action === "search"){
        const githubUser = event.notification.data.githubUser;
        clients.openWindow(`https://github.com/${githubUser}`)
    }

    if(event.action === "close"){
        const githubUser = event.notification.data.githubUser;
        clients.openWindow(`https://lowes.com`)
    }
    console.log("Clicked", event.notification.data)

})

self.addEventListener('push', (event) => {
    console.log({event})
    const data = event.data.text();
    const options = {
        body: data
    }

    event.waitUntil(
        self.registration.showNotification("Server Push", options)
        // clients.matchAll()
    )
})