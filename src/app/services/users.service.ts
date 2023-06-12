import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<any> {
    let currentUser = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string) : null;
    let id = currentUser._id;
    return this.httpClient.get<any>(environment.endpoint+'/users/list', { responseType: 'json' })
    .pipe(map(
      (data: any) => {
        for (let i=0; i< data.length; i++) {
          if(data[i]._id == id) {
            data.splice(i, 1);
            break;
          }
        }
        return data;
      }
    ))
  }

  getChat(selected_id: any): Observable<any> {
    let currentUser = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string) : null;
    let id = currentUser._id;
    let postData = {
      user_ids: [id, selected_id],
      chat_type: 'personal'
    }
    return this.httpClient.post<any>(environment.endpoint+'/chat/getChat', postData, { responseType: 'json' });
  }

  createChat(selected_id: any): Observable<any> {
    let currentUser = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string) : null;
    let id = currentUser._id;
    let postData = {
      user_ids: [id, selected_id],
      chat_type: 'personal'
    }
    return this.httpClient.post<any>(environment.endpoint+'/chat/create', postData, { responseType: 'json' });
  }

  saveMessages(chats: any): Observable<any> {
    return this.httpClient.post<any>(environment.endpoint+'/chat/save', chats, { responseType: 'json' });
  }

  getMessages(chat_id: any): Observable<any> {
    return this.httpClient.get<any>(environment.endpoint+'/chat/getMessages?id=' + chat_id, { responseType: 'json' });
  }
}
