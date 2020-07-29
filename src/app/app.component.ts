import { Component, ViewChildren, QueryList, OnDestroy } from '@angular/core';

import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {

  backButtonSubscription;
  @ViewChildren(IonRouterOutlet) routerOutlet: QueryList<IonRouterOutlet>;

  navigate: any;
  constructor(
    private platform: Platform,
    public router: Router,
    public alertController: AlertController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.sideMenu();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.backButtonEvent();
      this.splashScreen.hide();
    });
  }

  sideMenu(){
    this.navigate =
    [
      {
        title : 'Home',
        url   : '/home',
        icon  : 'home'
      },
      {
        title : 'Chat',
        url   : '/chat',
        icon  : 'chatbubbles'
      },
      {
        title : 'Contacts',
        url   : '/contacts',
        icon  : 'people'
      },
    ]
  }

  backButtonEvent(){
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      this.routerOutlet.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()){
          outlet.pop();
        } else if (this.router.url === '/home'){
          this.presentAlertConfirm();
        }
      });
    });
  }

    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Confirm to exit App !!!',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Exit',
            handler: () => {
              console.log('Confirm Okay');
              navigator['app'].exitApp();
            }
          }
        ]
      });
      await alert.present();
    }

    ngOnDestroy() {
      this.backButtonSubscription.unsbscribe();
    }


}
