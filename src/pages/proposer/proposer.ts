import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Loading } from 'ionic-angular';
import { RespondantPage } from '../respondant/respondant';
import { AngularFirestore } from '@angular/fire/firestore';
import {LoadingController} from 'ionic-angular';
import { Subject, Observable, Subscription } from 'rxjs';
import { ResultPage } from '../result/result';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-proposer',
  templateUrl: 'proposer.html'
})
export class ProposerPage {
  range=0;
  itemDoc:any;
  item:any;
  proposerData:any;
  firebaseId = "";
  maxtime: any=30;
  timer:any;
  subscription:Subscription;
  subscriptionn:Subscription;
  offer:Subscription;
  game:Subscription;
  professorcode:any;
  retrieveprofessor:any;
  subscribed=false;
  subscriptiontrue=false;
  presstrue=false;
  goonce=0;
  once=0;
  addround=0
  loader:Loading;
  username="";
  constructor(public navCtrl: NavController,
    public afs: AngularFirestore,
    public loadingCtrl:LoadingController,
    public navParams: NavParams,
    public storage:Storage,
    public toastCtrl:ToastController) {

  }
  StartTimer(){
    this.timer = setTimeout(x =>
      {
          if(this.maxtime <= 0) { this.maxtime=30; }
          this.maxtime -= 1;

          if(this.maxtime>0){
           // this.hidevalue = false;
            this.StartTimer();
          }

          else if (this.maxtime==0){

            this.maxtime=30;
            this.range=0;
            let all=this.navParams.data;
            console.log("((proposer.ts page)): " + all["gameMode"]);
            if (all["gameMode"] == "All same opponents") {

              // Yong Lin
              this.presstrue=true;

              this.maxtime=30;
            this.submitProposerOffer();






            // then loading screen for the responder to respond
              // const loading = this.loadingCtrl.create({

              // });

              // this.submitProposerOffer().subscribe((r)=>{
              //   console.log(r)
              // this.afs.collection('Game').doc(r).valueChanges().subscribe(res=>{

              //   console.log(res);
              //   console.log(res["responderResponse"]);
              //   console.log(res["gameId"]);
              //   if (res["responderResponse"]!=""){
              //     this.navCtrl.push(ResultPage)
              //     loading.dismissAll();
              //     loading.dismiss();
              //   }
              //   else{
              //     this.presentLoading(loading);
              //     loading.present();
              //   }

              // })});
              //this.navCtrl.setRoot(RespondantPage);
            }
            else if (all["gameMode"] == "Random all players") {
              // Peishan
              this.presstrue=true;
              this.submitProposerOfferRandomAllPlayers();
              this.maxtime=30;
            }
          }

      }, 1000);


  }

  ionViewDidEnter(){
    let all=this.navParams.data;
    this.afs.collection<any>('Participant').ref
      .where('UUID', '==', all["UUID"])
      .get()
      .then(ress => {

      if (ress.docs.length != 0) {

        ress.forEach(ParticipantDoc => {
          this.username = ParticipantDoc.data().username;
        })
      }
      });
    this.storage.set("proposer"+all["UUID"],"false")

  }

  ngOnInit(){
    let all=this.navParams.data;
    this.storage.set("proposer"+all["UUID"],"false")
    this.presstrue=false;
    this.StartTimer();

  }

  Next(){
    let all=this.navParams.data;
    console.log("((proposer.ts page)): " + all["gameMode"]);
    if (all["gameMode"] == "All same opponents") {

      // Yong Lin
      this.presstrue=true;

    this.submitProposerOffer();






    // then loading screen for the responder to respond
      // const loading = this.loadingCtrl.create({

      // });

      // this.submitProposerOffer().subscribe((r)=>{
      //   console.log(r)
      // this.afs.collection('Game').doc(r).valueChanges().subscribe(res=>{

      //   console.log(res);
      //   console.log(res["responderResponse"]);
      //   console.log(res["gameId"]);
      //   if (res["responderResponse"]!=""){
      //     this.navCtrl.push(ResultPage)
      //     loading.dismissAll();
      //     loading.dismiss();
      //   }
      //   else{
      //     this.presentLoading(loading);
      //     loading.present();
      //   }

      // })});
      //this.navCtrl.setRoot(RespondantPage);
    }
    else if (all["gameMode"] == "Random all players") {
      // Peishan
      this.presstrue=true;
      this.submitProposerOfferRandomAllPlayers();
    }

  }

