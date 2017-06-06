import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Room } from '../commonClasses/room';


@Injectable()
export class EventsExchangeService {

  constructor() { }

  private emitChangeSource = new Subject<any>();
  private headerChangeSourse = new Subject<any>();
  private headerRoomSearch = new Subject<any>();
  private headerRoomSuggetsRooms = new Subject<any>();
  private dataChangedFromSettings = new Subject<any>();

  changeEmitted = this.emitChangeSource.asObservable();
  changeHeaderViewEmitted = this.headerChangeSourse.asObservable();
  makeHeaderRoomSearch = this.headerRoomSearch.asObservable();
  makeHeaderRoomSuggestRequest = this.headerRoomSuggetsRooms.asObservable();
  dataChangedFromUserSettings = this.dataChangedFromSettings.asObservable();

  wallsToHeader(change: any):void {
    this.emitChangeSource.next(change);
  }

  changeHeaderView(flag: boolean): void {
    this.headerChangeSourse.next(flag);
  }

  searchByHeaderSearchField(request: string): void {
    this.headerRoomSearch.next(request);
  }

  getSuggestRoomsOrUserRooms(flag: string): void {
    this.headerRoomSuggetsRooms.next(flag);
  }

  changeQuontityOfItemsInUserSettings(data: string): void {
    this.dataChangedFromSettings.next(data);
  }

}
