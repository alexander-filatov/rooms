import { BrowserModule } from '@angular/platform-browser';
import {JsonpModule} from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileDropModule } from 'angular2-file-drop';
import { DragulaModule } from 'ng2-dragula';
import {TimeAgoPipe} from 'time-ago-pipe';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import {ImageCropperModule} from 'ng2-img-cropper/index';
import { TagInputModule } from 'ngx-chips';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import {
  AllRoomsComponent,
  InsideRoomComponent,
  HeaderComponent,
  RegistrationComponent,
  LogInComponent,
  CanActivateComponent,
  RoomSettingsComponent,
  UpdateRoomComponent,
  AddWallComponent,
  WallsListComponent,
  EditWallComponent,
  DeleteRoomComponent,
  MembersListComponent,
  EditProfileComponent,
  UserSettingsComponent,
  ChangePasswordComponent,
  AboutUserComponent,
  UsersRoomsInProfileComponent,
  UsersPostsInProfileComponent,
  UsersFansInProfileComponent,
  UsersFavesInProfileComponent,
  MutedBlockedComponent,
  UsersDialogComponent,
  UsersMessagesComponent,
  ShowVisualMessagesComponent,
  CanActivateRoomSettingsChildsComponent,
  NotificationsComponent,
  SliderComponent,
  NotificationsSettingsComponent,
  PostDetailsMainComponent,
  AboutRoomComponent} from './components/index';

import {
  CreatePostComponent,
  PostEditeComponent,
  CreateRoomComponent,
  PostDetailsComponent,
  PrivateRoomComponent} from './modals/index'

import { RequestService } from './services/request.service';
import { EventsExchangeService } from './services/events-exchange.service';
import { UserStoreService } from './services/user-store.service';
import { ErrorShowService } from './services/error-show.service';
import { FileInfoService } from './services/file-info.service';
import { AddRequiredInfoService } from './services/add-required-info.service';
import { SafariErrorsFixService } from './services/safari-errors-fix.service';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { UploadFilesService } from './services/upload-files.service';
import { OpenNewWindowService } from './services/open-new-window.service';
import { LinkPreviewService } from './services/link-preview.service';

import { IeHeightDirective } from './directives/ie-height.directive';
import { ScroolEndDirective } from './directives/scrool-end.directive';

import { NameFilterPipe } from './pipes/name-filter.pipe';
import { PollTimeLeftPipe } from './pipes/poll-time-left.pipe';
import { DatexPipe } from './pipes/datex.pipe';
import { AsteriscReplacePipe } from './pipes/asterisc-replace.pipe';
import { AboutRoomModalComponent } from './modals/about-room-modal/about-room-modal.component';

let roomSettingsRoutes: Routes = [
  { path: 'edit-room', component: UpdateRoomComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'delete-room', component: DeleteRoomComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'add-wall', component: AddWallComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'edit-wall/:id', component: EditWallComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'walls-list', component: WallsListComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: 'members-list', component: MembersListComponent, canActivate: [CanActivateRoomSettingsChildsComponent]},
  { path: '',redirectTo: 'members-list', pathMatch:'full'}
];
let aboutUserChildRoutes = [
  { path: 'user-tifos', component: UsersRoomsInProfileComponent},
  { path: 'user-posts', component: UsersPostsInProfileComponent},
  { path: 'user-fans', component: UsersFansInProfileComponent},
  { path: 'user-faves', component: UsersFavesInProfileComponent},
  { path: '',redirectTo: 'user-tifos', pathMatch:'full'}
];

let userSettingsRoutes : Routes = [
  { path: 'edit-profile', component: EditProfileComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'muted-blocked', component: MutedBlockedComponent},
  { path: 'notifications-settings', component: NotificationsSettingsComponent},
  { path: '',redirectTo: 'edit-profile', pathMatch:'full'}
];

let roomChildRoutes : Routes = [
  { path: 'post/:post_id', component: PostDetailsMainComponent},
  { path: 'about', component: AboutRoomComponent}
];

let appRoutes: Routes =[
  { path: 'tifo/:alias', component: InsideRoomComponent, children: roomChildRoutes, canActivate: [CanActivateComponent]},

  { path: 'explore', component: AllRoomsComponent, canActivate: [CanActivateComponent]},
  { path: 'my-tifos', component: AllRoomsComponent, canActivate: [CanActivateComponent]},
  { path: 'search', component: AllRoomsComponent, canActivate: [CanActivateComponent]},

  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LogInComponent},
  { path: 'tifo-settings', component: RoomSettingsComponent, children: roomSettingsRoutes, canActivate: [CanActivateComponent]},
  { path: 'user-settings', component: UserSettingsComponent, children: userSettingsRoutes, canActivate: [CanActivateComponent]},
  { path: 'about-user/:id', component: AboutUserComponent, children: aboutUserChildRoutes, canActivate: [CanActivateComponent]},
  { path: 'user-dialogs', component: UsersDialogComponent, canActivate: [CanActivateComponent]},
  { path: 'notifications', component: NotificationsComponent, canActivate: [CanActivateComponent]},
  { path: '**', component: AllRoomsComponent, canActivate: [CanActivateComponent]}
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, "assets/translates/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    AllRoomsComponent,
    InsideRoomComponent,
    IeHeightDirective,
    HeaderComponent,
    RegistrationComponent,
    LogInComponent,
    CreatePostComponent,
    PostEditeComponent,
    CreateRoomComponent,
    CanActivateComponent,
    PostDetailsComponent,
    RoomSettingsComponent,
    UpdateRoomComponent,
    AddWallComponent,
    WallsListComponent,
    EditWallComponent,
    DeleteRoomComponent,
    MembersListComponent,
    NameFilterPipe,
    PrivateRoomComponent,
    SliderComponent,
    TimeAgoPipe,
    ScroolEndDirective,
    EditProfileComponent,
    UserSettingsComponent,
    ChangePasswordComponent,
    AboutUserComponent,
    UsersRoomsInProfileComponent,
    UsersPostsInProfileComponent,
    UsersFansInProfileComponent,
    UsersFavesInProfileComponent,
    MutedBlockedComponent,
    UsersDialogComponent,
    UsersMessagesComponent,
    ShowVisualMessagesComponent,
    CanActivateRoomSettingsChildsComponent,
    NotificationsComponent,
    NotificationsSettingsComponent,
    PollTimeLeftPipe,
    DatexPipe,
    AsteriscReplacePipe,
    PostDetailsMainComponent,
    AboutRoomComponent,
    AboutRoomModalComponent
  ],
  imports: [
    JsonpModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    FileDropModule,
    DragulaModule,
    Ng2DeviceDetectorModule.forRoot(),
    ImageCropperModule,
    TagInputModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    })
  ],
  providers: [
    RequestService,
    EventsExchangeService,
    UserStoreService,
    ErrorShowService,
    FileInfoService,
    CanActivateComponent,
    AddRequiredInfoService,
    CanActivateRoomSettingsChildsComponent,
    SafariErrorsFixService,
    UploadFilesService,
    ScrollToTopService,
    OpenNewWindowService,
    LinkPreviewService

  ],
  entryComponents: [
    CreatePostComponent,
    PostEditeComponent,
    CreateRoomComponent,
    PostDetailsComponent,
    PrivateRoomComponent,
    AboutRoomModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