  submitProposerOffer(){
    let all=this.navParams.data;
    this.storage.get("proposer"+all["UUID"]).then((val) => {
      if (val=="false"){
        if (this.presstrue==true){
          let data=this.navParams.data;
          if (this.once!=0){
            this.once=data["once"];
          }
          let all=this.navParams.data;
          this.professorcode = this.afs.collection<any>('Professor').doc(all["GameId"]);
          this.subscriptiontrue=true;
          this.retrieveprofessor = this.professorcode.valueChanges();
          this.subscriptionn=this.retrieveprofessor.subscribe(ress=>{
        // get the data using proposer's UUID
        // then combine the id with current-round+proposer-name+responder-name
        // using this id, update the proposerAmount & proposerStatus
        this.itemDoc = this.afs.collection<any>('Game', ref => ref.where('proposerUUID', '==', data["UUID"]).where('round', '==', parseInt(ress["round"])));
        this.item = this.itemDoc.valueChanges();

        this.subscribed=true;
        this.subscription= this.item.subscribe(res=>{
          console.log(res,"RESSSSS")

          console.log("My UUID: "+ all.UUID);
          for (let p=0;p<res.length;p++){
            if (res[p]==undefined || res[p]==null){
            }
            else{
              let all=this.navParams.data;
              console.log(all["GameId"])

              console.log(ress,"RESS")
            let roundnow=res[p].round.toString();
            let professorroundnow=ress["round"]
            console.log(roundnow,"roundnow");
            console.log(professorroundnow,"proroundnow")



              if (res[p].proposerUUID == all["UUID"] && roundnow==professorroundnow && res[p].responderResponse=="" && this.goonce==0 && this.once==0 && res[p].proposerAmount==""){ //*** hardcoding round
                // store proposerData here


                this.proposerData = res[p];
               // this.firebaseId = res[p].round + res[p].proposerName + res[p].responderName //ps code i comment out
               this.firebaseId= res[p].proposerUUID + res[p].round +  res[p].responderUUID +res[p].round;

                console.log("firebaseId: " + this.firebaseId );
                this.updateProfessorStatus(this.firebaseId);
                this.goonce+=1;
                this.once+=1;
                let all=this.navParams.data;
                this.presstrue=false;
                let addround=res[p].round+1;
                if (addround<5){
                  let nextroundfirebaseid= res[p].proposerUUID + addround +  res[p].responderUUID + addround;
                  let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"UUID":res[p].proposerUUID,"Amount":this.range,"GameId":all["GameId"],"Round":res[p].round,"once":1,"nextroundfirebaseid":nextroundfirebaseid, gameMode: data["gameMode"]};
                  this.presstrue=false;
                  this.storage.set("proposer"+all["UUID"],"true");
     
                  // clearTimeout(this.timer); 
                  this.navCtrl.setRoot(ResultPage,dict);
                  this.presstrue=false;
                }
                else{
                  let nextroundfirebaseid=res[p].responderUUID + addround + res[p].proposerUUID  + addround;
                  let dict={"Role":"Proposer","FirebaseId":this.firebaseId,"Amount":this.range,"UUID":res[p].proposerUUID,"GameId":all["GameId"],"Round":res[p].round,"once":1,"nextroundfirebaseid":nextroundfirebaseid, gameMode: data["gameMode"]};
                  this.presstrue=false;
                  this.storage.set("proposer"+all["UUID"],"true")
                  
                  // clearTimeout(this.timer); 
                  this.navCtrl.setRoot(ResultPage,dict);
                  this.presstrue=false;
                }



              }
            }

          }})}



        )}
      }
    })




  }

  submitProposerOfferRandomAllPlayers() {

    let all=this.navParams.data;
    this.storage.get("proposer"+all["UUID"]).then((val) => {
        if (val=="false"){
        //alert("Current val: " + val);
      if (this.presstrue) {

        if (this.once!=0){
          this.once = all["once"]
        }

      //alert("My UUID: " + all.UUID);
        this.storage.get(all.UUID+"EnteredProposal").then((val) => {

        if (val == false) {

            this.itemDoc = this.afs.collection<any>('Professor').ref
              .where('gameId', '==', all["GameId"])
              .get()
              .then(ress => {
                //alert("Professor doc: " + ress.docs.length);
              if (ress.docs.length != 0) {

                ress.forEach(ProfessorDoc => {

                  this.itemDoc = this.afs.collection<any>('Game').ref
                    .where('gameId', '==', all["GameId"])
                    .where('proposerUUID', '==', all["UUID"])
                    //.where('round', '==', parseInt(ProfessorDoc.data().round));

                  this.itemDoc.get().then(res=>{ //sacso
                    // alert("Proposer's gameId: " + all["GameId"]);
                    // alert("Proposer's UUID: " + all["UUID"]);
                    // alert("Proposer's round: " + parseInt(ProfessorDoc.data().round));
                    // alert("Proposer: " + res.docs.length); // there's an error!!
                    if (res.docs.length != 0) {

                      /*this.loader =  this.loadingCtrl.create({

                      });
                      this.loader.present();*/
                      res.forEach(ProposerGameDoc =>{

                        if (ProposerGameDoc.data().proposerUUID == all["UUID"]
                          && ProposerGameDoc.data().responderResponse==""
                          && ProfessorDoc.data().round == ProposerGameDoc.data().round){

                            this.proposerData = ProposerGameDoc.data();
                            this.firebaseId= ProposerGameDoc.data().proposerUUID + ProposerGameDoc.data().round +  ProposerGameDoc.data().responderUUID + ProposerGameDoc.data().round;
                            this.updateProfessorStatus(this.firebaseId);

                            let addround=ProposerGameDoc.data().round+1;

                            // round 1, 3, 5, 7, 9 just have to swap their roles
                            // round 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 is required to randomly generate the user
                            if ((addround % 2 !=0)) // *****(it starts from 0)
                            { // swapping roles
                                let nextroundfirebaseid= ProposerGameDoc.data().responderUUID + addround + ProposerGameDoc.data().proposerUUID + addround;

                                let dict={
                                  UUID: all["UUID"],
                                  username: all["username"],
                                  GameId:all["GameId"],
                                  gameMode: all["gameMode"],
                                  Role:"Proposer", // Current Role
                                  Amount:this.range,
                                  FirebaseId: this.firebaseId,
                                  nextroundfirebaseid:nextroundfirebaseid,
                                  // result
                                  Round:ProposerGameDoc.data().round, // Current round
                                  once:1
                                };

                              console.log("((proposer.ts)): "+ all["UUID"]);
                              this.storage.set(all.UUID+"EnteredProposal", true);
                              this.storage.set("proposer"+all["UUID"],"true")
                              //this.loader.dismiss();

                              clearTimeout(this.timer);

                              this.navCtrl.setRoot(ResultPage,dict);
                              this.presstrue=false;

                            }
                            else
                            { // randomizing role in the previous round
                              let nextroundfirebaseid= "2345"; // nth cos they are randomizing users now

                                let dict={
                                  UUID: all["UUID"],
                                  username: all["username"],
                                  GameId:all["GameId"],
                                  gameMode: all["gameMode"],
                                  Role:"Proposer", // Current Role
                                  Amount:this.range,
                                  FirebaseId: this.firebaseId,
                                  nextroundfirebaseid:nextroundfirebaseid, // "23454" <-- hardcoded for now
                                  Round:ProposerGameDoc.data().round, // Current Round
                                  once:1
                                };

                                console.log("((proposer.ts)): "+ all["UUID"]);
                                this.storage.set(all.UUID+"EnteredProposal", true);
                                this.storage.set("proposer"+all["UUID"],"true")
                                //this.loader.dismiss();

                                clearTimeout(this.timer);

                                this.navCtrl.setRoot(ResultPage,dict)
                                this.presstrue=false;
                              }
                        }

                      })
                    }
                  })
                })
              }
            })
          }
          })
        }
      }
    })



    /*this.storage.get(all.UUID+"EnteredProposal").then((val) => {
      if (val == true) {
        if (this.subscription){
          this.subscription.unsubscribe();
        }
        if (this.subscriptionn){
          this.subscriptionn.unsubscribe();
        }
      }
      })*/
    }

  updateProfessorStatus(dbid){
    // Updating the game status to "Ready"s
    this.afs.collection('Game').doc(dbid).update({
      proposerStatus: "Ready",
      proposerAmount: this.range
     })
    .then((data) => {
      //console.log("Data: "+data);
    }).catch((err) => {
      console.log("Err: "+err);
    })
  }



  async presentLoading(loading) {
    return await loading.present();
  }

  ionViewDidLeave(){
  clearTimeout(this.timer);
  // console.log("Should I leave? Yes");
  // return true;
    if (this.subscribed==true){
         this.subscription.unsubscribe();
    }
    if (this.subscriptiontrue==true){
      this.subscriptionn.unsubscribe();
    }

   // this.offer.unsubscribe();
  //  this.game.unsubscribe();
  clearTimeout(this.timer); console.log("Should I leave? Yes"); return true;
  }

  ngOnDestroy() {

    clearTimeout(this.timer);
    let all=this.navParams.data;
    if (all["gameMode"] == "Random all players") {
      if (this.subscription) this.subscription.unsubscribe();
      if (this.subscriptionn) this.subscriptionn.unsubscribe();
    }

  }
}

