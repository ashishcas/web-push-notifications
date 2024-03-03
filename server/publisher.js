
const webPush = require('web-push');
const faker  = require('@faker-js/faker');


const pushSubscription ={
    "endpoint": "https://wns2-pn1p.notify.windows.com/w/?token=BQYAAACOlhcUCTtrZvx4jjFXuJhoshTyhTj7IKCq4svm1vYRukSRSy0PbcOfM4tZAJLrPX6W98SOz8czj1T2Qs7BLLr61xYNBMOTqzHXwL%2fTY0yGeSW%2fKTYg77d3oRW%2bZ14dElyhO3kKRWfGP6lwcssELR4p%2bo7aNWZKPXonju0531kBUhGi7dAiPXxknQldC8EL2bkvcHTTvL93AfAEh6kafhlcUeuCNbXswNg0e9lN0oj1TofWlB07k%2fZ4ypiG9ntPic5DiDB75y%2bFL92REH87P5s6BygvMPCHkdFkRTbh9t%2fddwbTRSpU2%2b8ht7iCmY4KV%2fg%3d",
    "expirationTime": null,
    "keys": {
        "p256dh": "BG8PeoSi0qEE4VQoVMWUlNr7-5Oqdf9Pde-20BvQPPTCQ1LGT0mrHux2lc-SqtiNt5GuhZAJFWn-4IqTbbfdyA4",
        "auth": "BTtD2jU3NtH-cUe957y4hQ"
    }
}


const vapidPublicKey = 'BM-gST5_4O0_-e2alb2phGCgRrbBwhI1A6oqxhH2BqgYnuU-jCwapdZRMDDA5qr0eZATSQ3MwNinEqdjlOLdHtY'
const vapidPrivateKey = 'vE2Q3CVE4JFCMcGrDe1RaSJZr9lDbEs8KbNqMEMnQdk';
const options = {
        TTL: 600,
        vapidDetails: {
            subject: 'mailto: pushers@pushy.com',
            publicKey: vapidPublicKey,
            privateKey: vapidPrivateKey
    }
}

// webPush.setVapidDetails(
//     options.vapidDetails
// );

/**
 * Sends notifications to the subscribers using web push.
 *
 * @param {array} susbcribers - the list of subscribers to notify
 * @return {Promise} a promise that resolves when the notification is sent
 */

const notify = (subscribers) => {
    if(!subscribers){
        console.log("No subscribers")
        return;
    }

    subscribers.forEach((subscriber, id )=> {
        console.log({subscriber})
        webPush.sendNotification( 
            subscriber,
            "Hello from Server!",
            options
            )
            .then((res)=> console.log(`${subscriber} subscribers notified.`, res))
            .catch(error => console. error('Error in pushing notification', error))
    })
    // const trasaction = faker.helpers.createTransaction();

}

module.exports = {
    notify: notify
}