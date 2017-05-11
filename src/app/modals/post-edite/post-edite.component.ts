import { Component, OnInit, Input, Output } from '@angular/core';

import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { FileInfoService } from '../../services/file-info.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-post-edite',
  templateUrl: 'post-edite.component.html',
  styleUrls: ['post-edite.component.css']
})
export class PostEditeComponent implements OnInit {
  error: any;
  mediaToAppServer: any[] = [];
  dataToServer: any = {};
  textField: string;
  previewFiles: any[] = [];
  private file: File;

  @Input() wall_id;
  @Input() room_id;

  constructor(public activeModal: NgbActiveModal, private fileService: FileInfoService, private requestService: RequestService,) { }

  @Output() public options = {
    readAs: 'ArrayBuffer'
  };

  public onFileDrop(file: File): void {
    this.mediaToAppServer.length < 4 && this.makeRequestSettings(file)
  }

  ngOnInit() {
    this.textField = '';
  }

  fileDropped (event: any): void {
    this.makeRequestSettings(event.srcElement.files[0])
  }

  makeRequestSettings(data: any): void {

    let settings = this.fileService.toNowFileInfo(data);

    settings && this.mediaToAppServer.push(settings);
    console.log(settings)

    // settings && this.previewFiles.push(data);
    settings && this.requestService.getLinkForFileUpload(settings).subscribe(
        data=>{
          settings.link = data.urls[0];
          this.putFileToServer(settings)
        },
        error => {this.error = error; console.log(error);}
    );

  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          settings.uploaded = true;
          data.typeForApp === 'image' ? settings.img_src = settings.multimedia : ''
        },
        error => {this.error = error; console.log(error);}
    );
  }

  createNewPost(postForm: NgForm):void {

    this.dataToServer.text = postForm.value.text;
    if (postForm.value.mod_type){
      this.dataToServer.media = [];
      for (let i = 0; i < this.mediaToAppServer.length; i++){
        this.dataToServer.media.push({type: this.mediaToAppServer[i]['typeForApp'], multimedia: this.mediaToAppServer[i]['multimedia']})
      }
    } else {
      this.dataToServer.poll = {};
      this.dataToServer.poll['question'] = postForm.value.question;
      postForm.value.choice1 ? this.dataToServer.poll['choice1'] = postForm.value.choice1 : '';
      postForm.value.choice2 ? this.dataToServer.poll['choice2'] =  postForm.value.choice2 : '';
      postForm.value.choice3 ? this.dataToServer.poll['choice3'] =  postForm.value.choice3 : '';
      postForm.value.choice4 ? this.dataToServer.poll['choice4'] =  postForm.value.choice4 : '';
      this.dataToServer.poll['duration'] = postForm.value.duration;
    }

    this.requestService.createNewPost(this.wall_id, this.room_id, this.dataToServer).subscribe(
        data=>{
          this.activeModal.close(data)
        },
        error => {this.error = error; console.log(error);}
    );
  }

  deletePreviewedImg(index: number): void {
    this.mediaToAppServer.splice(index, 1)
  }

}
