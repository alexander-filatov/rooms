import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { NgForm} from '@angular/forms';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { RequestService } from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';
import { FileInfoService } from '../../services/file-info.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import { UploadFilesService } from '../../services/upload-files.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: 'edit-profile.component.html',
  styleUrls: ['edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  error: any;
  messageFromAllUsers: boolean = true;
  dataToServer: any = {};
  userName: string;
  userDisplayedName: string;
  aboutUser: string;
  currentUser: any;
    added_image: any;
    image_dropped:boolean;
    subscription: any;
    button_disabled:boolean;
    cropperSettings: CropperSettings;

    @ViewChild('cropper', undefined)
    cropper:ImageCropperComponent;

    @ViewChild('previewImg') previewed:ElementRef;

  constructor(private requestService: RequestService,
              private storeservice: UserStoreService,
              private fileService: FileInfoService,
              private fileUpload: UploadFilesService,
              private exchangeService: EventsExchangeService) {

      this.cropperSettings = new CropperSettings();
      this.cropperSettings.noFileInput = true;
      this.cropperSettings.width = 150;
      this.cropperSettings.height = 150;
      // this.cropperSettings.minWidth = 100;
      // this.cropperSettings.minHeight = 100;
      this.cropperSettings.minWithRelativeToResolution = true;
      this.cropperSettings.fileType = 'image/jpeg';
      this.cropperSettings.preserveSize = true;
      this.cropperSettings.dynamicSizing = true;
      this.cropperSettings.cropperClass = 'cropper_field';

      this.added_image = {};
  }

  ngOnInit() {

    this.currentUser = this.storeservice.getUserData();
    this.dataToServer['multimedia'] = this.currentUser.user_data.thumbnail || '';
    this.currentUser.user_data.thumbnail && this.fileDropped(false);
    this.userName = this.currentUser.user_data.user_name;
    this.userDisplayedName = this.currentUser.user_data.display_name;
    this.aboutUser = this.currentUser.user_data.about;
  }

    fileDropped(event: any): void {

        this.image_dropped = true;

        let image:any = new Image();
        let that = this;
        let myReader:FileReader = new FileReader();
        if (event){

            let file:File = event.target.files[0];
            myReader.onloadend = function (loadEvent:any) {
                image.src = loadEvent.target.result;
                that.cropper.setImage(image);
            };
            myReader.readAsDataURL(file);

        } else {
            image.crossOrigin="anonymous";
            image.src = this.currentUser.user_data.thumbnail;
            image.onload = function (loadEvent:any) {
                that.cropper.setImage(image);
            };
        }
    }

    editUserProfile(editProfileForm: NgForm):void {

        this.button_disabled = true;
        if (this.image_dropped){
            this.subscription = this.fileUpload.pushResolve.subscribe(result=>{

                this.dataToServer['multimedia'] = result.multimedia;
                this.sendUserInfo(editProfileForm);
                this.subscription.unsubscribe();
            });
            this.fileUpload.uploadFiles(this.previewed, 'rooms')
        } else {
            this.sendUserInfo(editProfileForm)
        }
    }

    sendUserInfo(editProfileForm: NgForm):void {

        let name = editProfileForm.value.user_name.trim();
        if (name){
            editProfileForm.value.user_name = name;
            this.dataToServer['userData'] = editProfileForm.value;
            this.requestService.editUserProfile(this.dataToServer).subscribe(
                data=>{
                    let newUser = {
                        token: this.currentUser.token,
                        user_data: data.user
                    };
                    this.storeservice.saveUserData(newUser);
                    this.currentUser = this.storeservice.getUserData();
                    this.exchangeService.doShowVisualMessageForUser({success:true, message: 'User information changed successful'});
                    this.button_disabled = false;
                },
                error => {
                    this.error = error;
                    console.log(error);
                    this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t save changes'})}
            );
        }

    }


}
