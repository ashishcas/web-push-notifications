const client = (()=> {
    let serviceWorkerObj = null;
    const notifyBtn = document.getElementById("button-notify");
    const pushButton = document.getElementById("button-push");




    const showNotification = () => {
        let notifyText ="FIRST NOTIFCATION";

        const customNotification = (registration) => {
            const options = {
                body: 'This is Body',
                icon: 'imgs/notification.png',
                actions: [{
                    action: 'search', title:" Try searching",
                },{
                    action: 'close', title:"Forget it",

                }],
                data: {
                    notificationTime: Date.now(),
                    githubUser: "ashishcas"
                }
            }
            registration.showNotification('Second', options)
        }
        navigator.serviceWorker.getRegistration()
        .then(customNotification)
    }

    const showNotificationButton = () => {
        // console.log({notifyBtn})
        notifyBtn.style.display = 'block'
        notifyBtn.addEventListener("click", showNotification);
    }


    const disablePushNotificationButton = () => {
        isUserSubscribed = true
        pushButton.innerText = "DISABLE PUSH NOTIFICATIONS"
        pushButton.style.backgroundColor = "#ea9085"
    }

    const enablePushNotificationButton = () => {
        isUserSubscribed = false
        pushButton.innerText = "ENABLE PUSH NOTIFICATIONS"
        pushButton.style.backgroundColor = "#efb1ff"
    }

    const checkNotificationSupport = function(){

        if(!('Notification' in window)){
            return Promise.reject("THE browser Doesnt support");
        }

        return Promise.resolve("Browser is supported")
    }

    const registerServiceWorker = () => {

            if(!('serviceWorker' in navigator)){
                return Promise.reject("Registering service Worker failed")
            }

            return navigator.serviceWorker.register('service-worker.js')
                   .then(res => {
                        serviceWorkerObj = res
                    //    console.log(res);
                        console.log("service Worker Registered");
                        showNotificationButton();
                        serviceWorkerObj.pushManager.getSubscription()
                        .then((subs) => {
                            if(subs){
                                disablePushNotificationButton();
                            }else{
                                enablePushNotificationButton();
                            }
                        })
                   });
    }

    const requestNotificationService = () => {
        return Notification.requestPermission(status => {
            console.log("Notification Permission status", status)
        })
    }

    checkNotificationSupport()
        .then(registerServiceWorker)
        .then(requestNotificationService)
        .catch(err => console.log(err))

    function urlB64ToUint8Array(url) {
        const padding = '='.repeat((4 - url.length % 4) % 4);
        const base64 = (url + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }


    const pushNotification = ()  => {
        let isSubscribedUser = false;

        const subscribeUser = () => {
            const PUBLIC_KEY = 'BM-gST5_4O0_-e2alb2phGCgRrbBwhI1A6oqxhH2BqgYnuU-jCwapdZRMDDA5qr0eZATSQ3MwNinEqdjlOLdHtY';
            const PUBLICKEYARRAY = urlB64ToUint8Array(PUBLIC_KEY);

            serviceWorkerObj.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: PUBLICKEYARRAY
            })
            .then((res)=>{
                console.log('RESPONSE', JSON.stringify(res, null,4));
                subscribeServer(res);
                disablePushNotificationButton();
            }).catch((err)=>{
                console.log("Failed to subscribe", err);
            })
            console.log("Subscribe")
        }


        const subscribeServer = (subs) => {
            return fetch('http://localhost:3000/addSubscriber',{
                method: 'POST',
                body: JSON.stringify(subs),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        const unSubscribeServer = (id) => {
            return fetch('http://localhost:3000/removeSubscriber',{
                method: 'POST',
                body: JSON.stringify({id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    

        const unSubscribeUser = () => {
            console.log("UN-Subscribe");
            serviceWorkerObj.pushManager.getSubscription()
            .then(res => {
                if(res){
                    // console.log(res)
                    let subsAsString = JSON.stringify(res);
                    let subsAsObj = JSON.parse(subsAsString);
                    unSubscribeServer(subsAsObj.keys.auth)
                    return res.unsubscribe();
                }
            })
            .then(enablePushNotificationButton)
            .catch(err => {
                console.log({err});
            })
        }

        pushButton.addEventListener('click', ()=>{
            console.log({isSubscribedUser})
            if(isSubscribedUser){
                unSubscribeUser()
                isSubscribedUser = false;
            }else{
                subscribeUser();
                isSubscribedUser = true;
            }
        })
    }

    pushNotification();
})()