// var admin = require("firebase-admin");
// firebaseApp=admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://socialinfluencer-10d72.firebaseio.com",
//     authDomain: "socialinfluencer-10d72.firebaseapp.com"
//   });
class campaign
{
   constructor(id,name,des,categ,end_date,start_date,advertiser)
    {
        this.campaignId=id;
        this.campaignName=name;
        this.Descripton=des;
        this.Categories=categ;
        this.End_date=end_date;
        this.Start_date=start_date;
        this.Advertiser=advertiser;
    }

    set Advertiser(adv)
    {
        this.Advertiser=adv;
    }
    set Start_date(sdate)
    {
        this.Start_date=sdate;
    }
    set End_date(edate)
    {
      this.End_date=edate;
    }
    set Categories(cat)
    {
       this.Categories=cat;
    }
    set Descripton(des)
    {
        this.Descripton=des;
    }
    set campaignName(name)
    {
        this.campaignName=name;
    }
    set campaignId(id)
    {
        this.campaignId=id;
    }

    get Advertiser()
    {
        return this.Advertiser;
    }
    get Start_date()
    {
        return this.Start_date;
    }
    get End_date()
    {
        return this.End_date;
    }
    get Categories()
    {
        return this.Categories;
    }
    get Descripton()
    {
        return this.Descripton;
    }
    get campaignName()
    {
        return this.campaignName;
    }
    get campaignId()
    {
        return this.campaignId;
    }
    
}



function getCamapigns()
{
    const ref= firebaseApp.database().ref('Campaigns'); 
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
    //once for the getting data once since it returns the promise get the snapshot and unwrap the value
}

function getCamapignsbyID(campid)
{
    const ref= firebaseApp.database().ref('Campaigns/'+campid)
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
    //once for the getting data once since it returns the promise get the snapshot and unwrap the value
}

module.exports={ campaign,getCamapigns,getCamapignsbyID}