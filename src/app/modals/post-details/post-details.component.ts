import { Component, OnInit, Input} from '@angular/core';

import { NgForm} from '@angular/forms';

import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { FileInfoService } from '../../services/file-info.service';
import { RequestService } from '../../services/request.service';
import {UserStoreService} from '../../services/user-store.service';
import { EventsExchangeService } from '../../services/events-exchange.service';
import { SliderComponent } from '../../components/slider/slider.component';
import {OpenNewWindowService} from '../../services/open-new-window.service';

import { UserInfo } from '../../commonClasses/userInfo';

@Component({
  selector: 'app-post-details',
  templateUrl: 'post-details.component.html',
  styleUrls: ['post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

    @Input() post;
    @Input() walls;
    @Input() is_admin;

  error: any;
  mediaToAppServer: any;
  inProcess: boolean;
  dataToServer: any = {};
  textField: string = '';
    banDays: number = 0;
    currentUserData: UserInfo;
    flagMoveY: boolean = true;
    comments_sort_type: string;
    comment_offset: number;
    comments: any[];
    show_loading: boolean;
    loaded_image_url: string = '';
    disable_submit_button:boolean;

  constructor(public activeModal: NgbActiveModal,
              private fileService: FileInfoService,
              private requestService: RequestService,
              private storeservice: UserStoreService,
              private openNewWindow: OpenNewWindowService,
              private exchangeService: EventsExchangeService) {

      exchangeService.urlChangedEvent.subscribe(
          () => {
              this.activeModal.dismiss()
          });
  }

  ngOnInit() {

      this.currentUserData = this.storeservice.getUserData();
        this.comments_sort_type = 'date_newer';
        this.comment_offset = 0;
        this.comments = [];
        this.show_loading = false;
        this.getComments();

    setTimeout(()=>{
      let modaldialog = document.querySelector('.modal-dialog');
      this.post.media && this.post.media.length ? modaldialog.classList.add('post_details_modal_hi_width') : modaldialog.classList.add('post_details_modal_low_width')
    });
  }

  likeAndUnlikePost(post_id: number, flag: number): void{

    this.requestService.postLikeAndUnlike(post_id, flag).subscribe(
        data=>{
          this.post.liked_by_user = flag ? 0 : 1;
          this.post.liked_by_user ? this.post.likes_count++ : this.post.likes_count--
        },
        error => {
            this.error = error;
            console.log(error);
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
    )
  }



  fileDropped(event: any): void {

      this.disable_submit_button = true;
    this.mediaToAppServer = this.fileService.toNowFileInfo(event.srcElement.files[0]);

    if (this.mediaToAppServer.typeForApp === 'image' || this.mediaToAppServer.typeForApp === 'audio'){

      this.inProcess = true;
      this.requestService.getLinkForFileUpload(this.mediaToAppServer).subscribe(
          data=>{
            this.mediaToAppServer.link = data.urls[0];
            this.putFileToServer(this.mediaToAppServer)
          },
          error => {
              this.error = error;
              console.log(error);
              this.disable_submit_button = false;
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get link for the file'})}
      );
    }
  }

  putFileToServer(settings: any): void {

    this.requestService.fileUpload(settings).subscribe(
        data=>{
          this.inProcess = false;
            this.disable_submit_button = false;
            if (data.typeForApp === 'image'){
                this.loaded_image_url = data.multimedia
            }
        },
        error => {
            this.error = error;
            console.log(error);
            this.disable_submit_button = false;
            this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t send the file'})}
    );
  }

  createNewComment(commentForm: NgForm, event: Event):void {

      event.preventDefault();
    let text = commentForm.value.text ? commentForm.value.text.trim() : '';
    if (text || this.mediaToAppServer){
        this.disable_submit_button = true;
      this.dataToServer.post = this.post;
      this.dataToServer.text = text;
        if (this.mediaToAppServer){

            this.dataToServer.media = {
                type: this.mediaToAppServer['typeForApp'],
                multimedia: this.mediaToAppServer['multimedia']
            }
        } else {
            this.dataToServer.media = []
        }

        this.requestService.createNewComment(this.dataToServer).subscribe(
            data=>{
                this.comment_offset = 0;
                this.comments_sort_type = 'date_newer';
                this.comments = [];
                this.getComments();
                this.loaded_image_url = '';
                this.disable_submit_button = false;
            },
            error => {
                this.error = error;
                console.log(error);
                this.disable_submit_button = false;
                this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t add new comment'})}
        );

        commentForm.resetForm();
        this.mediaToAppServer = '';
    }

  }

    onScrollRichTheEnd(event): void {

            if (this.flagMoveY && this.comments.length){
                if (this.comments_sort_type === 'top'){
                    this.comments_sort_type = 'date_newer';
                    this.comment_offset = 0;
                    this.getComments()
                } else {
                    this.comment_offset = this.comments[this.comments.length - 1].comment_id;
                    this.getComments()
                }
                this.flagMoveY = false;
            }

    }

  changeSorting(): void {

      if (this.comments.length){
          this.comment_offset = 0;
          this.comments = [];
          this.getComments()
      }
  }

  getComments(): void {

      this.show_loading = true;
      let dataToServer = this.post;
      dataToServer.offset = this.comment_offset;
      dataToServer.order_by = this.comments_sort_type;

      this.requestService.getPostComments(dataToServer).subscribe(
          data=>{
              if (data['comments'].length){
                  this.comments = this.comments.concat(data['comments']);
                  this.flagMoveY = true;
              }
              this.show_loading = false;
          },
          error => {
              this.error = error;
              console.log(error);
              this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t get comments list'})}
      );
  }

    likeAndUnlikeComment(comment: any):void {

      let dataToServer = {
          comment_id: comment.comment_id,
          like: comment.liked_by_user ? 0 : 1
      };

        this.requestService.commentLike(dataToServer).subscribe(
            data=>{
               comment.liked_by_user = comment.liked_by_user ? 0 : 1;
               comment.liked_by_user ? comment.likes_count++ : comment.likes_count--
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
        );
    }

    commentOwnerInterraction(int_key: string, block_owner_id: number): void {

        let dataToServer = {
            user_interract_key: int_key,
            user_interract_id: block_owner_id,
            flag: 1
        };

        this.requestService.blockOrMuteUser(dataToServer).subscribe(
            data=>{
                int_key === 'mute' ||  int_key === 'block' ?  this.comments = this.comments.filter((comment)=>{return comment.owner.user_id !== block_owner_id}) : '';
                !this.comments.length && this.getComments()
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
        )
    }


    commentInterraction(int_key: string, comment: any, index?: number, data?: number): void {

        if (int_key === 'remove'){
            this.removeComment(comment, index)
        }
        if (int_key === 'inappropriate'){
            this.inappropriatePost(comment)
        }
        if (int_key === 'ban'){
            comment['bunned'] = !comment['bunned'];
        }
        if (int_key === 'do_ban'){
            comment['ban_days'] = data;
            this.userToBan(comment)
        }
    }

    removeComment(comment: any, index: number): void {

      let dataToServer = {
          comment_id: comment.comment_id,
          post_id: comment.post_id,
          room_id: comment.room_id
      };

        this.requestService.commentDelete(dataToServer).subscribe(
            data=>{
                this.comments.splice(index, 1)
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
        )
    }

    inappropriatePost(comment: any): void {

        let dataToServer = {
            comment_id: comment.comment_id
        };

        this.requestService.commentReport(dataToServer).subscribe(
            ()=>{
                this.exchangeService.doShowVisualMessageForUser({success:true, message: 'Post marked as inappropriate'})
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
        )
    }

    userToBan(data: any): void {

        this.requestService.userToBan(data).subscribe(
            data=>{
                this.exchangeService.doShowVisualMessageForUser({success:true, message: 'User banned successful'})
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
        )
    }

    onMouseLeave(comment: any): void {

        comment['bunned'] = false;
        comment['movedTo'] = false;
    }



    voteForPost(assessment: string): void {

        this.post['voted_data'] = assessment;
        this.requestService.votePost(this.post).subscribe(
            data=>{
                this.post['poll'] = data.poll;
            },
            error => {
                this.error = error;
                console.log(error);
                this.exchangeService.doShowVisualMessageForUser({success:false, message: 'Something wrong, can\'t make this action'})}
        )
    }

    convertPollPercent(): any {

      let result = {
          first: this.post.poll.choice1total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) * 100 || 0,
          second: this.post.poll.choice2total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) * 100 || 0,
          third: this.post.poll.choice3total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) * 100 || 0,
          forth: this.post.poll.choice4total / (this.post.poll.choice1total + this.post.poll.choice2total + this.post.poll.choice3total + this.post.poll.choice4total) *100 || 0
      };

      return result
    }

    openImageLink(content: any):void {

        this.openNewWindow.openImageLink(content)
    }
}
