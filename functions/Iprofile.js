// firebaseApp=admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://socialinfluencer-10d72.firebaseio.com",
//     authDomain: "socialinfluencer-10d72.firebaseapp.com"
//   });
function getInfluencersDetails(userID)
{
    const ref= firebaseApp.database().ref('Influencer/'+userID)
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
}

function getAllInfluencerDetail()
{
    const ref= firebaseApp.database().ref('Influencer')
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
}

function getInfluencerProfileDetail(userID)
{
    const ref= firebaseApp.database().ref('Influencer/'+userID+"/Profile")
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
}

function getInfluencerToken(userID){
    const ref= firebaseApp.database().ref('Influencer/'+userID+"/token")
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
}
function getInfluencerNotifications(userID){
    const ref= firebaseApp.database().ref('Influencer/'+userID+"/Notifications")
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
}

module.exports={getInfluencersDetails,getAllInfluencerDetail,getInfluencerProfileDetail,getInfluencerToken,getInfluencerNotifications}