import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { EventsExchangeService, UserStoreService } from '../../services/index';

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss']
})
export class RoomSettingsComponent implements OnInit {

  error: any;
  currentRoom: any;
  menu_state_toggle: boolean;

  constructor( private storeservice: UserStoreService,
               private router: Router,
               private exchangeService: EventsExchangeService) {

    exchangeService.urlChangedEvent.subscribe(
        () => {
          this.menu_state_toggle = false
        });
  }

  ngOnInit() {
    window.innerWidth > 550 ? this.menu_state_toggle = true : false;
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    !this.currentRoom && this.router.navigateByUrl('/explore');
  }


}
