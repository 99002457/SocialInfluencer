// firebaseApp=admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://socialinfluencer-10d72.firebaseio.com",
//     authDomain: "socialinfluencer-10d72.firebaseapp.com"
//   });
function getAdvertiserprofileDetails(userID)
{
    const ref= firebaseApp.database().ref('Advertiser/'+userID)
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
}
function getAllAdvertisersprofileDetails()
{
    const ref= firebaseApp.database().ref('Advertiser')
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
}

module.exports ={getAdvertiserprofileDetails,getAllAdvertisersprofileDetails};