import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserStoreService} from '../../services/user-store.service';
import { RequestService } from '../../services/request.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Wall } from '../../commonClasses/wall';

@Component({
  selector: 'app-walls-list',
  templateUrl: 'walls-list.component.html',
  styleUrls: ['walls-list.component.scss']
})
export class WallsListComponent implements OnInit {

  error: any;
  currentRoom: Wall;
  walls: any[] = [];
  showDeleteBlock: boolean;
  dataToServer: any = {};


  constructor(private storeservice: UserStoreService,
              private requestService: RequestService,
              private router: Router,
              private dragulaService: DragulaService) {

    dragulaService.drop.subscribe((event) => {
      console.log(this.walls);
    });
  }

  ngOnInit() {
    this.currentRoom = this.storeservice.getStoredCurrentUserRooms();
    console.log(this.currentRoom)
    this.walls = this.currentRoom.walls;
    for (let i = this.walls.length; i--; this.walls[i].showDeleteConfirm = false){}
  }

  deleteWall(wall: any, index: number): void {

    this.requestService.deleteWall(wall).subscribe(
        data=>{
          this.walls.splice(index, 1);
          this.currentRoom.walls = this.walls;
          this.storeservice.storeCurrentUserRooms(this.currentRoom)
        }, error => {this.error = error; console.log(error);}
    );
  }

  saveOrder(): void {

    this.dataToServer.room_id = this.currentRoom.room_details.room_id;
    this.dataToServer.walls_order = [];
    for (let i = 0; i < this.walls.length; i++){
      this.dataToServer.walls_order.push({wall_id: this.walls[i].wall_id, wall_level: i + 1})
    }
    console.log(this.dataToServer.walls_order)
    this.requestService.changeWallOrder(this.dataToServer).subscribe(
        data=>{

        }, error => {this.error = error; console.log(error);}
    );
  }


}
