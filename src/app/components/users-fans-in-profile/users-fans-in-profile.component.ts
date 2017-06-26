import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { EventsExchangeService } from '../../services/events-exchange.service';
import { RequestService } from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';

@Component({
  selector: 'app-users-fans-in-profile',
  templateUrl: 'users-fans-in-profile.component.html',
  styleUrls: ['users-fans-in-profile.component.scss']
})
export class UsersFansInProfileComponent implements OnInit, OnDestroy {

  error: any;
  allUsers: any[];
  tree: any;
  user_id: any;
  users_offset: number;
  flagMoveY: boolean = true;
  show_loading: boolean;
    routerSubscription: any;
    currentUser: any;

  constructor(private requestService: RequestService,
              private router: Router,
              private exchangeService: EventsExchangeService,
              private storeservice: UserStoreService) { }

  ngOnInit() {

   this.users_offset = 0;
    this.allUsers = [];
    this.show_loading = true;
      this.currentUser = this.storeservice.getUserData();

      this.exchangeService.srcrooReachEndEvent.subscribe(()=>{

          if (this.flagMoveY){
              this.users_offset = this.allUsers[this.allUsers.length - 1].user_id;
              this.flagMoveY = false;
              this.getUserFans()
          }
      });

      this.routerSubscription = this.router.events.subscribe(event=>{

          if (event instanceof NavigationEnd ){
              let parses = this.router.parseUrl(this.router.url);
              this.tree = parses.root.children.primary.segments;
              this.user_id = this.tree[1].path / 22;
              this.getUserFans()
          }
      })

  }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

  getUserFans():void {

    let dataToServer = {
      user_id: this.user_id,
      user_id_last: this.users_offset,
    };

    this.show_loading = true;

    this.requestService.getUsersFans(dataToServer).subscribe(
        data=>{
          if (data['users'].length){
            this.allUsers = this.allUsers.concat(data['users']);
            this.flagMoveY = true;
          }
          this.show_loading = false;
        },
        error => {
          console.log(error);
          this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get fans list'})
        }
    );
  }

  faveUser(user: any): void {

    if (!user.is_fave){

      let dataToServer = {
        user_id_fave: user.user_id,
        is_fave: user.is_fave
      };

      this.requestService.faveUnfaveUser(dataToServer).subscribe(
          data=>{
            user.is_fave = 1;
            this.user_id == this.currentUser.user_data.user_id && this.exchangeService.changeQuontityOfItemsInUserSettings('fave')
          },
          error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
      )
    }
  }

}
