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

module.exports.campaign;